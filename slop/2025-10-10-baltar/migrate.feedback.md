# Migration Plan Review: Baltar Modernization

## Executive Summary

This document provides technical review feedback from two Node.js core contributors on the proposed migration plan for the `baltar` package. While the overall direction is sound, there are several critical concerns that need to be addressed before proceeding with the migration.

---

## James Snell's Review - Streams, HTTP, and Performance

### Overall Assessment

The migration plan shows good intentions, but there are several technical concerns that need careful attention. The streaming architecture of `baltar` is its core value proposition, and any mistakes here will break existing functionality in subtle ways that may not be caught by tests.

### Critical Concerns

#### 1. Stream Handling Migration (Phase 4)

**Major Issue: Incorrect tar API usage**

The proposed migration example contains a critical error:

```javascript
// Proposed (INCORRECT)
await pipeline(
  request,
  zlib.createGunzip(),
  tar.extract({ cwd: opts.path }),  // ❌ This is NOT the correct API
);
```

The `tar` package (v7.x) does NOT have an `extract()` method that works this way in a pipeline. You need to use `tar.x()` (extract stream) which is the streaming variant:

```javascript
// Correct approach
import { pipeline } from 'node:stream/promises';
import { x as tarExtract } from 'tar';

await pipeline(
  request,
  zlib.createGunzip(),
  tarExtract({ cwd: opts.path })
);
```

However, there's a deeper issue: `tar.x()` is a writable stream that extracts files, but it doesn't emit 'entry' events the way the old `tar.Extract()` does. The current code relies on these events:

```javascript
.pipe(tar.Extract({ path: opts.path }))
.on('entry', function (e) {
  debug('untar', e.path);
  entries.push(e);
})
```

**You will lose this functionality** if you blindly switch to `pipeline()`. You need to either:

1. Keep using the old API with `.pipe()` and manually handle errors
2. Create a custom Transform stream that wraps tar extraction and emits entry events
3. Rewrite the API to not return entries (breaking change)

#### 2. Dual Piping Hazard in pull()

The current implementation has a subtle issue that will become more problematic with undici:

```javascript
if (opts.tarball) {
  request.pipe(fs.createWriteStream(opts.tarball))
    .on('error', done);
}

return request
  .pipe(zlib.Gunzip())
  .pipe(tar.Extract({ path: opts.path }))
```

This is **dual-piping** the same readable stream (request) to two destinations. This is dangerous because:

1. Backpressure handling becomes unpredictable
2. If one pipe fails, the other may continue consuming data
3. Data races can occur where one consumer reads faster than the other

**Recommendation:**
Use `PassThrough` stream with piping, or better yet, use the `stream.Readable.from()` pattern with tee-like behavior:

```javascript
import { PassThrough } from 'node:stream';

const response = await request(url);
const stream1 = new PassThrough();
const stream2 = new PassThrough();

response.body.on('data', chunk => {
  stream1.write(chunk);
  stream2.write(chunk);
});

response.body.on('end', () => {
  stream1.end();
  stream2.end();
});

// Now safely pipe both
await Promise.all([
  pipeline(stream1, fs.createWriteStream(opts.tarball)),
  pipeline(stream2, zlib.createGunzip(), tarExtract({ cwd: opts.path }))
]);
```

Or use a proper Tee implementation from a library.

#### 3. undici Integration Issues (Phase 3)

Several concerns with the proposed undici usage:

**Issue A: RetryAgent is not what you think it is**

The migration plan proposes:

```javascript
const agent = new RetryAgent(new Agent({
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 30_000,
}), {
  maxRetries: 3,
  minTimeout: 500,
  maxTimeout: 30_000,
  timeoutFactor: 2
});
```

**Problems:**

1. `RetryAgent` doesn't exist in undici's public API. You might be thinking of the `RetryHandler`, which is a different beast entirely.
2. The configuration object shown is actually for the `retry` package, not undici
3. undici's `Agent` doesn't have `keepAliveMaxTimeout` - it has `keepAliveMaxTimeout` but it's not what you think

**Correct approach:**

