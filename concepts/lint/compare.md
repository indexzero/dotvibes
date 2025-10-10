# Complete ESLint vs XO Rules Comparison

Generated on: 2025-09-26T21:04:09.292Z

## Legend
- ✅ = Rule enabled (error level)
- ⚠️ = Rule enabled (warning level)
- ❌ = Rule explicitly disabled
- Configuration values shown in brackets when customized
- Empty cell = Rule not configured in this config

## Summary Statistics

- **Total unique rules**: 446
- **ESLint config rules**: 22
- **XO config rules**: 428
- **Rules in both configs**: 4
- **ESLint-only rules**: 18
- **XO-only rules**: 424
- **Conflicting rules**: 4

## Complete Rules Table

| Rule Name | eslint.config.js | xo.config.js | Documentation |
|-----------|------------------|--------------|---------------|
| **Core ESLint Rules** | | | |
| `accessor-pairs` |  | ✅ `[{"enforceForTSTypes":false, "enforceForClassMembers":true, "getWithoutSet":false, "setWithoutGet":tr]` | [📖](https://eslint.org/docs/latest/rules/accessor-pairs) |
| `array-bracket-spacing` | ✅ `["never"]` |  | [📖](https://eslint.org/docs/latest/rules/array-bracket-spacing) |
| `array-callback-return` |  | ✅ `[{"allowImplicit":true, "checkForEach":false, "allowVoid":false}]` | [📖](https://eslint.org/docs/latest/rules/array-callback-return) |
| `arrow-body-style` |  | ✅ `["as-needed"]` | [📖](https://eslint.org/docs/latest/rules/arrow-body-style) |
| `block-scoped-var` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/block-scoped-var) |
| **`camelcase`** | ✅ `[{"properties":"always", "ignoreDestructuring":true, "ignoreImports":true, "allow":["npm_*", "email_v]` | ✅ `[{"allow":[], "ignoreDestructuring":false, "ignoreGlobals":false, "ignoreImports":false, "properties"]` | [📖](https://eslint.org/docs/latest/rules/camelcase) |
| `capitalized-comments` |  | ✅ `["always", {"ignorePattern":"pragma|ignore|prettier-ignore|webpack\\w+:|c8|type-coverage:", "ignoreIn]` | [📖](https://eslint.org/docs/latest/rules/capitalized-comments) |
| `complexity` |  | ⚠️ `[20]` | [📖](https://eslint.org/docs/latest/rules/complexity) |
| `constructor-super` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/constructor-super) |
| `curly` |  | ✅ `["all"]` | [📖](https://eslint.org/docs/latest/rules/curly) |
| `default-case` |  | ✅ `[{}]` | [📖](https://eslint.org/docs/latest/rules/default-case) |
| `default-case-last` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/default-case-last) |
| `dot-notation` |  | ✅ `[{"allowKeywords":true, "allowPattern":""}]` | [📖](https://eslint.org/docs/latest/rules/dot-notation) |
| `eqeqeq` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/eqeqeq) |
| `for-direction` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/for-direction) |
| `func-name-matching` |  | ✅ `[{"considerPropertyDescriptor":true}]` | [📖](https://eslint.org/docs/latest/rules/func-name-matching) |
| `func-names` |  | ✅ `["never", {}]` | [📖](https://eslint.org/docs/latest/rules/func-names) |
| `func-style` | ✅ `["declaration", {"allowArrowFunctions":true}]` |  | [📖](https://eslint.org/docs/latest/rules/func-style) |
| `function-call-argument-newline` |  | ❌ | [📖](https://eslint.org/docs/latest/rules/function-call-argument-newline) |
| `getter-return` |  | ✅ `[{"allowImplicit":false}]` | [📖](https://eslint.org/docs/latest/rules/getter-return) |
| `grouped-accessor-pairs` |  | ✅ `["getBeforeSet", {"enforceForTSTypes":false}]` | [📖](https://eslint.org/docs/latest/rules/grouped-accessor-pairs) |
| `guard-for-in` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/guard-for-in) |
| `logical-assignment-operators` |  | ✅ `["always", {"enforceForIfStatements":true}]` | [📖](https://eslint.org/docs/latest/rules/logical-assignment-operators) |
| `max-depth` |  | ⚠️ | [📖](https://eslint.org/docs/latest/rules/max-depth) |
| `max-lines` |  | ⚠️ `[{"max":1500, "skipComments":true}]` | [📖](https://eslint.org/docs/latest/rules/max-lines) |
| `max-nested-callbacks` |  | ⚠️ `[4]` | [📖](https://eslint.org/docs/latest/rules/max-nested-callbacks) |
| `max-params` |  | ⚠️ `[{"max":4}]` | [📖](https://eslint.org/docs/latest/rules/max-params) |
| `new-cap` |  | ✅ `[{"capIsNew":true, "capIsNewExceptions":["Array", "Boolean", "Date", "Error", "Function", "Number", "]` | [📖](https://eslint.org/docs/latest/rules/new-cap) |
| `no-alert` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-alert) |
| `no-array-constructor` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-array-constructor) |
| `no-async-promise-executor` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-async-promise-executor) |
| `no-await-in-loop` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-await-in-loop) |
| `no-bitwise` |  | ✅ `[{"allow":[], "int32Hint":false}]` | [📖](https://eslint.org/docs/latest/rules/no-bitwise) |
| `no-buffer-constructor` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-buffer-constructor) |
| `no-caller` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-caller) |
| `no-case-declarations` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-case-declarations) |
| `no-class-assign` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-class-assign) |
| `no-compare-neg-zero` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-compare-neg-zero) |
| `no-cond-assign` |  | ✅ `["except-parens"]` | [📖](https://eslint.org/docs/latest/rules/no-cond-assign) |
| `no-const-assign` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-const-assign) |
| `no-constant-binary-expression` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-constant-binary-expression) |
| `no-constant-condition` |  | ✅ `[{"checkLoops":"allExceptWhileTrue"}]` | [📖](https://eslint.org/docs/latest/rules/no-constant-condition) |
| `no-constructor-return` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-constructor-return) |
| `no-control-regex` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-control-regex) |
| `no-debugger` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-debugger) |
| `no-delete-var` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-delete-var) |
| `no-dupe-args` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-dupe-args) |
| `no-dupe-class-members` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-dupe-class-members) |
| `no-dupe-else-if` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-dupe-else-if) |
| `no-dupe-keys` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-dupe-keys) |
| `no-duplicate-case` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-duplicate-case) |
| `no-else-return` |  | ✅ `[{"allowElseIf":false}]` | [📖](https://eslint.org/docs/latest/rules/no-else-return) |
| `no-empty` |  | ✅ `[{"allowEmptyCatch":true}]` | [📖](https://eslint.org/docs/latest/rules/no-empty) |
| `no-empty-character-class` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-empty-character-class) |
| `no-empty-pattern` |  | ✅ `[{"allowObjectPatternsAsParameters":false}]` | [📖](https://eslint.org/docs/latest/rules/no-empty-pattern) |
| `no-empty-static-block` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-empty-static-block) |
| `no-eq-null` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-eq-null) |
| `no-eval` |  | ✅ `[{"allowIndirect":false}]` | [📖](https://eslint.org/docs/latest/rules/no-eval) |
| `no-ex-assign` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-ex-assign) |
| `no-extend-native` |  | ✅ `[{"exceptions":[]}]` | [📖](https://eslint.org/docs/latest/rules/no-extend-native) |
| `no-extra-bind` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-extra-bind) |
| `no-extra-boolean-cast` |  | ✅ `[{}]` | [📖](https://eslint.org/docs/latest/rules/no-extra-boolean-cast) |
| `no-extra-label` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-extra-label) |
| `no-fallthrough` |  | ✅ `[{"allowEmptyCase":false, "reportUnusedFallthroughComment":false}]` | [📖](https://eslint.org/docs/latest/rules/no-fallthrough) |
| `no-func-assign` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-func-assign) |
| `no-global-assign` |  | ✅ `[{"exceptions":[]}]` | [📖](https://eslint.org/docs/latest/rules/no-global-assign) |
| `no-implicit-coercion` |  | ✅ `[{"allow":[], "boolean":true, "disallowTemplateShorthand":false, "number":true, "string":true}]` | [📖](https://eslint.org/docs/latest/rules/no-implicit-coercion) |
| `no-implicit-globals` |  | ✅ `[{"lexicalBindings":false}]` | [📖](https://eslint.org/docs/latest/rules/no-implicit-globals) |
| `no-implied-eval` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-implied-eval) |
| `no-import-assign` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-import-assign) |
| `no-inner-declarations` |  | ✅ `["functions", {"blockScopedFunctions":"allow"}]` | [📖](https://eslint.org/docs/latest/rules/no-inner-declarations) |
| `no-invalid-regexp` |  | ✅ `[{}]` | [📖](https://eslint.org/docs/latest/rules/no-invalid-regexp) |
| `no-irregular-whitespace` |  | ✅ `[{"skipComments":false, "skipJSXText":false, "skipRegExps":false, "skipStrings":true, "skipTemplates"]` | [📖](https://eslint.org/docs/latest/rules/no-irregular-whitespace) |
| `no-iterator` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-iterator) |
| `no-label-var` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-label-var) |
| `no-labels` |  | ✅ `[{"allowLoop":false, "allowSwitch":false}]` | [📖](https://eslint.org/docs/latest/rules/no-labels) |
| `no-lone-blocks` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-lone-blocks) |
| `no-lonely-if` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-lonely-if) |
| `no-loss-of-precision` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-loss-of-precision) |
| `no-misleading-character-class` |  | ✅ `[{"allowEscape":false}]` | [📖](https://eslint.org/docs/latest/rules/no-misleading-character-class) |
| `no-multi-assign` |  | ✅ `[{"ignoreNonDeclaration":false}]` | [📖](https://eslint.org/docs/latest/rules/no-multi-assign) |
| `no-multi-str` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-multi-str) |
| `no-negated-condition` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-negated-condition) |
| `no-nested-ternary` |  | ❌ | [📖](https://eslint.org/docs/latest/rules/no-nested-ternary) |
| `no-new` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-new) |
| `no-new-func` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-new-func) |
| `no-new-native-nonconstructor` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-new-native-nonconstructor) |
| `no-new-wrappers` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-new-wrappers) |
| `no-nonoctal-decimal-escape` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-nonoctal-decimal-escape) |
| `no-obj-calls` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-obj-calls) |
| `no-object-constructor` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-object-constructor) |
| `no-octal` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-octal) |
| `no-octal-escape` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-octal-escape) |
| `no-promise-executor-return` |  | ✅ `[{"allowVoid":false}]` | [📖](https://eslint.org/docs/latest/rules/no-promise-executor-return) |
| `no-proto` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-proto) |
| `no-prototype-builtins` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-prototype-builtins) |
| `no-redeclare` |  | ✅ `[{"builtinGlobals":true}]` | [📖](https://eslint.org/docs/latest/rules/no-redeclare) |
| `no-regex-spaces` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-regex-spaces) |
| `no-restricted-globals` |  | ✅ `["event", {"name":"atob", "message":"This API is deprecated. Use https://github.com/sindresorhus/uint]` | [📖](https://eslint.org/docs/latest/rules/no-restricted-globals) |
| `no-restricted-imports` |  | ✅ `["domain", "freelist", "smalloc", "punycode", "sys", "querystring", "colors"]` | [📖](https://eslint.org/docs/latest/rules/no-restricted-imports) |
| `no-restricted-syntax` | ✅ `[{"selector":"ForInStatement", "message":"for...in is not allowed,  use for...of or Object.keys().for]` |  | [📖](https://eslint.org/docs/latest/rules/no-restricted-syntax) |
| `no-return-assign` |  | ✅ `["always"]` | [📖](https://eslint.org/docs/latest/rules/no-return-assign) |
| `no-return-await` |  | ❌ | [📖](https://eslint.org/docs/latest/rules/no-return-await) |
| `no-script-url` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-script-url) |
| `no-self-assign` |  | ✅ `[{"props":true}]` | [📖](https://eslint.org/docs/latest/rules/no-self-assign) |
| `no-self-compare` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-self-compare) |
| `no-sequences` |  | ✅ `[{"allowInParentheses":true}]` | [📖](https://eslint.org/docs/latest/rules/no-sequences) |
| `no-setter-return` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-setter-return) |
| `no-shadow-restricted-names` |  | ✅ `[{"reportGlobalThis":false}]` | [📖](https://eslint.org/docs/latest/rules/no-shadow-restricted-names) |
| `no-sparse-arrays` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-sparse-arrays) |
| `no-template-curly-in-string` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-template-curly-in-string) |
| `no-this-before-super` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-this-before-super) |
| `no-throw-literal` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-throw-literal) |
| `no-undef` |  | ✅ `[{"typeof":true}]` | [📖](https://eslint.org/docs/latest/rules/no-undef) |
| `no-undef-init` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-undef-init) |
| `no-unexpected-multiline` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-unexpected-multiline) |
| `no-unmodified-loop-condition` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-unmodified-loop-condition) |
| `no-unneeded-ternary` |  | ✅ `[{"defaultAssignment":true}]` | [📖](https://eslint.org/docs/latest/rules/no-unneeded-ternary) |
| `no-unreachable` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-unreachable) |
| `no-unreachable-loop` |  | ✅ `[{"ignore":[]}]` | [📖](https://eslint.org/docs/latest/rules/no-unreachable-loop) |
| `no-unsafe-finally` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-unsafe-finally) |
| `no-unsafe-negation` |  | ✅ `[{"enforceForOrderingRelations":true}]` | [📖](https://eslint.org/docs/latest/rules/no-unsafe-negation) |
| `no-unsafe-optional-chaining` |  | ✅ `[{"disallowArithmeticOperators":true}]` | [📖](https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining) |
| `no-unused-expressions` |  | ✅ `[{"allowShortCircuit":false, "allowTernary":false, "allowTaggedTemplates":false, "enforceForJSX":true]` | [📖](https://eslint.org/docs/latest/rules/no-unused-expressions) |
| `no-unused-labels` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-unused-labels) |
| `no-unused-vars` |  | ✅ `[{"vars":"all", "varsIgnorePattern":"^_", "args":"after-used", "ignoreRestSiblings":true, "argsIgnore]` | [📖](https://eslint.org/docs/latest/rules/no-unused-vars) |
| `no-useless-backreference` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-useless-backreference) |
| `no-useless-call` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-useless-call) |
| `no-useless-catch` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-useless-catch) |
| `no-useless-computed-key` |  | ✅ `[{"enforceForClassMembers":true}]` | [📖](https://eslint.org/docs/latest/rules/no-useless-computed-key) |
| `no-useless-concat` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-useless-concat) |
| `no-useless-constructor` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-useless-constructor) |
| `no-useless-escape` |  | ✅ `[{"allowRegexCharacters":[]}]` | [📖](https://eslint.org/docs/latest/rules/no-useless-escape) |
| `no-useless-rename` |  | ✅ `[{"ignoreDestructuring":false, "ignoreImport":false, "ignoreExport":false}]` | [📖](https://eslint.org/docs/latest/rules/no-useless-rename) |
| `no-useless-return` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-useless-return) |
| **`no-var`** | ✅ | ✅ | [📖](https://eslint.org/docs/latest/rules/no-var) |
| `no-void` |  | ✅ `[{"allowAsStatement":false}]` | [📖](https://eslint.org/docs/latest/rules/no-void) |
| `no-warning-comments` |  | ⚠️ `[{"location":"start", "terms":["todo", "fixme", "xxx"]}]` | [📖](https://eslint.org/docs/latest/rules/no-warning-comments) |
| `no-with` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-with) |
| `object-curly-spacing` | ✅ `["always"]` |  | [📖](https://eslint.org/docs/latest/rules/object-curly-spacing) |
| `object-shorthand` |  | ✅ `["always", {"avoidExplicitReturnArrows":true}]` | [📖](https://eslint.org/docs/latest/rules/object-shorthand) |
| `one-var` |  | ✅ `["never"]` | [📖](https://eslint.org/docs/latest/rules/one-var) |
| `operator-assignment` |  | ✅ `["always"]` | [📖](https://eslint.org/docs/latest/rules/operator-assignment) |
| `prefer-arrow-callback` |  | ✅ `[{"allowNamedFunctions":true, "allowUnboundThis":true}]` | [📖](https://eslint.org/docs/latest/rules/prefer-arrow-callback) |
| **`prefer-const`** | ✅ `[{"destructuring":"all"}]` | ✅ `[{"destructuring":"all", "ignoreReadBeforeAssign":false}]` | [📖](https://eslint.org/docs/latest/rules/prefer-const) |
| **`prefer-destructuring`** | ✅ `[{"VariableDeclarator":{"array":true, "object":true}, "AssignmentExpression":{"array":false, "object"]` | ✅ `[{"VariableDeclarator":{"array":false, "object":true}, "AssignmentExpression":{"array":false, "object]` | [📖](https://eslint.org/docs/latest/rules/prefer-destructuring) |
| `prefer-exponentiation-operator` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/prefer-exponentiation-operator) |
| `prefer-numeric-literals` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/prefer-numeric-literals) |
| `prefer-object-has-own` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/prefer-object-has-own) |
| `prefer-object-spread` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/prefer-object-spread) |
| `prefer-promise-reject-errors` |  | ✅ `[{"allowEmptyReject":true}]` | [📖](https://eslint.org/docs/latest/rules/prefer-promise-reject-errors) |
| `prefer-regex-literals` |  | ✅ `[{"disallowRedundantWrapping":true}]` | [📖](https://eslint.org/docs/latest/rules/prefer-regex-literals) |
| `prefer-rest-params` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/prefer-rest-params) |
| `prefer-spread` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/prefer-spread) |
| `quotes` | ✅ `["single", {"avoidEscape":true}]` |  | [📖](https://eslint.org/docs/latest/rules/quotes) |
| `radix` |  | ✅ `["always"]` | [📖](https://eslint.org/docs/latest/rules/radix) |
| `require-yield` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/require-yield) |
| `semi` | ✅ `["always"]` |  | [📖](https://eslint.org/docs/latest/rules/semi) |
| `space-in-parens` | ✅ `["never"]` |  | [📖](https://eslint.org/docs/latest/rules/space-in-parens) |
| `symbol-description` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/symbol-description) |
| `unicode-bom` |  | ✅ `["never"]` | [📖](https://eslint.org/docs/latest/rules/unicode-bom) |
| `use-isnan` |  | ✅ `[{"enforceForIndexOf":false, "enforceForSwitchCase":true}]` | [📖](https://eslint.org/docs/latest/rules/use-isnan) |
| `valid-typeof` |  | ✅ `[{"requireStringLiterals":false}]` | [📖](https://eslint.org/docs/latest/rules/valid-typeof) |
| `yoda` |  | ✅ `["never", {"exceptRange":false, "onlyEquality":false}]` | [📖](https://eslint.org/docs/latest/rules/yoda) |
| **Plugin: @stylistic** | | | |
| `@stylistic/array-bracket-newline` |  | ✅ `["consistent"]` | [📖](https://eslint.style/rules/default/array-bracket-newline) |
| `@stylistic/array-bracket-spacing` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/array-bracket-spacing) |
| `@stylistic/array-element-newline` |  | ✅ `["consistent"]` | [📖](https://eslint.style/rules/default/array-element-newline) |
| `@stylistic/arrow-parens` |  | ✅ `["as-needed"]` | [📖](https://eslint.style/rules/default/arrow-parens) |
| `@stylistic/arrow-spacing` |  | ✅ `[{"before":true, "after":true}]` | [📖](https://eslint.style/rules/default/arrow-spacing) |
| `@stylistic/block-spacing` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/block-spacing) |
| `@stylistic/brace-style` |  | ✅ `["1tbs", {"allowSingleLine":false}]` | [📖](https://eslint.style/rules/default/brace-style) |
| `@stylistic/comma-dangle` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/comma-dangle) |
| `@stylistic/comma-spacing` |  | ✅ `[{"before":false, "after":true}]` | [📖](https://eslint.style/rules/default/comma-spacing) |
| `@stylistic/comma-style` |  | ✅ `["last"]` | [📖](https://eslint.style/rules/default/comma-style) |
| `@stylistic/computed-property-spacing` |  | ✅ `["never", {"enforceForClassMembers":true}]` | [📖](https://eslint.style/rules/default/computed-property-spacing) |
| `@stylistic/dot-location` |  | ✅ `["property"]` | [📖](https://eslint.style/rules/default/dot-location) |
| `@stylistic/eol-last` |  | ✅ | [📖](https://eslint.style/rules/default/eol-last) |
| `@stylistic/function-call-argument-newline` |  | ✅ `["consistent"]` | [📖](https://eslint.style/rules/default/function-call-argument-newline) |
| `@stylistic/function-call-spacing` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/function-call-spacing) |
| `@stylistic/function-paren-newline` |  | ❌ `["multiline"]` | [📖](https://eslint.style/rules/default/function-paren-newline) |
| `@stylistic/generator-star-spacing` |  | ✅ `["both"]` | [📖](https://eslint.style/rules/default/generator-star-spacing) |
| `@stylistic/indent` |  | ✅ `[2, {"SwitchCase":1, "flatTernaryExpressions":false, "offsetTernaryExpressions":false, "offsetTernary]` | [📖](https://eslint.style/rules/default/indent) |
| `@stylistic/indent-binary-ops` |  | ✅ `[2]` | [📖](https://eslint.style/rules/default/indent-binary-ops) |
| `@stylistic/jsx-quotes` |  | ✅ `["prefer-single"]` | [📖](https://eslint.style/rules/default/jsx-quotes) |
| `@stylistic/key-spacing` |  | ✅ `[{"beforeColon":false, "afterColon":true}]` | [📖](https://eslint.style/rules/default/key-spacing) |
| `@stylistic/keyword-spacing` |  | ✅ | [📖](https://eslint.style/rules/default/keyword-spacing) |
| `@stylistic/linebreak-style` |  | ✅ `["unix"]` | [📖](https://eslint.style/rules/default/linebreak-style) |
| `@stylistic/lines-between-class-members` |  | ✅ `[{"enforce":[{"blankLine":"always", "prev":"*", "next":"method"}, {"blankLine":"always", "prev":"meth]` | [📖](https://eslint.style/rules/default/lines-between-class-members) |
| `@stylistic/max-len` |  | ⚠️ `[{"code":200, "ignoreComments":true, "ignoreUrls":true}]` | [📖](https://eslint.style/rules/default/max-len) |
| `@stylistic/max-statements-per-line` |  | ✅ | [📖](https://eslint.style/rules/default/max-statements-per-line) |
| `@stylistic/multiline-ternary` |  | ✅ `["always-multiline"]` | [📖](https://eslint.style/rules/default/multiline-ternary) |
| `@stylistic/new-parens` |  | ✅ | [📖](https://eslint.style/rules/default/new-parens) |
| `@stylistic/no-extra-semi` |  | ✅ | [📖](https://eslint.style/rules/default/no-extra-semi) |
| `@stylistic/no-floating-decimal` |  | ✅ | [📖](https://eslint.style/rules/default/no-floating-decimal) |
| `@stylistic/no-mixed-operators` |  | ✅ | [📖](https://eslint.style/rules/default/no-mixed-operators) |
| `@stylistic/no-mixed-spaces-and-tabs` |  | ✅ | [📖](https://eslint.style/rules/default/no-mixed-spaces-and-tabs) |
| `@stylistic/no-multi-spaces` |  | ✅ | [📖](https://eslint.style/rules/default/no-multi-spaces) |
| `@stylistic/no-multiple-empty-lines` |  | ✅ `[{"max":1}]` | [📖](https://eslint.style/rules/default/no-multiple-empty-lines) |
| `@stylistic/no-trailing-spaces` |  | ✅ | [📖](https://eslint.style/rules/default/no-trailing-spaces) |
| `@stylistic/no-whitespace-before-property` |  | ✅ | [📖](https://eslint.style/rules/default/no-whitespace-before-property) |
| `@stylistic/object-curly-newline` |  | ✅ `[{"ObjectExpression":{"multiline":true, "consistent":true}, "ObjectPattern":{"multiline":true, "consi]` | [📖](https://eslint.style/rules/default/object-curly-newline) |
| `@stylistic/object-curly-spacing` |  | ✅ `["always"]` | [📖](https://eslint.style/rules/default/object-curly-spacing) |
| `@stylistic/one-var-declaration-per-line` |  | ✅ | [📖](https://eslint.style/rules/default/one-var-declaration-per-line) |
| `@stylistic/operator-linebreak` |  | ✅ `["before"]` | [📖](https://eslint.style/rules/default/operator-linebreak) |
| `@stylistic/padded-blocks` |  | ✅ `["never", {"allowSingleLineBlocks":false}]` | [📖](https://eslint.style/rules/default/padded-blocks) |
| `@stylistic/padding-line-between-statements` |  | ✅ `[{"blankLine":"always", "prev":"multiline-block-like", "next":"*"}]` | [📖](https://eslint.style/rules/default/padding-line-between-statements) |
| `@stylistic/quote-props` |  | ✅ `["as-needed"]` | [📖](https://eslint.style/rules/default/quote-props) |
| `@stylistic/quotes` |  | ✅ `["single"]` | [📖](https://eslint.style/rules/default/quotes) |
| `@stylistic/rest-spread-spacing` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/rest-spread-spacing) |
| `@stylistic/semi` |  | ✅ `["always"]` | [📖](https://eslint.style/rules/default/semi) |
| `@stylistic/semi-spacing` |  | ✅ `[{"before":false, "after":true}]` | [📖](https://eslint.style/rules/default/semi-spacing) |
| `@stylistic/semi-style` |  | ✅ `["last"]` | [📖](https://eslint.style/rules/default/semi-style) |
| `@stylistic/space-before-blocks` |  | ✅ `["always"]` | [📖](https://eslint.style/rules/default/space-before-blocks) |
| `@stylistic/space-before-function-paren` |  | ✅ `[{"anonymous":"always", "named":"never", "asyncArrow":"always"}]` | [📖](https://eslint.style/rules/default/space-before-function-paren) |
| `@stylistic/space-in-parens` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/space-in-parens) |
| `@stylistic/space-infix-ops` |  | ✅ | [📖](https://eslint.style/rules/default/space-infix-ops) |
| `@stylistic/space-unary-ops` |  | ✅ | [📖](https://eslint.style/rules/default/space-unary-ops) |
| `@stylistic/spaced-comment` |  | ✅ `["always", {"line":{"exceptions":["-", "+", "*"], "markers":["!", "/", "=>"]}, "block":{"exceptions":]` | [📖](https://eslint.style/rules/default/spaced-comment) |
| `@stylistic/switch-colon-spacing` |  | ✅ `[{"after":true, "before":false}]` | [📖](https://eslint.style/rules/default/switch-colon-spacing) |
| `@stylistic/template-curly-spacing` |  | ✅ | [📖](https://eslint.style/rules/default/template-curly-spacing) |
| `@stylistic/template-tag-spacing` |  | ✅ `["never"]` | [📖](https://eslint.style/rules/default/template-tag-spacing) |
| `@stylistic/wrap-iife` |  | ✅ `["inside", {"functionPrototypeMethods":true}]` | [📖](https://eslint.style/rules/default/wrap-iife) |
| `@stylistic/yield-star-spacing` |  | ✅ `["both"]` | [📖](https://eslint.style/rules/default/yield-star-spacing) |
| **Plugin: ava** | | | |
| `ava/assertion-arguments` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/assertion-arguments.md) |
| `ava/hooks-order` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/hooks-order.md) |
| `ava/max-asserts` |  | ❌ `[5]` | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/max-asserts.md) |
| `ava/no-async-fn-without-await` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-async-fn-without-await.md) |
| `ava/no-duplicate-modifiers` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-duplicate-modifiers.md) |
| `ava/no-identical-title` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-identical-title.md) |
| `ava/no-ignored-test-files` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-ignored-test-files.md) |
| `ava/no-import-test-files` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-import-test-files.md) |
| `ava/no-incorrect-deep-equal` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-incorrect-deep-equal.md) |
| `ava/no-inline-assertions` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-inline-assertions.md) |
| `ava/no-nested-tests` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-nested-tests.md) |
| `ava/no-only-test` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-only-test.md) |
| `ava/no-skip-assert` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-skip-assert.md) |
| `ava/no-skip-test` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-skip-test.md) |
| `ava/no-todo-implementation` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-todo-implementation.md) |
| `ava/no-todo-test` |  | ⚠️ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-todo-test.md) |
| `ava/no-unknown-modifiers` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/no-unknown-modifiers.md) |
| `ava/prefer-async-await` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/prefer-async-await.md) |
| `ava/prefer-power-assert` |  | ❌ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/prefer-power-assert.md) |
| `ava/prefer-t-regex` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/prefer-t-regex.md) |
| `ava/test-title` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/test-title.md) |
| `ava/test-title-format` |  | ❌ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/test-title-format.md) |
| `ava/use-t` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/use-t.md) |
| `ava/use-t-throws-async-well` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/use-t-throws-async-well.md) |
| `ava/use-t-well` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/use-t-well.md) |
| `ava/use-test` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/use-test.md) |
| `ava/use-true-false` |  | ✅ | [📖](https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/use-true-false.md) |
| **Plugin: import** | | | |
| `import/extensions` |  | ❌ | [📖](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md) |
| `import/newline-after-import` | ✅ |  | [📖](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md) |
| `import/no-duplicates` | ✅ |  | [📖](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md) |
| `import/no-unresolved` | ❌ |  | [📖](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md) |
| `import/order` | ✅ `[{"groups":[["builtin", "external", "internal"]], "alphabetize":{"order":"asc", "caseInsensitive":tru]` |  | [📖](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md) |
| **Plugin: jsdoc** | | | |
| `jsdoc/require-file-overview` | ✅ `[{"tags":{"license":{"mustExist":false}, "copyright":{"mustExist":false}}}]` |  | [📖](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-file-overview.md) |
| **Plugin: n** | | | |
| `n/file-extension-in-import` |  | ✅ `["always", {".ts":"never", ".tsx":"never"}]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md) |
| `n/no-deprecated-api` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md) |
| `n/no-extraneous-import` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-extraneous-import.md) |
| `n/no-mixed-requires` |  | ✅ `[{"grouping":true, "allowCall":true}]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-mixed-requires.md) |
| `n/no-new-require` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-new-require.md) |
| `n/no-path-concat` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-path-concat.md) |
| `n/no-unpublished-bin` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-unpublished-bin.md) |
| `n/prefer-global/buffer` |  | ✅ `["never"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/buffer.md) |
| `n/prefer-global/console` |  | ✅ `["always"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md) |
| `n/prefer-global/process` |  | ✅ `["never"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/process.md) |
| `n/prefer-global/text-decoder` |  | ✅ `["always"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-decoder.md) |
| `n/prefer-global/text-encoder` |  | ✅ `["always"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-encoder.md) |
| `n/prefer-global/url` |  | ✅ `["always"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url.md) |
| `n/prefer-global/url-search-params` |  | ✅ `["always"]` | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url-search-params.md) |
| `n/prefer-promises/dns` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/dns.md) |
| `n/prefer-promises/fs` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md) |
| `n/process-exit-as-throw` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/process-exit-as-throw.md) |
| **Plugin: node** | | | |
| `node/no-extraneous-import` | ✅ |  | [📖](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-extraneous-import.md) |
| `node/no-missing-import` | ✅ `[{"tryExtensions":[".js", ".mjs", ".ts"]}]` |  | [📖](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-missing-import.md) |
| `node/no-unsupported-features/es-syntax` | ❌ |  | [📖](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/es-syntax.md) |
| `node/prefer-global/buffer` | ❌ |  | [📖](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/prefer-global/buffer.md) |
| `node/prefer-global/process` | ❌ |  | [📖](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/prefer-global/process.md) |
| **Plugin: node-import** | | | |
| `node-import/prefer-node-protocol` | ✅ |  | [📖](https://github.com/weiran-zsd/eslint-plugin-node-import) |
| **Plugin: promise** | | | |
| `promise/no-new-statics` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-new-statics.md) |
| `promise/no-return-in-finally` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-return-in-finally.md) |
| `promise/no-return-wrap` |  | ✅ `[{"allowReject":true}]` | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-return-wrap.md) |
| `promise/param-names` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/param-names.md) |
| `promise/prefer-await-to-then` |  | ✅ `[{"strict":true}]` | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-then.md) |
| `promise/prefer-catch` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-catch.md) |
| `promise/valid-params` |  | ✅ | [📖](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/valid-params.md) |
| **Plugin: unicorn** | | | |
| `unicorn/better-regex` |  | ✅ `[{"sortCharacterClasses":false}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md) |
| `unicorn/catch-error-name` |  | ✅ `[{"name":"err"}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/catch-error-name.md) |
| `unicorn/consistent-assert` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-assert.md) |
| `unicorn/consistent-date-clone` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-date-clone.md) |
| `unicorn/consistent-destructuring` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md) |
| `unicorn/consistent-empty-array-spread` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-empty-array-spread.md) |
| `unicorn/consistent-existence-index-check` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-existence-index-check.md) |
| `unicorn/consistent-function-scoping` |  | ❌ `[{"checkArrowFunctions":true}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md) |
| `unicorn/custom-error-definition` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md) |
| `unicorn/empty-brace-spaces` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/empty-brace-spaces.md) |
| `unicorn/error-message` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/error-message.md) |
| `unicorn/escape-case` |  | ✅ `["uppercase"]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/escape-case.md) |
| `unicorn/expiring-todo-comments` |  | ✅ `[{"terms":["todo", "fixme", "xxx"], "ignore":[], "ignoreDatesOnPullRequests":true, "allowWarningComme]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/expiring-todo-comments.md) |
| `unicorn/explicit-length-check` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/explicit-length-check.md) |
| `unicorn/filename-case` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md) |
| `unicorn/import-style` |  | ❌ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/import-style.md) |
| `unicorn/new-for-builtins` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/new-for-builtins.md) |
| `unicorn/no-abusive-eslint-disable` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-abusive-eslint-disable.md) |
| `unicorn/no-accessor-recursion` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-accessor-recursion.md) |
| `unicorn/no-anonymous-default-export` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-anonymous-default-export.md) |
| `unicorn/no-array-callback-reference` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md) |
| `unicorn/no-array-for-each` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-for-each.md) |
| `unicorn/no-array-method-this-argument` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-method-this-argument.md) |
| `unicorn/no-array-reduce` |  | ❌ `[{"allowSimpleOperations":true}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-reduce.md) |
| `unicorn/no-await-expression-member` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-await-expression-member.md) |
| `unicorn/no-await-in-promise-methods` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-await-in-promise-methods.md) |
| `unicorn/no-console-spaces` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-console-spaces.md) |
| `unicorn/no-document-cookie` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-document-cookie.md) |
| `unicorn/no-empty-file` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-empty-file.md) |
| `unicorn/no-for-loop` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-for-loop.md) |
| `unicorn/no-hex-escape` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-hex-escape.md) |
| `unicorn/no-instanceof-builtins` |  | ✅ `[{"useErrorIsError":false, "strategy":"loose", "include":[], "exclude":[]}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-instanceof-builtins.md) |
| `unicorn/no-invalid-fetch-options` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-invalid-fetch-options.md) |
| `unicorn/no-invalid-remove-event-listener` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-invalid-remove-event-listener.md) |
| `unicorn/no-keyword-prefix` |  | ❌ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-keyword-prefix.md) |
| `unicorn/no-lonely-if` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md) |
| `unicorn/no-magic-array-flat-depth` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-magic-array-flat-depth.md) |
| `unicorn/no-named-default` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-named-default.md) |
| `unicorn/no-negated-condition` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-negated-condition.md) |
| `unicorn/no-negation-in-equality-check` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-negation-in-equality-check.md) |
| `unicorn/no-nested-ternary` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-nested-ternary.md) |
| `unicorn/no-new-array` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-array.md) |
| `unicorn/no-new-buffer` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-buffer.md) |
| `unicorn/no-null` |  | ❌ `[{"checkStrictEquality":false}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md) |
| `unicorn/no-object-as-default-parameter` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-object-as-default-parameter.md) |
| `unicorn/no-process-exit` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-process-exit.md) |
| `unicorn/no-single-promise-in-promise-methods` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-single-promise-in-promise-methods.md) |
| `unicorn/no-static-only-class` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-static-only-class.md) |
| `unicorn/no-thenable` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-thenable.md) |
| `unicorn/no-this-assignment` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-this-assignment.md) |
| `unicorn/no-typeof-undefined` |  | ✅ `[{"checkGlobalVariables":false}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-typeof-undefined.md) |
| `unicorn/no-unnecessary-array-flat-depth` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-array-flat-depth.md) |
| `unicorn/no-unnecessary-array-splice-count` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-array-splice-count.md) |
| `unicorn/no-unnecessary-await` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-await.md) |
| `unicorn/no-unnecessary-polyfills` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-polyfills.md) |
| `unicorn/no-unnecessary-slice-end` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-slice-end.md) |
| `unicorn/no-unreadable-array-destructuring` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-array-destructuring.md) |
| `unicorn/no-unreadable-iife` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-iife.md) |
| `unicorn/no-unused-properties` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unused-properties.md) |
| `unicorn/no-useless-fallback-in-spread` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-fallback-in-spread.md) |
| `unicorn/no-useless-length-check` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-length-check.md) |
| `unicorn/no-useless-promise-resolve-reject` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-promise-resolve-reject.md) |
| `unicorn/no-useless-spread` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-spread.md) |
| `unicorn/no-useless-switch-case` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-switch-case.md) |
| `unicorn/no-useless-undefined` |  | ❌ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-undefined.md) |
| `unicorn/no-zero-fractions` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-zero-fractions.md) |
| `unicorn/number-literal-case` |  | ✅ `[{"hexadecimalValue":"uppercase"}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/number-literal-case.md) |
| `unicorn/numeric-separators-style` |  | ✅ `[{"onlyIfContainsSeparator":false, "binary":{"minimumDigits":0, "groupLength":4}, "octal":{"minimumDi]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md) |
| `unicorn/prefer-add-event-listener` |  | ✅ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-add-event-listener.md) |
| `unicorn/prefer-array-find` |  | ✅ `[{"checkFromLast":true}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-find.md) |
| `unicorn/prefer-array-flat` |  | ✅ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat.md) |
| `unicorn/prefer-array-flat-map` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat-map.md) |
| `unicorn/prefer-array-index-of` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-index-of.md) |
| `unicorn/prefer-array-some` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-some.md) |
| `unicorn/prefer-at` |  | ✅ `[{"getLastElementFunctions":[], "checkAllIndexAccess":false}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-at.md) |
| `unicorn/prefer-blob-reading-methods` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-blob-reading-methods.md) |
| `unicorn/prefer-code-point` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-code-point.md) |
| `unicorn/prefer-date-now` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-date-now.md) |
| `unicorn/prefer-default-parameters` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-default-parameters.md) |
| `unicorn/prefer-dom-node-append` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-append.md) |
| `unicorn/prefer-dom-node-dataset` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-dataset.md) |
| `unicorn/prefer-dom-node-remove` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-remove.md) |
| `unicorn/prefer-dom-node-text-content` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-text-content.md) |
| `unicorn/prefer-event-target` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-event-target.md) |
| `unicorn/prefer-export-from` |  | ✅ `[{"ignoreUsedVariables":false}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-export-from.md) |
| `unicorn/prefer-global-this` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-global-this.md) |
| `unicorn/prefer-import-meta-properties` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-import-meta-properties.md) |
| `unicorn/prefer-includes` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md) |
| `unicorn/prefer-json-parse-buffer` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-json-parse-buffer.md) |
| `unicorn/prefer-keyboard-event-key` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-keyboard-event-key.md) |
| `unicorn/prefer-logical-operator-over-ternary` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-logical-operator-over-ternary.md) |
| `unicorn/prefer-math-min-max` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-math-min-max.md) |
| `unicorn/prefer-math-trunc` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-math-trunc.md) |
| `unicorn/prefer-modern-dom-apis` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-modern-dom-apis.md) |
| `unicorn/prefer-modern-math-apis` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-modern-math-apis.md) |
| `unicorn/prefer-module` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-module.md) |
| `unicorn/prefer-native-coercion-functions` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-native-coercion-functions.md) |
| `unicorn/prefer-negative-index` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-negative-index.md) |
| `unicorn/prefer-node-protocol` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md) |
| `unicorn/prefer-number-properties` |  | ✅ `[{"checkInfinity":false, "checkNaN":true}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-number-properties.md) |
| `unicorn/prefer-object-from-entries` |  | ✅ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-object-from-entries.md) |
| `unicorn/prefer-optional-catch-binding` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-optional-catch-binding.md) |
| `unicorn/prefer-prototype-methods` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-prototype-methods.md) |
| `unicorn/prefer-query-selector` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-query-selector.md) |
| `unicorn/prefer-reflect-apply` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-reflect-apply.md) |
| `unicorn/prefer-regexp-test` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-regexp-test.md) |
| `unicorn/prefer-set-has` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-set-has.md) |
| `unicorn/prefer-set-size` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-set-size.md) |
| `unicorn/prefer-single-call` |  | ✅ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-single-call.md) |
| `unicorn/prefer-spread` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-spread.md) |
| `unicorn/prefer-string-raw` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-raw.md) |
| `unicorn/prefer-string-replace-all` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-replace-all.md) |
| `unicorn/prefer-string-slice` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-slice.md) |
| `unicorn/prefer-string-starts-ends-with` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-starts-ends-with.md) |
| `unicorn/prefer-string-trim-start-end` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-trim-start-end.md) |
| `unicorn/prefer-structured-clone` |  | ✅ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-structured-clone.md) |
| `unicorn/prefer-switch` |  | ✅ `[{"minimumCases":3, "emptyDefaultCase":"no-default-comment"}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-switch.md) |
| `unicorn/prefer-ternary` |  | ✅ `["only-single-line"]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-ternary.md) |
| `unicorn/prefer-top-level-await` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-top-level-await.md) |
| `unicorn/prefer-type-error` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-type-error.md) |
| `unicorn/prevent-abbreviations` |  | ❌ `[{"checkFilenames":false, "checkDefaultAndNamespaceImports":false, "checkShorthandImports":false, "ex]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md) |
| `unicorn/relative-url-style` |  | ✅ `["never"]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/relative-url-style.md) |
| `unicorn/require-array-join-separator` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/require-array-join-separator.md) |
| `unicorn/require-number-to-fixed-digits-argument` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/require-number-to-fixed-digits-argument.md) |
| `unicorn/require-post-message-target-origin` |  | ❌ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/require-post-message-target-origin.md) |
| `unicorn/string-content` |  | ❌ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/string-content.md) |
| `unicorn/switch-case-braces` |  | ✅ `["always"]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/switch-case-braces.md) |
| `unicorn/template-indent` |  | ✅ `[{}]` | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/template-indent.md) |
| `unicorn/text-encoding-identifier-case` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/text-encoding-identifier-case.md) |
| `unicorn/throw-new-error` |  | ✅ | [📖](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md) |
| **Other Plugin Rules** | | | |
| `@eslint-community/eslint-comments/disable-enable-pair` |  | ✅ `[{"allowWholeFile":true}]` | [📖](https://eslint.org/docs/latest/rules/@eslint-community/eslint-comments/disable-enable-pair) |
| `@eslint-community/eslint-comments/no-aggregating-enable` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/@eslint-community/eslint-comments/no-aggregating-enable) |
| `@eslint-community/eslint-comments/no-duplicate-disable` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/@eslint-community/eslint-comments/no-duplicate-disable) |
| `@eslint-community/eslint-comments/no-unused-disable` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/@eslint-community/eslint-comments/no-unused-disable) |
| `@eslint-community/eslint-comments/no-unused-enable` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/@eslint-community/eslint-comments/no-unused-enable) |
| `import-x/default` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/default) |
| `import-x/export` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/export) |
| `import-x/extensions` |  | ✅ `["always", {"ignorePackages":true}]` | [📖](https://eslint.org/docs/latest/rules/import-x/extensions) |
| `import-x/first` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/first) |
| `import-x/named` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/named) |
| `import-x/namespace` |  | ✅ `[{"allowComputed":true}]` | [📖](https://eslint.org/docs/latest/rules/import-x/namespace) |
| `import-x/newline-after-import` |  | ✅ `[{}]` | [📖](https://eslint.org/docs/latest/rules/import-x/newline-after-import) |
| `import-x/no-absolute-path` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-absolute-path) |
| `import-x/no-amd` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-amd) |
| `import-x/no-anonymous-default-export` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-anonymous-default-export) |
| `import-x/no-cycle` |  | ✅ `[{"ignoreExternal":true, "allowUnsafeDynamicCyclicDependency":false}]` | [📖](https://eslint.org/docs/latest/rules/import-x/no-cycle) |
| `import-x/no-duplicates` |  | ✅ `[{"prefer-inline":true}]` | [📖](https://eslint.org/docs/latest/rules/import-x/no-duplicates) |
| `import-x/no-empty-named-blocks` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-empty-named-blocks) |
| `import-x/no-extraneous-dependencies` |  | ✅ `[{"includeTypes":true}]` | [📖](https://eslint.org/docs/latest/rules/import-x/no-extraneous-dependencies) |
| `import-x/no-mutable-exports` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-mutable-exports) |
| `import-x/no-named-as-default` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-named-as-default) |
| `import-x/no-named-as-default-member` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-named-as-default-member) |
| `import-x/no-named-default` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-named-default) |
| `import-x/no-self-import` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-self-import) |
| `import-x/no-unassigned-import` |  | ✅ `[{"allow":["@babel/polyfill", "**/register", "**/register.*", "**/register/**", "**/register/**.*", "]` | [📖](https://eslint.org/docs/latest/rules/import-x/no-unassigned-import) |
| `import-x/no-useless-path-segments` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-useless-path-segments) |
| `import-x/no-webpack-loader-syntax` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/import-x/no-webpack-loader-syntax) |
| `import-x/order` |  | ✅ `[{"groups":["builtin", "external", "parent", "sibling", "index"], "newlines-between":"never", "warnOn]` | [📖](https://eslint.org/docs/latest/rules/import-x/order) |
| `no-use-extend-native/no-use-extend-native` |  | ✅ | [📖](https://eslint.org/docs/latest/rules/no-use-extend-native/no-use-extend-native) |
| `prettier/prettier` |  | ❌ | [📖](https://eslint.org/docs/latest/rules/prettier/prettier) |

## Detailed Analysis

### Rules Only in eslint.config.js (18)
- `array-bracket-spacing`: ✅ `["never"]`
- `func-style`: ✅ `["declaration", {"allowArrowFunctions":true}]`
- `import/newline-after-import`: ✅
- `import/no-duplicates`: ✅
- `import/no-unresolved`: ❌
- `import/order`: ✅ `[{"groups":[["builtin", "external", "internal"]], "alphabetize":{"order":"asc", "caseInsensitive":tru]`
- `jsdoc/require-file-overview`: ✅ `[{"tags":{"license":{"mustExist":false}, "copyright":{"mustExist":false}}}]`
- `no-restricted-syntax`: ✅ `[{"selector":"ForInStatement", "message":"for...in is not allowed,  use for...of or Object.keys().for]`
- `node-import/prefer-node-protocol`: ✅
- `node/no-extraneous-import`: ✅
- `node/no-missing-import`: ✅ `[{"tryExtensions":[".js", ".mjs", ".ts"]}]`
- `node/no-unsupported-features/es-syntax`: ❌
- `node/prefer-global/buffer`: ❌
- `node/prefer-global/process`: ❌
- `object-curly-spacing`: ✅ `["always"]`
- `quotes`: ✅ `["single", {"avoidEscape":true}]`
- `semi`: ✅ `["always"]`
- `space-in-parens`: ✅ `["never"]`

### Conflicting Rules (4)

These rules are configured differently in each config:
- `camelcase`:
  - ESLint: ✅ `[{"properties":"always", "ignoreDestructuring":true, "ignoreImports":true, "allow":["npm_*", "email_v]`
  - XO: ✅ `[{"allow":[], "ignoreDestructuring":false, "ignoreGlobals":false, "ignoreImports":false, "properties"]`
- `no-var`:
  - ESLint: ✅
  - XO: ✅
- `prefer-const`:
  - ESLint: ✅ `[{"destructuring":"all"}]`
  - XO: ✅ `[{"destructuring":"all", "ignoreReadBeforeAssign":false}]`
- `prefer-destructuring`:
  - ESLint: ✅ `[{"VariableDeclarator":{"array":true, "object":true}, "AssignmentExpression":{"array":false, "object"]`
  - XO: ✅ `[{"VariableDeclarator":{"array":false, "object":true}, "AssignmentExpression":{"array":false, "object]`

### XO-Only Rules (424)

XO includes 424 additional rules not present in the ESLint config.
The most notable categories include:

- **core**: 153 rules
- **unicorn**: 130 rules
- **@stylistic**: 59 rules
- **ava**: 27 rules
- **import-x**: 23 rules
- **n**: 17 rules
- **promise**: 7 rules
- **@eslint-community**: 5 rules
- **no-use-extend-native**: 1 rules
- **import**: 1 rules
- **prettier**: 1 rules

See the full table above for complete details.