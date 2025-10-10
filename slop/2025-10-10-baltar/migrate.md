# Baltar Modernization Migration Plan

## Overview
Modernize the `baltar` package to use current Node.js best practices, ES modules, and modern tooling while maintaining backward compatibility where possible.

## Phase 1: Package Manager Migration (pnpm)

### Steps:
1. Create `pnpm-workspace.yaml` if needed
2. Convert `package.json` dependencies
3. Generate lockfile with `pnpm import` from existing npm lockfile
4. Update scripts to use pnpm commands
5. Add `.npmrc` with pnpm-specific configurations

### Rationale:
- pnpm provides better disk space efficiency through content-addressable storage
- Stricter dependency resolution prevents phantom dependencies
- Faster installation times
- Better monorepo support if needed in future

## Phase 2: ES Module Migration

### Steps:
1. Add `"type": "module"` to package.json
2. Convert all require() to import statements
3. Convert module.exports to export statements
4. Update file extensions to `.mjs` if needed for dual module support
5. Add exports field to package.json for proper module resolution
6. Consider providing both ESM and CJS builds for compatibility

### File Changes:
- `index.js` → Convert to ESM exports
- `test/*.js` → Convert test files to use import
- Update test runner configuration for ESM

### Considerations:
- Use conditional exports in package.json for dual module support
- May need to use `createRequire` for CJS-only dependencies initially
- Update documentation with ESM usage examples

## Phase 3: Replace hyperquest with undici

### Steps:
1. Install undici as dependency
2. Implement RetryAgent for resilient HTTP requests
3. Replace hyperquest usage in:
   - `pull()` function
   - `push()` function
4. Add proper retry logic with exponential backoff
5. Implement connection pooling for better performance

### Implementation Details:
```javascript
import { Agent, RetryAgent, request } from 'undici';

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

### Benefits:
- Native HTTP/1.1 and HTTP/2 support
- Better performance (written in C++ with JS bindings)
- Built-in retry mechanism
- Actively maintained by Node.js team members

## Phase 4: Modernize Stream Handling

### Steps:
1. Replace `.pipe()` chains with `pipeline()` from `node:stream/promises`
2. Add proper error handling with pipeline
3. Use async/await for stream operations where appropriate
4. Implement AbortController for cancellable operations
5. Consider using async iterators for stream processing

### Example Transformation:
```javascript
// Old
return request
  .pipe(zlib.Gunzip())
  .pipe(tar.Extract({ path: opts.path }))
  .on('error', done);

// New
import { pipeline } from 'node:stream/promises';

await pipeline(
  request,
  zlib.createGunzip(),
  tar.extract({ cwd: opts.path }),
);
```

### Benefits:
- Automatic cleanup on error
- Better error propagation
- Promise-based API
- Proper backpressure handling

## Phase 5: Dependency Updates

### Core Dependencies:
- `tar`: Update to latest v7.x (already on v7.4.3, check for newer)
- `diagnostics`: Update to latest v2.x
- `fstream-ignore`: Replace with native solution or `ignore` package
- `once`: May not be needed with modern Promise patterns

### Dev Dependencies:
- `mocha`: Update to latest v10.x
- `istanbul`: Replace with `c8` for native V8 coverage
- `assume`: Consider migrating to native `node:test` assertions
- `async`: Replace with native Promise methods
- `rimraf`: Replace with `node:fs` rm with recursive option

### New Dependencies:
- `undici`: For HTTP requests
- `c8`: For code coverage
- `tsx` or `node --loader`: For TypeScript/ESM test execution

## Phase 6: Testing Infrastructure

### Steps:
1. Migrate to native `node:test` runner (Node.js 18+)
2. Replace istanbul with c8 for native coverage
3. Update test scripts for ESM
4. Add integration tests for backward compatibility
5. Ensure tests work with pnpm

### Benefits:
- No external test runner needed
- Built-in coverage support
- Better performance
- Native TypeScript support (if needed)

## Phase 7: CI/CD Migration

### GitHub Actions Workflow:
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm run coverage
```

## Phase 8: Additional Modernizations

### Code Quality:
1. Add ESLint with modern config (flat config)
2. Add Prettier for formatting
3. Consider TypeScript definitions (`.d.ts` files)
4. Add JSDoc comments for better IDE support

### Performance:
1. Use `node:fs/promises` for async file operations
2. Implement streaming for large files
3. Add progress events for long operations
4. Consider worker threads for CPU-intensive operations

### Security:
1. Add input validation
2. Implement rate limiting for HTTP requests
3. Add integrity checks for downloaded tarballs
4. Use SubResource Integrity (SRI) where applicable

## Migration Order

1. **Preparation Phase:**
   - Set up pnpm
   - Create migration branch
   - Set up new CI/CD

2. **Core Migration Phase:**
   - Convert to ES modules
   - Replace hyperquest with undici
   - Modernize stream handling

3. **Enhancement Phase:**
   - Update all dependencies
   - Modernize tests
   - Add new features

4. **Finalization Phase:**
   - Update documentation
   - Add migration guide for users
   - Create compatibility layer if needed

## Breaking Changes

### Potential Breaking Changes:
1. Minimum Node.js version: 18.x (for native fetch, test runner)
2. ESM-only package (provide CJS build if needed)
3. Changed error handling patterns (Promise-based)
4. Different stream event patterns

### Mitigation Strategies:
1. Provide dual ESM/CJS builds
2. Add compatibility layer for old API
3. Major version bump (2.0.0)
4. Comprehensive migration guide

## Success Metrics

1. All tests passing on Node.js 18, 20, 22
2. Performance improvement (benchmark HTTP operations)
3. Reduced dependency count
4. Improved error handling
5. Better TypeScript support (even without TS rewrite)
6. Smaller package size
7. Faster CI builds

## Rollback Plan

1. Keep current version in separate branch
2. Maintain 1.x branch for critical fixes
3. Document all breaking changes
4. Provide code migration examples
5. Support 1.x for 6 months after 2.0 release

## Timeline Estimate

- Phase 1-2: 1 day (Package manager, ES modules)
- Phase 3-4: 1 day (HTTP client, streams)
- Phase 5-6: 1 day (Dependencies, testing)
- Phase 7-8: 1 day (CI/CD, enhancements)
- Testing & Documentation: 1 day

Total: ~1 week of focused development

## Risk Assessment

### High Risk:
- Breaking existing consumer code
- Introducing stream handling bugs

### Medium Risk:
- Dependency compatibility issues
- Performance regressions

### Low Risk:
- CI/CD migration issues
- Documentation gaps

### Mitigation:
- Extensive testing
- Gradual rollout
- Beta releases
- Community feedback period