```javascript
import { Agent, request } from 'undici';
import { pipeline } from 'node:stream/promises';

const agent = new Agent({
  connections: 10,
  keepAliveTimeout: 10_000,
  keepAliveTimeoutThreshold: 1_000,
  pipelining: 1
});

// For retries, you need to implement your own retry logic
async function requestWithRetry(url, options, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request(url, { ...options, dispatcher: agent });
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 30000)));
      }
    }
  }
  throw lastError;
}
```

**Issue B: Stream handling with undici**

undici's response body is already a stream (specifically a `Readable`), but you need to handle it correctly:

```javascript
const { statusCode, headers, body } = await request(url, { dispatcher: agent });

if (statusCode >= 400) {
  body.destroy(); // Important: consume or destroy the body
  throw new Error(`HTTP ${statusCode}`);
}

// body is already a Readable stream
await pipeline(
  body,
  zlib.createGunzip(),
  // ... rest of pipeline
);
```

#### 4. Error Handling Patterns

The current code uses `once()` for error handling:

```javascript
done = once(function (err) {
  if (err) { return callback(err); }
  callback(null, entries);
});
```

With `pipeline()`, you don't need `once()` anymore because `pipeline()` guarantees cleanup and single callback execution. But you DO need to ensure proper stream cleanup on error.

**Critical:** The current code attaches error handlers to each stream in the chain. With `pipeline()`, you only need one try-catch:

```javascript
try {
  await pipeline(
    response.body,
    zlib.createGunzip(),
    // ... rest
  );
} catch (err) {
  // All streams are already cleaned up
  throw err;
}
```

But again, this breaks the `entries` collection pattern.

#### 5. unpack() Method Stream Forwarding Issue

The current `unpack()` implementation has a clever but fragile pattern:

```javascript
gunzip
  .pipe(extract)
  .on('error', gunzip.emit.bind(gunzip, 'error'))
  .on('entry', gunzip.emit.bind(gunzip, 'entry'))
  .on('finish', gunzip.emit.bind(gunzip, 'done'));

return gunzip;
```

This forwards events from `extract` to `gunzip` so that consumers only need to listen to one stream. This is actually a reasonable pattern, but it has issues:

1. Error events can fire twice (once on extract, once on gunzip)
2. Memory leaks if the stream is never consumed
3. The 'done' event should probably be 'finish' or 'close'

**Recommendation:**

Use a `PassThrough` stream as an event bus instead of abusing gunzip:

```javascript
import { PassThrough } from 'node:stream';

export function unpack(opts) {
  const output = new PassThrough();
  const extract = tar.extract({ cwd: opts.path });
  const gunzip = zlib.createGunzip();

  pipeline(gunzip, extract)
    .then(() => output.emit('done'))
    .catch(err => output.destroy(err));

  extract.on('entry', entry => output.emit('entry', entry));

  // Return the PassThrough as the writable
  gunzip.pipe(output);
  return gunzip;
}
```

But honestly, with modern APIs, you should probably just return an object with the stream and an async iterator:

```javascript
export function unpack(opts) {
  const extract = tar.extract({ cwd: opts.path });
  const gunzip = zlib.createGunzip();

  gunzip.pipe(extract);

  return {
    stream: gunzip,
    entries: (async function*() {
      for await (const entry of extract) {
        yield entry;
      }
    })()
  };
}
```

### Performance Concerns

#### 1. Worker Threads Mention (Phase 8)

The plan mentions: "Consider worker threads for CPU-intensive operations"

**This is dangerous advice without context.** The overhead of serializing data to/from worker threads is significant. The only CPU-intensive operation in `baltar` is gzip compression, which is already handled by native C++ code in the zlib module.

Worker threads would ADD overhead, not reduce it. Don't do this unless you're doing custom compression algorithms in JavaScript.

#### 2. Connection Pooling

The plan suggests connection pooling with undici, which is good, but be aware:

- undici's Agent already does connection pooling by default
- The `connections` option limits the max connections per origin
- For most use cases, the defaults are fine
- Over-tuning can actually hurt performance

**Don't cargo-cult connection pool settings from other projects.**

#### 3. HTTP/2 Consideration

