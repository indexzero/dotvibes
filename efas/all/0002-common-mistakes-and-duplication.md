---
authors: Ecosystem Team <ecosystems@chainguard.dev>
state: implemented
discussion:
---

# EFA 0002: Common Agent Mistakes and How to Avoid Them

This document catalogs the most frequently observed mistakes made by AI agents (Claude, Copilot, etc.) when working on this codebase, along with the correct remedies.

## Motivation & Prior Art

AI agents are powerful tools for software development, but they have predictable failure modes. Without explicit guidance, agents repeatedly make the same mistakes:

1. Using unnecessary async imports when static imports suffice
2. Using `npm` instead of `pnpm` for package management
3. Using relative paths for cross-package imports instead of package names
4. Reimplementing package spec parsing instead of using existing utilities
5. Forgetting to move test files when relocating source files
6. Flagging test fixtures as security vulnerabilities
7. Suggesting the `tmp` package instead of Node.js core `fs.mkdtempSync()`

These mistakes waste developer time in code review and can introduce subtle bugs. This EFA serves as a reference that agents should consult before making changes.

## Detailed Design

### Mistake 1: Unnecessary Async Imports

**The Problem**

Agents frequently use dynamic `import()` when static `import` statements would work fine:

```javascript
// WRONG: Unnecessary async import
async function processPackage(spec) {
  const { PackageSpec } = await import('@chainguard/setlists');
  return PackageSpec.parse(spec);
}
```

This pattern:
- Adds unnecessary async complexity
- Defeats tree-shaking optimizations
- Makes dependencies harder to trace
- Slows down module initialization

**When Async Import IS Appropriate**

Dynamic imports are correct in these specific cases:

1. **Command dispatchers** - Loading commands based on user input:
   ```javascript
   // CORRECT: Command loaded based on runtime argument
   const mod = await import(`./cmd/${commandName}.js`);
   ```

2. **Optional dependencies** - Features that may not be installed:
   ```javascript
   // CORRECT: Optional feature with graceful fallback
   let prettier;
   try {
     prettier = await import('prettier');
   } catch {
     prettier = null; // Feature disabled
   }
   ```

3. **Lazy loading for performance** - Deferring expensive module initialization:
   ```javascript
   // CORRECT: Heavy module loaded only when needed
   async function generateReport() {
     const { PDFGenerator } = await import('./heavy-pdf-lib.js');
     return new PDFGenerator().create();
   }
   ```

4. **Circular dependency resolution** - Breaking import cycles:
   ```javascript
   // CORRECT: Breaking circular dependency
   async function getValidator() {
     // This module imports us, so we import it lazily
     const { Validator } = await import('./validator.js');
     return new Validator();
   }
   ```

**The Remedy**

Use static imports at the top of the file:

```javascript
// CORRECT: Static import at module level
import { PackageSpec } from '@chainguard/setlists';

function processPackage(spec) {
  return PackageSpec.parse(spec);
}
```

**Decision Flowchart**

```
Do I need to import a module?
           │
           ▼
Is the module name known at compile time?
           │
    ┌──────┴──────┐
    │ YES         │ NO (e.g., `./cmd/${name}.js`)
    ▼             ▼
Is it an         Use async import()
optional dep?
    │
┌───┴───┐
│ YES   │ NO
▼       ▼
Use     Will the module always be used
try/    when this file is loaded?
catch       │
import  ┌───┴───┐
        │ YES   │ NO (lazy loading)
        ▼       ▼
    Use static  Use async import()
    import
```

### Mistake 2: Using npm Instead of pnpm

**The Problem**

Agents default to `npm` commands when this monorepo uses `pnpm`:

```bash
# WRONG
npm install lodash
npm test
npm run build
```

This causes:
- Lockfile conflicts (`package-lock.json` vs `pnpm-lock.yaml`)
- Dependency resolution differences
- Workspace linking failures
- CI/CD breakage

**The Remedy**

Always use `pnpm`:

```bash
# CORRECT
pnpm add lodash
pnpm test
pnpm run build

# Workspace-specific commands
pnpm --filter @chainguard/setlists test
pnpm -r test  # Run in all packages
```

**Evidence This Is a pnpm Monorepo**

The root `package.json` contains:

```json
{
  "pnpm": {
    "overrides": { ... },
    "patchedDependencies": { ... }
  }
}
```

