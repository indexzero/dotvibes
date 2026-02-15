---
authors: Charlie Robbins <charlie.robbins@chainguard.dev>
state: draft
discussion:
---

# EFA 0005: TypeScript as a Development-Time Type Linter

## Motivation & Prior Art

Here is my hot take: **TypeScript is a linter, not a language**.

Let me explain. The value TypeScript provides is not in the transpilation step. It is not in the `.ts` file extension. It is not in the elaborate build pipeline that transforms your perfectly good JavaScript into... slightly different JavaScript. The value is in the red squiggly lines. The value is in the autocomplete. The value is in catching `undefined is not a function` before your users do.

So why are we still pretending we need to compile anything?

### What Were We Doing Before?

The orthodox approach to TypeScript goes something like this:

1. Write `.ts` files
2. Configure a build step (tsc, or esbuild, or swc, or whatever the flavor of the month is)
3. Output `.js` files to a `dist/` directory
4. Ship both source and compiled output
5. Maintain source maps so anyone debugging your library can figure out what is actually happening
6. Wonder why your `npm publish` just shipped 3x the files you actually wrote

This is fine for applications. But for libraries? For code that runs in Node, Bun, Deno, and every edge runtime from Cloudflare to Fastly? It is unnecessary complexity.

### Prior Art