The plan mentions "Native HTTP/2 support" as a benefit. Be careful here:

1. HTTP/2 requires HTTPS (in practice)
2. Most npm registries still use HTTP/1.1
3. HTTP/2 can be SLOWER for large single-file transfers due to stream overhead
4. You need to handle ALPN negotiation

Don't force HTTP/2. Let undici negotiate it automatically:

```javascript
const agent = new Agent({
  allowH2: true  // Allows HTTP/2 but doesn't force it
});
```

### Compatibility Concerns

#### 1. Node.js Version Support

The plan proposes **minimum Node.js 18.x**. This is reasonable for 2024/2025, but be aware:

- Node.js 18 goes EOL in April 2025
- You should probably target Node.js 20 as the minimum (Active LTS)
- Node.js 22 is current, but still relatively new

**Recommendation:** Support Node.js 20.x and 22.x only. This gives you:
- Native test runner (stable in 20.x)
- Better fetch/undici integration
- Cleaner ESM support
- Pattern matching (if you want to use it)

#### 2. Stream API Changes

The stream API has evolved significantly. The old `.pipe()` API won't go away, but the new patterns are different enough that you'll confuse users who are familiar with the old code.

**Documentation will be critical.** Show clear before/after examples.

### Missing Considerations

#### 1. AbortController Support

The plan mentions AbortController but doesn't show how to integrate it. This is critical for modern HTTP clients:

```javascript
export async function pull(opts, { signal } = {}) {
  const { body } = await request(opts.url, {
    signal,  // Pass the AbortSignal
    method: opts.method || 'GET',
    headers: opts.headers
  });

  // The request will be aborted if signal fires
}
```

Users should be able to:

```javascript
const controller = new AbortController();

const promise = baltar.pull({ url, path }, { signal: controller.signal });

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

await promise; // Will throw AbortError
```

#### 2. Progress Events

For large tarball downloads, progress events are essential. The plan mentions this but doesn't show how. With streams:

```javascript
import { Transform } from 'node:stream';

class ProgressStream extends Transform {
  constructor(opts) {
    super();
    this.total = opts.total || 0;
    this.current = 0;
    this.onProgress = opts.onProgress;
  }

  _transform(chunk, encoding, callback) {
    this.current += chunk.length;
    if (this.onProgress) {
      this.onProgress({
        current: this.current,
        total: this.total,
        percent: this.total ? (this.current / this.total) * 100 : 0
      });
    }
    callback(null, chunk);
  }
}
```

Then insert it in the pipeline:

```javascript
await pipeline(
  body,
  new ProgressStream({ total: contentLength, onProgress: opts.onProgress }),
  zlib.createGunzip(),
  // ...
);
```

#### 3. Streaming Response for push()

The current `push()` method returns a stream representing the HTTP response. With undici and async/await, this pattern changes:

```javascript
// Old pattern
baltar.push(opts)
  .on('response', res => console.log(res.statusCode))
  .on('data', chunk => console.log('response data', chunk));

// New pattern needs to be designed carefully
const response = await baltar.push(opts);
// response.body is a stream
for await (const chunk of response.body) {
  console.log('response data', chunk);
}
```

This is a **breaking API change** that needs careful thought.

### Recommendations Summary

1. **Don't break the entry collection feature** - This is a core part of the API
2. **Test dual-pipe scenarios thoroughly** - The tarball save feature is tricky
3. **Research tar package's streaming API** - The migration example is wrong
4. **Implement retry logic yourself** - Don't assume undici has it built-in
5. **Add AbortController support** - Essential for modern Node.js
6. **Document breaking changes extensively** - Users will struggle with the new patterns
7. **Consider keeping a v1 compatibility layer** - At least for 12 months
8. **Don't use worker threads** - They add overhead here
9. **Test with realistic workloads** - Not just unit tests
10. **Profile before and after** - Ensure performance actually improves

### Overall Grade: C+

The plan shows understanding of modern Node.js, but lacks depth in critical areas (streams, undici, tar API). The proposed code examples contain errors that would cause bugs in production. More research and prototyping needed before execution.

---

## Bradley Meck's Review - Modules, Security, and Package Health

