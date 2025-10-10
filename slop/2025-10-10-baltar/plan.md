# Baltar 2.0 Migration Plan - Final Version

**Author:** Matteo Collina (Node.js TSC, Fastify/Pino creator)
**Date:** 2025-10-10
**Status:** Final - Ready for Implementation

---

## Executive Summary

After reviewing the original migration plan and feedback from James and Bradley, here's what we're actually going to do. I'm going to be direct: **some of the original plan was over-engineered, and some of the feedback is valid but not critical for a tarball utility**.

**What matters:**
1. Replace deprecated/insecure dependencies (`fstream-ignore`, `hyperquest`)
2. Modernize to ESM (properly)
3. Fix the dual-pipe footgun in `pull()`
4. Use proper stream error handling
5. Don't break the API unless absolutely necessary

**What doesn't matter:**
- Worker threads (adds overhead, no benefit)
- HTTP/2 (most registries don't support it, and it's slower for large files)
- Monorepo with pnpm workspaces (it's a single package, not a monorepo)
- Splitting into smaller packages (premature optimization)

**Timeline:** 3-4 days of focused work, not the 5 days originally estimated, and definitely not the 10-15 days Bradley suggested. This is a small utility, not React.

---

## Accepted Feedback

### 1. Stream Handling is Critically Broken in Original Plan ✅

**James is 100% correct.** The original migration example is wrong:

```javascript
// This DOES NOT WORK
await pipeline(
  request,
  zlib.createGunzip(),
  tar.extract({ cwd: opts.path }),  // ❌ Wrong API
);
```

**Reality check:** The `tar` package (v7.x) doesn't have an `extract()` method that works in pipelines. The old code uses `tar.Extract()` which emits 'entry' events that we need to preserve for the API.

**What we'll actually do:**
Keep the `.pipe()` chain but add proper error handling. The promise-based `pipeline()` is great, but **not at the cost of breaking the API**. Users depend on the 'entry' events.

```javascript
// Pragmatic solution - keep what works, fix what's broken
const extract = tar.Extract({ path: opts.path });
const gunzip = zlib.createGunzip();

extract.on('entry', (entry) => {
  entries.push(entry);
});

// Use pipeline for error handling, but keep the event API
await pipeline(
  response.body,
  gunzip,
  extract
).catch(err => {
  // All streams are cleaned up automatically
  throw err;
});

return entries;
```

**Accepted: HIGH PRIORITY**

### 2. Dual-Piping is a Real Bug ✅

James caught this. The current code does:

```javascript
if (opts.tarball) {
  request.pipe(fs.createWriteStream(opts.tarball));
}
return request.pipe(zlib.Gunzip()).pipe(tar.Extract({ path: opts.path }));
```

This is piping the same readable stream to two destinations. **This is broken** - backpressure doesn't work correctly, and errors are unpredictable.

**What we'll do:**
Use a PassThrough stream to tee the data:

```javascript
import { PassThrough } from 'node:stream';
import { pipeline } from 'node:stream/promises';

if (opts.tarball) {
  const tee = new PassThrough();
  response.body.pipe(tee);

  // Save to file in parallel
  const savePromise = pipeline(tee, fs.createWriteStream(opts.tarball));

  // Extract from original stream
  const extractPromise = pipeline(
    response.body,
    gunzip,
    extract
  );

  await Promise.all([savePromise, extractPromise]);
} else {
  await pipeline(response.body, gunzip, extract);
}
```

**Actually, let's be smarter.** Use a Transform stream that tees and doesn't duplicate memory:

```javascript
class TeeStream extends Transform {
  constructor(destination) {
    super();
    this.destination = destination;
  }

  _transform(chunk, encoding, callback) {
    this.destination.write(chunk);
    callback(null, chunk);
  }

  _flush(callback) {
    this.destination.end();
    callback();
  }
}
```

**Accepted: HIGH PRIORITY**

### 3. undici Integration Needs Realistic Implementation ✅

The original plan showed a `RetryAgent` that doesn't exist in undici. James is right - we need to implement retry ourselves.

**What we'll actually do:**

```javascript
import { Agent, request } from 'undici';

const agent = new Agent({
  connections: 10,
  keepAliveTimeout: 10000,
  keepAliveTimeoutThreshold: 1000
});

async function fetchWithRetry(url, options, maxRetries = 3) {
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    try {
      const response = await request(url, {
        ...options,
        dispatcher: agent
      });

      if (response.statusCode >= 400) {
        response.body.destroy();
        throw new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`);
      }

      return response;
    } catch (err) {
      lastError = err;
      attempt++;

      if (attempt < maxRetries) {
        // Exponential backoff: 500ms, 1000ms, 2000ms
        const delay = Math.min(500 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

Simple, no dependencies, works. Don't overthink it.

**Accepted: HIGH PRIORITY**

### 4. fstream-ignore Must Be Replaced ✅

Bradley is absolutely correct - `fstream-ignore` is deprecated and has security issues. We MUST replace it.

**But:** I disagree with his suggestion to use `npm-packlist`. That's overkill and adds npm-specific logic we don't need. The `ignore` package is simpler and does exactly what we need.

```javascript
import ignore from 'ignore';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function loadIgnoreRules(basePath) {
  const ig = ignore();

  // Try .npmignore first, fall back to .gitignore
  try {
    const npmignore = await readFile(join(basePath, '.npmignore'), 'utf8');
    ig.add(npmignore);
  } catch {
    try {
      const gitignore = await readFile(join(basePath, '.gitignore'), 'utf8');
      ig.add(gitignore);
    } catch {
      // No ignore files, that's fine
    }
  }

  // Always ignore these
  ig.add(['.git', 'node_modules', '.DS_Store']);

  return ig;
}
```

Then use `tar.create()` with a filter function instead of the old `Ignore` stream.

**Accepted: HIGH PRIORITY**

### 5. ESM Migration Strategy - Be Explicit ✅

Bradley is right - the original plan was too vague about ESM strategy. We need to decide upfront.

**Decision: ESM-only with generated CJS build.**

Why? Because:
1. It's 2025, ESM is standard
2. Node 20+ is now the minimum (Node 18 EOL is April 2025)
3. Maintaining dual source is painful
4. We can generate CJS from ESM automatically

**package.json setup:**

```json
{
  "name": "baltar",
  "version": "2.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.js",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.cjs",
  "module": "./index.js",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

We'll use a simple build step to generate the CJS version. Tools like `esbuild` can do this trivially.

**Accepted: HIGH PRIORITY**

### 6. Add File Extensions to All Imports ✅

Bradley is correct - ESM requires explicit file extensions.

```javascript
// Wrong
import { foo } from './lib/foo';

// Right
import { foo } from './lib/foo.js';
```

And use `node:` prefix for built-ins:

```javascript
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
```

This is non-negotiable for ESM. Accept it.

**Accepted: MEDIUM PRIORITY** (Easy to fix during conversion)

### 7. AbortController Support ✅

James mentioned this, and he's right - modern APIs should support cancellation.

```javascript
export async function pull(opts, { signal } = {}) {
  const response = await fetchWithRetry(opts.url, {
    method: opts.method || 'GET',
    headers: opts.headers || {},
    signal  // Pass through to undici
  });

  // The rest of the pipeline will also respect the signal
}
```

Users can then:

```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await baltar.pull({ url, path }, { signal: controller.signal });
```

**Accepted: MEDIUM PRIORITY** (Nice to have, easy to add)

---

## Rejected Feedback

### 1. Worker Threads for Performance ❌

**Original plan suggested:** "Consider worker threads for CPU-intensive operations"

**Reality:** This is cargo-cult optimization. The only CPU-intensive work is gzip compression, which is **already native C++ code** in the zlib module. Worker threads would add:
- Serialization overhead
- Context switching overhead
- Complexity

For zero benefit. The zlib C++ code is already faster than anything we could do in a worker thread.

**Rejected: DO NOT IMPLEMENT**

### 2. HTTP/2 as a Feature ❌

**Original plan mentioned:** "Native HTTP/2 support" as a benefit of undici

**Reality:**
1. Most npm registries still use HTTP/1.1
2. HTTP/2 can be SLOWER for large single-file transfers (like tarballs)
3. The multiplexing benefits of HTTP/2 don't apply when downloading one big file
4. undici will negotiate HTTP/2 automatically if the server supports it

Don't force HTTP/2. Let undici handle it:

```javascript
const agent = new Agent({
  allowH2: true  // Allow but don't force
});
```

**Rejected: Use defaults, don't force HTTP/2**

### 3. Splitting into Smaller Packages ❌

**Bradley suggested:** Split into `@baltar/core`, `@baltar/http`, etc.

**Reality:** This is premature optimization. The entire package is ~150 lines of code. The overhead of managing multiple packages, versioning, publishing, and documentation far outweighs any tree-shaking benefits.

**When to revisit:** If the package grows to >1000 lines or we see significant demand for "just local packing" without HTTP.

**Rejected: Keep as single package**

### 4. Extensive Security Features (SSRF, Rate Limiting, etc.) ❌

**Bradley suggested:** URL validation to prevent SSRF, rate limiting, size limits, etc.

**Reality:** These are valid for a general-purpose HTTP library, but `baltar` is a utility for downloading and uploading tarballs. The user controls the URL - if they want to shoot themselves in the foot, that's their choice.

**What we WILL do:**
- Add optional integrity checking (SHA-512 hashes)
- Validate that URLs are actually HTTP/HTTPS

**What we WON'T do:**
- Block localhost/private IPs (users might have legitimate use cases)
- Rate limiting (users can implement this themselves if needed)
- Force HTTPS (users might have private registries on HTTP)

This is a low-level utility, not a security framework.

**Partially accepted:** Integrity checks only

### 5. Package Provenance ❌

**Bradley suggested:** Add npm package provenance with `--provenance` flag

**Reality:** This is a good practice for large, high-security packages. For a small utility like baltar? It's overhead without significant benefit. The package is open source, the code is visible, and we're not handling secrets.

**When to revisit:** If the package becomes critical infrastructure for many projects.

**Rejected: Not worth the CI complexity**

### 6. Migrate to node:test ❌

**Original plan suggested:** Replace Mocha with native `node:test`

**Reality:** Mocha works fine. The test suite is small and stable. Migrating provides zero value and will take time debugging differences in behavior.

**Better approach:** Keep Mocha, upgrade to latest version. When we write NEW tests, use `node:test` if it makes sense.

Don't refactor for the sake of refactoring.

**Rejected: Keep Mocha**

### 7. Extensive JSDoc for Type Generation ❌

**Bradley suggested:** Add comprehensive JSDoc to generate `.d.ts` files

**Reality:** This is useful for large libraries with complex APIs. Baltar has 4 functions with simple signatures. Just write the `.d.ts` file by hand:

```typescript
// index.d.ts
export interface PullOptions {
  url: string;
  path: string;
  method?: string;
  headers?: Record<string, string>;
  tarball?: string;
  integrity?: string;
}

export interface PullCallbackOptions {
  signal?: AbortSignal;
}

export function pull(opts: PullOptions, callbackOpts?: PullCallbackOptions): Promise<any[]>;
export function unpack(opts: string | { path: string }): NodeJS.ReadWriteStream;
export function pack(opts: string | { path: string; ignoreFiles?: string[] }): NodeJS.ReadableStream;
export function push(opts: PullOptions & { ignoreFiles?: string[] }): NodeJS.WritableStream;
```

Done. 20 lines. Don't overthink it.

**Rejected: Write .d.ts by hand**

---

## Final Implementation Plan

### Phase 1: Dependency Updates (Day 1 Morning)

**Priority: HIGH**

1. Replace `fstream-ignore` with `ignore` package
2. Replace `hyperquest` with `undici`
3. Update `tar` to latest 7.x (check for any API changes)
4. Update `diagnostics` to latest
5. Remove `once` (not needed with promises)

**Testing:** Run existing tests after each change to ensure nothing breaks.

### Phase 2: Fix Critical Bugs (Day 1 Afternoon)

**Priority: HIGH**

1. Fix the dual-pipe bug in `pull()` using TeeStream
2. Implement proper retry logic with undici
3. Add proper stream error handling with `pipeline()`

**Code changes:**

```javascript
// lib/streams.js
import { Transform } from 'node:stream';

export class TeeStream extends Transform {
  constructor(destination) {
    super();
    this.destination = destination;
    this.destinationError = null;

    destination.on('error', (err) => {
      this.destinationError = err;
    });
  }

  _transform(chunk, encoding, callback) {
    if (this.destinationError) {
      return callback(this.destinationError);
    }

    if (!this.destination.write(chunk)) {
      this.destination.once('drain', () => callback(null, chunk));
    } else {
      callback(null, chunk);
    }
  }

  _flush(callback) {
    this.destination.end();
    callback();
  }
}

// lib/http.js
import { Agent, request } from 'undici';

const agent = new Agent({
  connections: 10,
  keepAliveTimeout: 10000,
  keepAliveTimeoutThreshold: 1000
});

export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    try {
      const response = await request(url, {
        ...options,
        dispatcher: agent
      });

      if (response.statusCode >= 400) {
        response.body.destroy();
        throw new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`);
      }

      return response;
    } catch (err) {
      lastError = err;
      attempt++;

      if (attempt < maxRetries && !options.signal?.aborted) {
        const delay = Math.min(500 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

**Testing:** Specifically test:
- Simultaneous tarball save and extraction
- Network failures with retry
- Large files (100MB+) to ensure backpressure works

### Phase 3: ESM Migration (Day 2)

**Priority: HIGH**

1. Add `"type": "module"` to package.json
2. Convert all `require()` to `import`
3. Convert all `module.exports` to `export`
4. Add `.js` extensions to all local imports
5. Use `node:` prefix for built-ins
6. Set up exports field properly

**New file structure:**

```
baltar/
├── index.js              (ESM source)
├── lib/
│   ├── http.js          (undici wrapper)
│   ├── streams.js       (TeeStream, etc.)
│   └── ignore.js        (ignore file handling)
├── dist/
│   └── index.cjs        (Generated CJS build)
├── index.d.ts           (TypeScript definitions)
├── package.json
└── test/
    └── *.test.js        (ESM tests)
```

**Build script:**

```javascript
// build.js
import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'dist/index.cjs',
  external: ['undici', 'tar', 'ignore', 'diagnostics']
});
```

Add to package.json:

```json
{
  "scripts": {
    "build": "node build.js",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "esbuild": "^0.20.0"
  }
}
```

**Testing:** Run existing test suite, verify both ESM and CJS imports work.

### Phase 4: API Improvements (Day 3)

**Priority: MEDIUM**

1. Add AbortController support to `pull()` and `push()`
2. Add optional integrity checking (SHA-512)
3. Modernize the `unpack()` return value (keep backward compat)
4. Add proper TypeScript definitions

**Enhanced pull() function:**

```javascript
export async function pull(opts, callbackOpts = {}) {
  if (!opts?.path || !opts?.url) {
    throw new Error('opts = { path, url } is required');
  }

  const { signal } = callbackOpts;
  const method = opts.method || 'GET';
  const entries = [];

  debug('Download %s %s', method, opts.url);
  debug('Extract to %s', opts.path);

  // Fetch with retry
  const response = await fetchWithRetry(opts.url, {
    method,
    headers: opts.headers || {},
    signal
  }, 3);

  // Set up extraction
  const extract = tar.extract({ cwd: opts.path });
  const gunzip = zlib.createGunzip();

  extract.on('entry', (entry) => {
    debug('untar', entry.path);
    entries.push(entry);
  });

  // Handle tarball save + extraction
  if (opts.tarball) {
    const writeStream = fs.createWriteStream(opts.tarball);
    const tee = new TeeStream(writeStream);

    await pipeline(
      response.body,
      tee,
      gunzip,
      extract
    );
  } else {
    await pipeline(
      response.body,
      gunzip,
      extract
    );
  }

  // Optional integrity check
  if (opts.integrity) {
    await verifyIntegrity(opts.tarball || opts.path, opts.integrity);
  }

  return entries;
}
```

**Integrity checking:**

```javascript
// lib/integrity.js
import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export async function verifyIntegrity(filepath, expectedIntegrity) {
  // Format: "sha512-base64hash"
  const [algorithm, expectedHash] = expectedIntegrity.split('-');

  if (!algorithm || !expectedHash) {
    throw new Error(`Invalid integrity format: ${expectedIntegrity}`);
  }

  const hash = crypto.createHash(algorithm);

  await pipeline(
    createReadStream(filepath),
    async function* (source) {
      for await (const chunk of source) {
        hash.update(chunk);
        yield chunk;
      }
    }
  );

  const actualHash = hash.digest('base64');

  if (actualHash !== expectedHash) {
    throw new Error(
      `Integrity check failed for ${filepath}\n` +
      `Expected: ${expectedHash}\n` +
      `Actual:   ${actualHash}`
    );
  }
}
```

**Testing:**
- Test abort signal works correctly
- Test integrity checking with valid/invalid hashes
- Verify backward compatibility (old API still works)

### Phase 5: Testing & Documentation (Day 4)

**Priority: MEDIUM**

1. Update all tests to ESM
2. Add tests for new features (abort, integrity)
3. Update README with new API
4. Add migration guide for v1 → v2
5. Performance benchmark (compare old vs new)

**Migration guide should include:**

```markdown
# Migrating from Baltar 1.x to 2.x

## Breaking Changes

1. **Minimum Node.js version:** 20.0.0 (was: any)
2. **ESM-only source:** Import instead of require (CJS build provided)
3. **Async API:** pull() returns a Promise (callback style deprecated)

## Migration Examples

### Before (v1.x)
```javascript
const baltar = require('baltar');

baltar.pull({ url, path }, (err, entries) => {
  if (err) throw err;
  console.log('Extracted:', entries.length);
});
```

### After (v2.x) - ESM
```javascript
import * as baltar from 'baltar';

const entries = await baltar.pull({ url, path });
console.log('Extracted:', entries.length);
```

### After (v2.x) - CJS (still works)
```javascript
const baltar = require('baltar');

const entries = await baltar.pull({ url, path });
console.log('Extracted:', entries.length);
```

## New Features

### AbortController Support
```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await baltar.pull({ url, path }, { signal: controller.signal });
```

### Integrity Checking
```javascript
await baltar.pull({
  url,
  path,
  integrity: 'sha512-base64hash'
});
```
```

**Performance benchmarks:**

```javascript
// benchmark/pull.js
import { performance } from 'node:perf_hooks';
import * as baltar from '../index.js';

const url = 'https://registry.npmjs.org/express/-/express-4.18.2.tgz';
const iterations = 10;

async function benchmark() {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await baltar.pull({ url, path: `/tmp/test-${i}` });
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`Average: ${avg.toFixed(2)}ms`);
  console.log(`Min: ${min.toFixed(2)}ms`);
  console.log(`Max: ${max.toFixed(2)}ms`);
}

benchmark();
```

---

## Timeline

**Total: 3-4 days of focused development**

| Day | Phase | Time | Tasks |
|-----|-------|------|-------|
| 1 AM | Dependency Updates | 3h | Replace fstream-ignore, hyperquest, update others |
| 1 PM | Bug Fixes | 3h | Fix dual-pipe, add retry logic, proper error handling |
| 2 AM | ESM Migration | 3h | Convert to ESM, add .js extensions, update imports |
| 2 PM | Build Setup | 2h | Set up CJS build, test both formats |
| 3 AM | API Improvements | 3h | Add abort support, integrity checking |
| 3 PM | Testing | 3h | Update tests, add new test cases |
| 4 | Documentation | 4h | Update README, write migration guide, benchmarks |

**Buffer:** 1 day for unexpected issues

---

## Success Metrics

**Must achieve:**
1. ✅ All existing tests pass
2. ✅ No performance regression (≤5% slower is acceptable for added features)
3. ✅ Both ESM and CJS imports work correctly
4. ✅ No deprecation warnings in Node 20 and 22

**Should achieve:**
1. ✅ 10-20% faster downloads (undici vs hyperquest)
2. ✅ Properly handles large files (>100MB) without memory issues
3. ✅ Abort signal works reliably
4. ✅ Zero security vulnerabilities in `npm audit`

**Nice to have:**
1. ✅ Full TypeScript autocomplete in editors
2. ✅ Comprehensive migration guide
3. ✅ Performance benchmarks documented

---

## Risk Mitigation

### High Risk: Breaking existing consumers

**Mitigation:**
1. Publish beta releases (`2.0.0-beta.1`, etc.)
2. Ask major consumers to test (if we can identify them)
3. Provide clear migration guide
4. Maintain v1.x branch for 6 months for critical fixes
5. Bump major version (1.x → 2.x) to signal breaking changes

### Medium Risk: Performance regression

**Mitigation:**
1. Benchmark before and after each phase
2. Profile with `node --prof` for CPU-intensive operations
3. Test with realistic workloads (100MB+ tarballs)
4. If we find regressions, we fix them or revert

### Low Risk: ESM/CJS compatibility issues

**Mitigation:**
1. Test both formats in CI
2. Use esbuild to generate CJS (well-tested tool)
3. Test with real-world projects using both formats

---

## What's NOT in This Plan

Things we explicitly decided NOT to do:

1. ❌ Worker threads
2. ❌ Force HTTP/2
3. ❌ Split into multiple packages
4. ❌ Extensive security features (SSRF protection, rate limiting)
5. ❌ Package provenance
6. ❌ Migrate from Mocha to node:test
7. ❌ Extensive JSDoc (wrote .d.ts by hand instead)
8. ❌ pnpm migration (not a monorepo, npm/yarn work fine)

If someone wants these features, they can contribute a PR after 2.0.0 is stable.

---

## Final Thoughts

This is a **pragmatic modernization**, not a complete rewrite. We're fixing real issues (deprecated dependencies, stream bugs) and adopting modern standards (ESM, undici) while keeping the API mostly intact.

The original plan was too ambitious. The feedback was valuable but some of it was overkill for a small utility. This plan focuses on **shipping working code** that's faster, more secure, and easier to maintain.

**Most importantly:** We're not breaking things just to use the latest shiny tool. Every change has a concrete benefit:
- undici: Faster, more reliable HTTP
- ESM: Future-proof, better tooling support
- Fix dual-pipe: Prevents data corruption bugs
- integrity checking: Security without overhead

Let's ship it.

---

**Matteo Collina**
Node.js TSC Member
Creator of Fastify and Pino
Performance fanatic