The repository contains:
- `pnpm-lock.yaml` (NOT `package-lock.json`)
- `pnpm-workspace.yaml` defining workspace packages

**Quick Reference**

| npm command | pnpm equivalent |
|-------------|-----------------|
| `npm install` | `pnpm install` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| `npm test` | `pnpm test` |
| `npm run <script>` | `pnpm run <script>` or `pnpm <script>` |
| `npm ci` | `pnpm install --frozen-lockfile` |
| `npx <cmd>` | `pnpm exec <cmd>` or `pnpm dlx <cmd>` |

### Mistake 3: Cross-Package Imports Using Relative Paths

**The Problem**

Agents use relative paths to import from other workspace packages instead of using the package name:

```javascript
// WRONG: Relative path import across packages
import { requireGcloudAuth } from '../../../logs/client/gcloud.js';
```

This pattern:
- **Brittle**: Breaks if directory structure changes
- **Bypasses encapsulation**: Ignores the package's public API (exports)
- **Invisible dependencies**: Package managers can't track cross-package relationships
- **Duplicate bundling**: Bundlers may include the same code multiple times
- **No version management**: Can't leverage workspace version constraints

**The Remedy**

Use the package name for imports:

```javascript
// CORRECT: Import using package name
import { requireGcloudAuth } from '@chainguard/logs';
```

**Setting Up Cross-Package Imports**

Two steps are required to make cross-package imports work:

**Step 1: Add the dependency to your package.json**

Use the `workspace:*` protocol to reference workspace packages:

```json
{
  "dependencies": {
    "@chainguard/logs": "workspace:*"
  }
}
```

The `workspace:*` protocol:
- Resolves to the local workspace package during development
- Gets replaced with the actual version when publishing
- Ensures you're always using the local version, not a published one

**Step 2: Ensure the source package exports the symbol**

The package you're importing from must explicitly export the symbol. Check its `package.json` exports field:

```json
{
  "name": "@chainguard/logs",
  "exports": {
    ".": "./src/index.js",
    "./client/gcloud": "./src/client/gcloud.js"
  }
}
```

If the symbol isn't exported:
1. Add it to the source package's main export (`./src/index.js`)
2. Or add a subpath export for the specific module

**Checklist for Cross-Package Imports**

1. ☐ Identify the package that owns the code you need
2. ☐ Add `"@chainguard/<package>": "workspace:*"` to your `package.json` dependencies
3. ☐ Verify the symbol is exported from the source package
4. ☐ If not exported, update the source package's exports
5. ☐ Run `pnpm install` to link the packages
6. ☐ Update your import to use the package name
7. ☐ Run `pnpm test` to verify the import works

**Common Export Patterns**

```javascript
// Source package: @chainguard/logs
// File: packages/logs/src/index.js

// Re-export public API
export { requireGcloudAuth } from './client/gcloud.js';
export { Logger } from './logger.js';
export { formatLogEntry } from './format.js';
```

Or use subpath exports for organized APIs:

```json
{
  "exports": {
    ".": "./src/index.js",
    "./client": "./src/client/index.js",
    "./format": "./src/format.js"
  }
}
```

### Mistake 4: Reimplementing Package Spec Parsing

**The Problem**

Agents frequently attempt to parse package specs (`lodash@4.17.21`, `@angular/core@16.0.0`) with hand-rolled code:

```javascript
// WRONG: Hand-rolled parsing
function parseSpec(spec) {
  const atIndex = spec.lastIndexOf('@');
  if (atIndex > 0) {
    return {
      name: spec.slice(0, atIndex),
      version: spec.slice(atIndex + 1)
    };
  }
  return { name: spec, version: 'latest' };
}
```

This code is **fundamentally broken**. It fails for:
- `@types/node` (scoped package, no version)
- `@angular/core@^16.0.0` (caret range)
- `github:user/repo#v1.0.0` (git spec)
- `file:../local-pkg` (file spec)
- `npm:lodash@4.17.21` (alias)

**The Remedy**

Use the existing utilities. See [EFA 0003: Working with npm package specs](./0003-package-specs.md) for complete documentation.