This approach is not new. Titus Wormer (wooorm) has been doing this for years across the unified.js ecosystem. His [npm-high-impact](https://github.com/wooorm/npm-high-impact) project demonstrates the pattern beautifully:

- JavaScript source files with JSDoc annotations
- TypeScript configured with `checkJs: true`
- `emitDeclarationOnly: true` to generate `.d.ts` files for consumers
- No transpilation step
- Source IS distribution

The result? Clean, readable code. Perfect IDE support. Type safety. And most importantly: **no build step between you and your running code**.

### Goals

1. Full type safety during development
2. Type definitions for library consumers
3. Zero runtime overhead from types
4. Source files ARE the distribution
5. Works identically in Node, Bun, Deno, Cloudflare Workers, Fastly Compute

### Non-Goals

1. Supporting ancient JavaScript engines
2. Using TypeScript-specific syntax (enums, namespaces, parameter properties)
3. Optimizing or transforming the code in any way

## Detailed Design

### tsconfig.json

```json
{
  "compilerOptions": {
    "checkJs": true,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "exactOptionalPropertyTypes": true,
    "lib": ["es2022"],
    "module": "node16",
    "moduleResolution": "node16",
    "strict": true,
    "target": "es2022",
    "skipLibCheck": true
  },
  "include": ["src/**/*.js"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

Key points:

- **`checkJs: true`**: This is the entire point. TypeScript will type-check your JavaScript files.
- **`emitDeclarationOnly: true`**: We only want `.d.ts` files. The JavaScript stays exactly as written.
- **`strict: true`**: We are not here to half-ass type safety.
- **`module: node16`**: Proper ESM resolution. No synthetic default imports nonsense.
- **`target: es2022`**: We are targeting modern runtimes. All of them support ES2022.

### JSDoc Patterns

#### Basic Type Annotations

```javascript
/**
 * @param {string} packageName - The package to fetch
 * @param {string} version - The version specifier
 * @returns {Promise<ArrayBuffer>} The tarball contents
 */
export async function fetchTarball(packageName, version) {
  // implementation
}
```

#### Complex Types with @typedef

```javascript
/**
 * @typedef {Object} DiffOptions
 * @property {boolean} [ignoreAllSpace] - Ignore all whitespace
 * @property {boolean} [nameOnly] - Show only names of changed files
 * @property {string} [diffUnified] - Number of context lines
 */

/**
 * @typedef {'url' | 'url-basic' | 'url-bearer' | 's3' | 'disk' | 'attachment'} FetchStrategy
 */

/**
 * @typedef {Object} PackageSource
 * @property {FetchStrategy} strategy
 * @property {string} [url]
 * @property {string} [authorization]
 * @property {string} [path]
 * @property {ArrayBuffer} [contents]
 */
```

#### Generics

```javascript
/**
 * @template T
 * @param {T[]} items
 * @param {(item: T) => boolean} predicate
 * @returns {T | undefined}
 */
function find(items, predicate) {
  return items.find(predicate);
}
```

#### Importing Types

```javascript
/**
 * @typedef {import('./types.js').DiffResult} DiffResult
 */

/**
 * @param {import('./config.js').Config} config
 * @returns {Promise<DiffResult>}
 */
export async function computeDiff(config) {
  // implementation
}
```

#### Type-Only Files

For complex type hierarchies, create a `types.js` file that exports nothing but defines types:

```javascript
// src/types.js

/**
 * @typedef {Object} TarballEntry
 * @property {string} name
 * @property {Uint8Array} content
 * @property {number} mode
 * @property {Date} mtime
 */

/**
 * @typedef {Object} DiffResult
 * @property {string} diff - The unified diff output
 * @property {string[]} filesChanged - List of changed file paths
 * @property {number} additions - Lines added
 * @property {number} deletions - Lines deleted
 */

export {};
```

The `export {}` makes it a module. TypeScript will pick up all the typedefs and they can be imported elsewhere.

### package.json Scripts

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./src/index.js"
    }
  },
  "files": [
    "src",
    "dist"
  ],
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build:types": "tsc --build",
    "prepublishOnly": "npm run build:types",
    "test": "node --test src/**/*.test.js",
    "lint": "eslint src && npm run typecheck"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

Note the `exports` field:
- TypeScript consumers get the `.d.ts` files from `dist/`
- Everyone else gets the actual JavaScript from `src/`
- **The source IS the distribution**

### Generated Type Declarations

When you run `tsc --build`, TypeScript reads your JSDoc annotations and generates `.d.ts` files:

```typescript
// dist/index.d.ts (auto-generated)
export interface DiffOptions {
    ignoreAllSpace?: boolean;
    nameOnly?: boolean;
    diffUnified?: string;
}

export type FetchStrategy = 'url' | 'url-basic' | 'url-bearer' | 's3' | 'disk' | 'attachment';

export function computeDiff(left: PackageSource, right: PackageSource, options?: DiffOptions): Promise<DiffResult>;
```

Consumers using TypeScript get full type inference. Consumers using plain JavaScript get... JavaScript. Everyone wins.

### Why This Design?

Let me be direct about this.

**The best build step is no build step.**

Every build step is:
- A potential source of bugs
- A thing that can go out of sync
- A barrier between you and debugging
- A reason your library does not work in some runtime you have never heard of

When your source IS your distribution:
- What you write is what runs
- Debugging is straightforward
- There is nothing to configure for different environments
- There is no "works on my machine" because the machine is running your actual code

TypeScript's value is in the static analysis. In the IDE integration. In catching mistakes before they ship. You do not need to transform your code to get those benefits. You just need to tell TypeScript to look at it.

The JSDoc syntax is admittedly more verbose than TypeScript's native syntax. This is a feature, not a bug. It makes the types feel like documentation (because they are). It keeps them visually separate from the code logic. And it works with every tool that understands JavaScript, because it IS JavaScript.

### Alternatives Considered

#### Native .ts Files with Transpilation

The obvious choice. Write TypeScript, compile to JavaScript, ship both.

Problems:
- Now you have a build step
- Now you need source maps
- Now `dist/` exists and can diverge from `src/`
- Now every runtime quirk becomes a "did the build do something weird?" investigation

For applications, this is fine. For a library that needs to work identically across Node, Bun, Deno, and multiple edge runtimes? The fewer moving parts, the better.

#### No Types At All

We could just... not. Write JavaScript. Trust the tests. Ship it.

This works for small utilities. For a library implementing something as complex as npm's diff algorithm with multiple fetch strategies? Types are documentation. Types catch entire categories of bugs. Types make the library usable by TypeScript consumers without them having to write their own `.d.ts` files.

The question is not "types or no types" but "how do we get the benefits of types without the costs of a build step?"

#### JSR (JavaScript Registry)

JSR supports publishing TypeScript directly and handles the compilation. Interesting, but:
- npm remains the dominant registry
- Not all consumers can use JSR
- Still introduces a transformation step, just hosted elsewhere

#### Type Stripping (Node.js --experimental-strip-types)

Node.js is experimenting with running TypeScript directly by stripping types. Promising for the future, but:
- Still experimental
- Does not help with Bun, Deno, or edge runtimes today
- The JS files still need to work standalone for bundlers and other tools

The JSDoc approach works today, everywhere, with no experiments required.

## Implications for Cross-cutting Concerns

- [x] Security Implications
- [x] Performance Implications
- [x] Testing Implications

### Security Implications

**Positive**: No build step means no supply chain attack vector through build tooling. The code you audit is the code that runs. TypeScript is a devDependency only - it never ships to production.

**Neutral**: Type safety catches some bugs that could become security issues, but this is true of any type system.

### Performance Implications

**Zero runtime overhead**. Types exist only at development time and in `.d.ts` files for consumers. The JavaScript that runs is exactly what you wrote - no transformations, no runtime type checking, no added weight.

The only "cost" is slightly larger npm package size from including `.d.ts` files in `dist/`. This is typically a few KB for small-to-medium libraries.

### Testing Implications

Tests run against the actual source code, not transpiled output. This simplifies:
- Test setup (no build step before tests)
- Debugging (breakpoints hit your actual code)
- Coverage (coverage maps directly to source)

The type checking becomes part of the test suite:

```json
{
  "scripts": {
    "test": "npm run typecheck && node --test"
  }
}
```

If the types are wrong, the tests fail. Simple.

## Open Questions

1. **Type coverage tooling**: Should we enforce 100% type coverage with tools like `type-coverage`? wooorm does this. It adds another devDependency but ensures no implicit `any` sneaks in.

2. **Declaration map files**: Should we ship `.d.ts.map` files? They help consumers navigate from generated types back to source but add package size.

3. **JSDoc linting**: Should we use a tool to validate JSDoc syntax separately from TypeScript? TypeScript only checks types, not JSDoc formatting.

## References

- [wooorm/npm-high-impact](https://github.com/wooorm/npm-high-impact) - Exemplar of this pattern
- [TypeScript: Type Checking JavaScript Files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
- [TypeScript: JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Rich Harris on TypeScript](https://github.com/sveltejs/svelte/pull/8569) - Svelte's approach to JSDoc
- [sindresorhus guidance on TypeScript](https://github.com/sindresorhus/meta/discussions/15)
- [WinterCG (now WinterTC)](https://wintercg.org/) - Runtime interoperability standards

## Checklist

- [ ] tsconfig.json configured with checkJs and emitDeclarationOnly
- [ ] package.json exports field maps types to dist/, default to src/
- [ ] prepublishOnly script generates type declarations
- [ ] typecheck script added for CI and pre-commit
- [ ] JSDoc type definitions cover all public APIs
- [ ] .d.ts files included in package files
- [ ] Source files work without any build step
- [ ] Documentation updated with type usage examples