### Overall Assessment

The ESM migration strategy needs significant refinement. There are several footguns in the plan that will cause issues for users. Additionally, the dependency modernization plan misses some important security and maintenance considerations.

### Critical Concerns

#### 1. ESM Migration Strategy (Phase 2)

**Major Issue: Incomplete dual-package strategy**

The plan mentions:

> "Consider providing both ESM and CJS builds for compatibility"

This is too vague. You need to decide UPFRONT whether you're doing:

1. **ESM-only** (breaking change, simplest)
2. **Dual-package with conditional exports** (complex but compatible)
3. **ESM wrapper over CJS** (safest but maintains old code)

**The dual-package hazard is real.** If you provide both CJS and ESM, you risk module duplication:

```javascript
// In CJS
const baltar = require('baltar');

// In ESM
import * as baltarESM from 'baltar';

// These might be DIFFERENT instances with different state!
```

For `baltar`, this is probably fine since it's stateless, but you need to be aware.

**Recommendation:**

Given that `baltar` is a small library with no internal state, go **ESM-only** with a major version bump. Provide a CJS bridge using a tool like `tsup` or `unbuild` if needed:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.js",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./index.js"
}
```

But keep the CJS build as a generated artifact, not source code.

#### 2. Exports Field Configuration

The plan says "Add exports field to package.json" but doesn't show what it should look like. This is critical to get right:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./index.js",
      "require": "./dist/index.cjs",
      "default": "./index.js"
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.cjs",
  "module": "./index.js",
  "types": "./types/index.d.ts"
}
```

**Important considerations:**

1. **Always export package.json** - Tools need this for version detection
2. **Include types field** - Even if you're not using TypeScript, you can generate .d.ts from JSDoc
3. **Order matters** - Put "types" first, "default" last
4. **Don't use wildcards** - Be explicit about what's exported

**Security concern:** If you don't use "exports", all internal files are accessible:

```javascript
// Without exports - users can do this (BAD)
import secret from 'baltar/lib/internal/secret.js';

// With exports - this is blocked (GOOD)
```

#### 3. Import Specifier Issues

When converting to ESM, you MUST include file extensions:

```javascript
// CJS (works)
const foo = require('./foo');

// ESM (WRONG)
import foo from './foo';

// ESM (CORRECT)
import foo from './foo.js';
```

The migration plan doesn't mention this. Every single import statement needs `.js` extension.

**Also:** If you import from node core modules, use the `node:` protocol:

```javascript
// Old
import fs from 'fs';
import path from 'path';

// New (better)
import fs from 'node:fs';
import path from 'node:path';
```

This has several benefits:
1. Clearer that it's a core module
2. Prevents shadowing by user-land packages
3. Slightly faster resolution

#### 4. Dynamic Import and createRequire

The plan mentions using `createRequire` for CJS-only dependencies. **Be very careful here.**

If you're doing:

```javascript
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cjsModule = require('some-cjs-only-package');
```

This defeats the purpose of ESM migration. You're essentially running CJS code inside ESM.

**Better approach:**

1. Check if the dependency has an ESM version
2. If not, wait for it or contribute a fix
3. As a last resort, use dynamic import with proper error handling:

```javascript
let cjsModule;
try {
  // Try ESM first
  cjsModule = await import('some-package');
} catch {
  // Fall back to CJS interop
  const require = createRequire(import.meta.url);
  cjsModule = require('some-package');
}
```

But honestly, for `baltar`, all your dependencies should support ESM by now:
- `tar` - supports ESM
- `diagnostics` - CJS only, but tiny (consider replacing)
- `hyperquest` - CJS only, you're replacing it anyway
- `fstream-ignore` - DEPRECATED, you should replace it

### Dependency Security Concerns

#### 1. fstream-ignore is DEPRECATED

The plan says "Replace with native solution or `ignore` package" but doesn't emphasize that **fstream-ignore is deprecated and has known security issues.**

From the fstream-ignore repo:
> "This module is deprecated. Please use something else."

This is not optional - you MUST replace it. The `ignore` package is a good choice:

```javascript
import ignore from 'ignore';
import fs from 'node:fs/promises';
import path from 'node:path';

async function loadIgnoreRules(basePath) {
  const ig = ignore();

  // Load .npmignore or .gitignore
  try {
    const npmignore = await fs.readFile(path.join(basePath, '.npmignore'), 'utf8');
    ig.add(npmignore);
  } catch {
    try {
      const gitignore = await fs.readFile(path.join(basePath, '.gitignore'), 'utf8');
      ig.add(gitignore);
    } catch {
      // No ignore files
    }
  }

  return ig;
}
```

But be aware: `fstream-ignore` had specific npm-related logic. You'll need to replicate this.

**Better approach:** Use the `npm-packlist` package, which is what npm itself uses:

```javascript
import packlist from 'npm-packlist';

const files = await packlist({ path: dirPath });
// Returns array of files that would be included in npm pack
```

This handles all the edge cases correctly.

#### 2. hyperquest Replacement Security

Switching from `hyperquest` to `undici` is good for security, but you need to be aware of differences:

**Certificate validation:**
```javascript
// hyperquest - uses Node.js defaults
// undici - you can customize

import { Agent } from 'undici';

const agent = new Agent({
  connect: {
    // Stricter TLS settings
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
});
```

**Request size limits:**
```javascript
// Prevent DoS from large responses
const { statusCode, headers, body } = await request(url, {
  bodyTimeout: 30_000,
  headersTimeout: 10_000,
  maxResponseSize: 100 * 1024 * 1024  // 100MB limit
});
```

**URL validation:**
```javascript
// Prevent SSRF attacks
function validateUrl(urlString) {
  const url = new URL(urlString);

  // Block private IPs
  if (url.hostname === 'localhost' ||
      url.hostname.startsWith('127.') ||
      url.hostname.startsWith('10.') ||
      url.hostname.startsWith('192.168.')) {
    throw new Error('Private IPs not allowed');
  }

  // Require HTTPS in production
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('HTTPS required in production');
  }

  return url;
}
```

The migration plan mentions "Add input validation" but doesn't show specifics.

#### 3. Tarball Integrity Checks (Phase 8)

The plan mentions "Add integrity checks for downloaded tarballs" but this is too vague.

**You should support Subresource Integrity (SRI):**

```javascript
import crypto from 'node:crypto';

export async function pull(opts) {
  const { url, path, integrity } = opts;

  // integrity format: "sha512-base64hash"
  if (integrity) {
    const [algorithm, expectedHash] = integrity.split('-');
    const hash = crypto.createHash(algorithm);

    // Pipe through hash calculation
    await pipeline(
      response.body,
      new Transform({
        transform(chunk, encoding, callback) {
          hash.update(chunk);
          callback(null, chunk);
        }
      }),
      // ... rest of pipeline
    );

    const actualHash = hash.digest('base64');
    if (actualHash !== expectedHash) {
      throw new Error(`Integrity check failed: expected ${expectedHash}, got ${actualHash}`);
    }
  }
}
```

This is critical for security - users should be able to verify tarball integrity.

### Phantom Dependency Concerns (pnpm Migration)

#### 1. Phase 1 - pnpm Migration

The plan correctly identifies that pnpm "prevents phantom dependencies", but doesn't explain what will break.

**A phantom dependency is a package you import but don't declare in package.json.** It works in npm/yarn because of flat node_modules, but breaks with pnpm.

**You need to audit your code for phantom dependencies BEFORE switching to pnpm:**

```bash
# Find all imports
grep -r "require\|import" . --include="*.js" | grep -v node_modules

# Check each one is in package.json
```

For `baltar`, I see potential issues:

1. **tar** - You're using `tar.Extract()` and `tar.Pack()`, but what about their dependencies?
2. **fstream** - Is this a direct dependency or does it come through fstream-ignore?

Run this check:

```javascript
import { builtinModules } from 'node:module';

// List all imports in your code
const imports = [
  'fs', 'zlib', 'path', 'diagnostics', 'hyperquest',
  'fstream-ignore', 'once', 'tar'
];

// Check which are NOT built-in and NOT in package.json
const deps = Object.keys(packageJson.dependencies);
const missing = imports
  .filter(imp => !builtinModules.includes(imp))
  .filter(imp => !deps.includes(imp));

console.log('Phantom dependencies:', missing);
```