```javascript
// CORRECT: Use PackageSpec.parse
import { PackageSpec } from '@chainguard/setlists';

const parsed = PackageSpec.parse('@angular/core@16.0.0');
// {
//   name: '@angular/core',
//   scope: '@angular',
//   inner: 'core',
//   version: '16.0.0'
// }

// CORRECT: Use PackageSpec.for to construct specs
const spec = PackageSpec.for('@angular/core', '16.0.0');
// '@angular/core@16.0.0'
```

For lower-level access, use `npm-package-arg` directly:

```javascript
// CORRECT: Direct npa usage when needed
import npa from 'npm-package-arg';

const result = npa('@angular/core@^16.0.0');
// {
//   type: 'range',
//   name: '@angular/core',
//   scope: '@angular',
//   fetchSpec: '^16.0.0',
//   ...
// }
```

**Absolute Prohibition**

**AI agents: YOU MAY UNDER NO CIRCUMSTANCES WRITE CODE THAT PARSES PACKAGE SPECS.**

If you find yourself writing:
- A regex like `/^(@?[^@]+)(?:@(.+))?$/`
- String splitting on `@`
- Any function named `parseSpec`, `splitSpec`, or similar

**STOP IMMEDIATELY.** Delete the code. Use `PackageSpec.parse` or `npa`.

There are no exceptions. See EFA 0003 for the full rationale.

### Mistake 5: Not Moving Test Files with Source Files

**The Problem**

When relocating a source file to a new package or directory, agents often forget to move its corresponding test file:

```
BEFORE:
  src/utils/hash.js
  src/utils/test/hash.test.js

AFTER (WRONG):
  packages/crypto/src/hash.js      # Moved
  src/utils/test/hash.test.js      # Orphaned! Still imports from old location
```

This causes:
- Tests that import from non-existent paths
- Test coverage gaps in the new location
- Confusion about where tests belong

**The Remedy**

When moving a source file, ALWAYS move its test file to the corresponding location in the new package:

```
BEFORE:
  src/utils/hash.js
  src/utils/test/hash.test.js

AFTER (CORRECT):
  packages/crypto/src/hash.js
  packages/crypto/test/hash.test.js  # Moved alongside source
```

**Checklist When Moving Files**

1. ☐ Identify the source file to move
2. ☐ Find all associated test files (same name with `.test.js` or `.spec.js`)
3. ☐ Move source file to new location
4. ☐ Move test file(s) to corresponding test directory in new location
5. ☐ Update imports in the test file to reflect new paths
6. ☐ Update any imports in OTHER files that referenced the moved file
7. ☐ Run `pnpm test` to verify tests still pass
8. ☐ Check for orphaned imports: `pnpm lint`

**Test File Naming Conventions**

| Source File | Test File Location |
|-------------|-------------------|
| `src/foo.js` | `test/foo.test.js` or `src/test/foo.test.js` |
| `src/utils/bar.js` | `test/utils/bar.test.js` |
| `lib/baz.js` | `test/baz.test.js` |

**Finding Orphaned Tests**

After moving files, check for broken imports:

```bash
# Run linter to catch import errors
pnpm lint

# Run tests to catch runtime import failures
pnpm test

# Search for imports of the old path
grep -r "from.*old/path" --include="*.js"
```

### Mistake 6: Flagging Test Fixtures as Security Vulnerabilities

**The Problem**

Agents (particularly Copilot) flag test fixture files containing URLs as security vulnerabilities, warning about "incomplete URL substring sanitization":

```javascript
// In a test fixture file - gets flagged as vulnerable
const testUrls = [
  'https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz',
  'https://example.com/malicious?redirect=http://evil.com'
];

// Agent warns: "Incomplete URL substring sanitization"
```

The agent sees substring operations on URLs and assumes XSS/SSRF risk, but these are **test fixtures**, not user input.

**Why This Is a False Positive**

Test fixtures are safe because:
1. They are compile-time constants, not runtime user input
2. They never reach production code paths
3. They exist to test code that DOES handle untrusted URLs safely
4. The "malicious" URLs are intentionally crafted to test security handling

**The Remedy**

When working with test fixtures, agents should:
- Recognize that `*.test.js`, `*.spec.js`, and files in `test/`, `__tests__/`, or `fixtures/` directories are test code
- Not apply user-input security heuristics to test fixtures
- Focus security analysis on production code paths that actually handle user input

**When URL Sanitization IS Required**

For production code handling actual user input:

```javascript
// CORRECT: Proper URL validation in production code
function validateRedirectUrl(userInput) {
  try {
    const url = new URL(userInput); // Parse properly

    // Allowlist approach - only permit known safe hosts
    const allowedHosts = ['example.com', 'trusted.org'];
    if (!allowedHosts.includes(url.host)) {
      throw new Error('Redirect URL not allowed');
    }

    return url.href;
  } catch {
    throw new Error('Invalid URL');
  }
}
```

Key principles for production URL handling:
- Use `new URL()` constructor for parsing (not string manipulation)
- Validate against allowlists, not blocklists
- Use proper encoding/escaping for output context
- Never trust user input for URL construction

### Mistake 7: Suggesting 'tmp' Package Instead of Node.js Core

**The Problem**

When agents see code writing to temporary directories (especially in tests), they suggest using the `tmp` npm package:

```javascript
// Test code writing build output
import { writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

// Agent suggests: "Use 'tmp' package for secure temp file handling"
mkdirSync(`${tmpdir()}/test-output`, { recursive: true });
writeFileSync(`${tmpdir()}/test-output/result.json`, data);
```

**Why 'tmp' Package Is Wrong**

The suggestion to use `tmp` is misguided because:
1. **Supply chain risk**: Adding any npm package increases attack surface
2. **Unnecessary dependency**: Node.js core provides `fs.mkdtempSync()` since v5.10.0
3. **Test code tolerance**: Test temporary directories don't need production-grade security
4. **YASR principle**: "Yet Another Supply Chain Risk" we don't need

**The Remedy**

Use Node.js built-in `fs.mkdtempSync()` for secure temporary directories:

```javascript
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// CORRECT: Use Node.js core for temp directories
const tempDir = mkdtempSync(join(tmpdir(), 'test-output-'));
// Creates: /tmp/test-output-abc123 (unique suffix)

writeFileSync(join(tempDir, 'result.json'), JSON.stringify(data));

// Cleanup when done
rmSync(tempDir, { recursive: true, force: true });
```

**Benefits of `mkdtempSync`**:
- Built into Node.js core (no dependencies)
- Creates unique directory names (prevents race conditions)
- Uses OS-appropriate temp directory
- Synchronous version available for test setup

**Absolute Prohibition**

**AI agents: DO NOT add the `tmp` package as a dependency.**

If you find yourself suggesting:
- `npm install tmp` or `pnpm add tmp`
- `import tmp from 'tmp'`
- Any reference to the `tmp` package

**STOP.** Use `fs.mkdtempSync()` instead. There are no exceptions in this codebase.

## Summary Table

| Mistake | Detection | Remedy |
|---------|-----------|--------|
| Async import when unnecessary | `await import(` with string literal | Use static `import` at top of file |
| Using npm instead of pnpm | `npm install`, `npm test`, etc. | Replace with `pnpm` equivalent |
| Cross-package relative imports | `from '../../../other-pkg/...'` | Use package name with `workspace:*` |
| Reimplementing spec parsing | Regex or string split on `@` | Use `PackageSpec.parse` or `npa` |
| Not moving test files | Test imports from old path | Move test alongside source file |
| Flagging test fixtures as vulnerabilities | Security warning on test URLs | Recognize test code vs production |
| Suggesting 'tmp' package | `import tmp from 'tmp'` | Use `fs.mkdtempSync()` from Node.js core |

## Why This Document Exists

These mistakes are not random. They stem from:

1. **Training data bias**: Agents are trained on codebases that use npm (more common than pnpm)
2. **Oversimplification**: Agents underestimate the complexity of package spec parsing
3. **Context limitations**: Agents don't always see the full file tree to notice orphaned tests
4. **Default patterns**: Async imports are a "safe" default that agents fall back to
5. **Monorepo unfamiliarity**: Agents default to relative imports rather than workspace protocols
6. **Overzealous security heuristics**: Agents flag test fixtures as vulnerabilities without distinguishing test code from production code
7. **Dependency-first thinking**: Agents suggest npm packages before checking Node.js core capabilities

This document provides explicit counter-guidance to override these tendencies.

## References

- [EFA 0003: Working with npm package specs](./0003-package-specs.md) - Complete guide to package spec parsing
- [pnpm documentation](https://pnpm.io/) - Official pnpm documentation
- [npm-package-arg](https://www.npmjs.com/package/npm-package-arg) - The canonical package spec parser
