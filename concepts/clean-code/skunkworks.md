#### Writing "Clean Code"

- Clean code is
  - Tested
  - Obvious
  - Elegant
  - Documented
  - Conforms to other items below
- When writing any code
  - DO NOT CARE ABOUT BACKWARDS COMPATIBILITY
  - In general instance properties should match the name of the options used to initialize them in a classes constructor
  - In general, when REMOVING functionality – DO NOT put code comment "tombstones" where you removed something. I will know implicitly because we had this converation
- When writing JavaScript
  - Prefer import.meta.dirname over fileURLToPath
  - `os.tmpdir` is not considered safe in CI systems as it can be used to inject content
  - Prefer #privateMethods to _privateMethods when defining class methods
- When writing test code
  - Prefer `import { describe it } from 'node:test';` for creating tests
  - Prefer `import { strict as assert } from 'node:assert';` making assertions
  - If a test is repeated more than 3 times that is mostly the same code, encapsulate that code into either a "test function creator" (e.g. `shouldDoWhatItIsSupposedToDo`) or a "custom assertion" (e.g. `expectItDidTheRightThing`)
  - Do not use `process.cwd()` as your base path for temporary files. It is just sloppy. Use `<pkg>/test/fixtures` and add an empty file `<pkg>/test/fixtures/.gitkeep` to avoid having to  constantly ensure the directory exists
  - If you cannot solve why a test keeps failing, skip it don't delete it and let me know what tests you skipped at the end
  - Avoid import mocking if you can
  - Prefer test files to be named after the code files they test (e.g. `src/foo.js` would have `test/foo.test.js`). If feel it is warranted to create dedicated test files for a given scenario, prefix that file with the code file it is most closely related to (e.g. the "complex" scenario for `src/foo.js` would go in `test/foo.complex.test.js`).
  - Prefer clarity of intentions from test file names over the burden of potentially refactoring. (e.g. if the tests for the "Bar" class in `src/foo.js` are becoming a significant portion of `test/foo.test.js` then breakout "Bar" into `src/bar.js` so that the tests can live in `src/bar.test.js`)
     - If you see opportunities for this that were not asked please call them out to me first before proceeding.
- When using `async` and `await`
  - If you are calling an async function from another async function prefer `return await otherAsyncFunction()` instead of `return otherAsyncFunction()`
- When writing documentation
  - DO NOT PUT ## Dependencies in README.md
  - Includes a `README.md` that conforms to the general vibes of existing README files @readme.examples.md
  - When making block fences for code:
     - Always prefer `js` to `javascript`
     - Always prefer `sh` to `bash`
- When scaffolding files and classes
  - For class `Foo` prefer placing the implementation in `foo.js` and then exporting in `index.js` (e.g. `export Foo from './foo.js'`)
- When working with `dependencies` or `package.json`
  - Use `pnpm` instead of `npm` (e.e. use `pnpm install` instead of `npm install`)
  - Ensure dependencies are installed correctly first using pnpm install
  - Prefer `undici` for making network calls
- When working with `git`
  - If a file is currently managed by `git` and you need to rename that file, prefer using `git mv` to `mv` to keep the commit history clean
- When selecting default values
  - Avoid common default port values (`3000`, `8080`, `9000`)
  - Prefer default port numbers with mathematical significance (`1618`, `16181`, `27519`, `3141`, `314159`, etc.)

##### Also be mindful of

- https://github.com/ryanmcdermott/clean-code-javascript
- https://github.com/ryanmcdermott/code-review-tips