#### 2. pnpm Strictness Issues

pnpm's strict resolution can break things:

```json
{
  "pnpm": {
    "packageExtensions": {
      "fstream-ignore@*": {
        "dependencies": {
          "fstream": "*"
        }
      }
    }
  }
}
```

You might need to patch old packages that have incorrect peer dependency declarations.

**Recommendation:** Fix the dependencies first, THEN migrate to pnpm. Don't do both at once.

### Package Boundary and Encapsulation

#### 1. Private Implementation Details

With ESM, you have a golden opportunity to properly encapsulate internal code:

```
baltar/
├── index.js           (public API)
├── lib/
│   ├── http.js        (internal - not exported)
│   ├── streams.js     (internal - not exported)
│   └── tar.js         (internal - not exported)
└── package.json
```

The `exports` field enforces this:

```json
{
  "exports": {
    ".": "./index.js"
    // lib/* is NOT exported, so users can't access it
  }
}
```

This is good for:
1. **Refactoring** - You can change internals without breaking users
2. **Security** - Users can't access unintended code paths
3. **Tree-shaking** - Bundlers can optimize better

#### 2. Type Safety Without TypeScript

The plan mentions "Consider TypeScript definitions (.d.ts files)" but you can go further with JSDoc:

```javascript
/**
 * @typedef {Object} PullOptions
 * @property {string} url - URL to download from
 * @property {string} path - Path to extract to
 * @property {string} [method='GET'] - HTTP method
 * @property {Object} [headers] - HTTP headers
 * @property {string} [tarball] - Optional path to save tarball
 */

/**
 * Downloads and extracts a tarball
 * @param {PullOptions} opts - Pull options
 * @param {AbortSignal} [opts.signal] - Abort signal
 * @returns {Promise<Array<TarEntry>>} Extracted entries
 */
export async function pull(opts) {
  // ...
}
```

Then generate .d.ts files:

```bash
npx -p typescript tsc --declaration --allowJs --emitDeclarationOnly --outDir types index.js
```

This gives TypeScript users full type safety without writing TypeScript.

### Test Infrastructure Concerns (Phase 6)

#### 1. Native node:test Migration

The plan proposes migrating to `node:test`. This is fine, but be aware:

**Loss of ecosystem tooling:**
- Mocha has decades of plugins and extensions
- node:test is still relatively new
- Coverage reporting is less mature

**Migration gotchas:**

```javascript
// Mocha
describe('baltar.pull', function() {
  it('should download tarball', function(done) {
    baltar.pull(opts, done);
  });
});

// node:test
import { describe, it } from 'node:test';

describe('baltar.pull', () => {
  it('should download tarball', async () => {
    await new Promise((resolve, reject) => {
      baltar.pull(opts, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });
});
```

The callback-to-promise conversion is awkward. Consider promisifying the API:

```javascript
import { promisify } from 'node:util';

export const pullAsync = promisify(pull);

// In tests
await pullAsync(opts);
```

#### 2. c8 vs istanbul

Switching from istanbul to c8 is good, but be aware:

**c8 uses V8 coverage, which is more accurate but different:**
- It can report uncovered lines that istanbul missed
- It might show different coverage percentages
- Some edge cases (like `|| default`) are handled differently

**Don't be surprised if coverage goes down initially.** This is often because c8 is more accurate.

### Missing Security Considerations

#### 1. Dependency Audit

The plan doesn't mention running security audits:

```bash
pnpm audit
```

Before and after the migration, you should:

1. Run `pnpm audit` and fix all HIGH/CRITICAL issues
2. Enable GitHub Dependabot alerts
3. Set up automated dependency updates with Renovate or Dependabot

#### 2. Supply Chain Security

With ESM and modern tooling, consider:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build && npm run test",
    "prepack": "pinst --disable",
    "postpack": "pinst --enable"
  }
}
```

This ensures:
- You don't accidentally publish broken code
- Git hooks don't run during install (security)

#### 3. Package Provenance

npm now supports package provenance (proof of origin):

```bash
npm publish --provenance
```

This requires:
- Publishing from GitHub Actions
- Having a public repo
- Using npm 9.5.0+

Add this to your CI/CD workflow to prove your package hasn't been tampered with.

### Recommendations Summary

1. **Choose ESM-only or dual-package UPFRONT** - Don't leave it as "consider"
2. **Use proper exports field** - Be explicit, include types and package.json
3. **Add .js extensions to all imports** - Required for ESM
4. **Replace fstream-ignore immediately** - It's deprecated and insecure
5. **Implement tarball integrity checks** - Critical for security
6. **Audit for phantom dependencies** - Before switching to pnpm
7. **Use npm-packlist instead of manual ignore parsing** - More correct
8. **Add SSRF protection** - Validate URLs before fetching
9. **Generate .d.ts from JSDoc** - Type safety without TypeScript
10. **Set up dependency auditing** - pnpm audit + Dependabot

### Additional Recommendations

#### 1. Consider Publishing Smaller Packages

`baltar` does four things:
1. Download & extract (pull)
2. Pack & upload (push)
3. Extract locally (unpack)
4. Pack locally (pack)

Consider splitting into:
- `@baltar/core` - Local pack/unpack
- `@baltar/http` - HTTP operations
- `baltar` - Re-exports everything (for compatibility)

Benefits:
- Users who only need local operations don't pull in http deps
- Smaller package size
- Better tree-shaking
- Easier to maintain

But this adds complexity, so only do it if there's demand.

#### 2. Consider URL Scheme Support

Modern Node.js supports custom URL schemes. You could add:

```javascript
// Support for file:// URLs
baltar.pull({ url: 'file:///path/to/local.tgz', path: './output' });

// Support for data: URLs (for testing)
baltar.pull({ url: 'data:application/gzip;base64,...', path: './output' });
```

This would make testing easier and support more use cases.

### Overall Grade: B-

The ESM migration plan is underspecified and risks breaking changes. The security considerations are mentioned but not detailed enough. The pnpm migration is well-justified but lacks phantom dependency audit. Overall, the plan needs more specificity and security focus before implementation.

---

## Combined Recommendations - Priority Order

### Must Fix Before Starting

1. **Research tar package streaming API** - The current migration example is incorrect
2. **Choose ESM strategy** - Decide on ESM-only vs dual-package
3. **Audit for phantom dependencies** - Required before pnpm switch
4. **Replace fstream-ignore** - It's deprecated and insecure

### Critical During Migration

1. **Fix dual-pipe issue in pull()** - Use proper stream tee
2. **Add .js extensions to all imports** - Required for ESM
3. **Implement proper undici integration** - With custom retry logic
4. **Set up proper exports field** - With security in mind
5. **Add integrity checks** - For tarball verification

### Important Enhancements

1. **Add AbortController support** - Modern cancellation
2. **Implement progress events** - For large downloads
3. **Add comprehensive JSDoc** - For type generation
4. **Set up security auditing** - pnpm audit + Dependabot
5. **Add SSRF protection** - Validate URLs

### Nice to Have

1. **Package provenance** - Supply chain security
2. **Split into smaller packages** - Better tree-shaking
3. **Add URL scheme support** - More flexible
4. **Worker threads** - DON'T DO THIS (adds overhead)

---

## Conclusion

The migration plan has a solid foundation but needs significant refinement in the implementation details. The biggest risks are:

1. **Breaking stream handling** - The examples shown contain errors
2. **Incomplete ESM strategy** - Needs to be more specific
3. **Security gaps** - Especially around dependency replacement and URL validation

**Recommendation:** Do a spike/prototype of the stream and undici integration before committing to the full migration. The success of this migration depends on getting those two pieces right.

**Time estimate revision:** The original 5-day estimate is optimistic. With proper testing and edge case handling, expect 10-15 days of focused development.

Good luck, and feel free to reach out if you hit issues during implementation.

---

*James Snell - Node.js TSC, Streams and Performance*

*Bradley Meck (bmeck) - Node.js Modules Team, ESM and Security*
