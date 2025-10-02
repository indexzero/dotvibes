# Linter Comparison Results

## Summary

After running both ESLint and XO with `--fix` on 8 representative JavaScript files:

- **ESLint**: Made minimal changes, focusing on the 22 configured rules
- **XO**: Made extensive changes across 428 rules, reformatting almost everything

## Quick Diff Commands

### Compare a specific file:
```bash
# See what ESLint changed:
git diff --no-index --color examples/imports-and-requires.js examples/eslint/imports-and-requires.js

# See what XO changed:
git diff --no-index --color examples/imports-and-requires.js examples/xo/imports-and-requires.js

# Compare ESLint vs XO fixes:
git diff --no-index --color examples/eslint/imports-and-requires.js examples/xo/imports-and-requires.js
```

### View all changes at once:
```bash
# All ESLint changes:
for f in examples/*.js; do echo "=== $(basename $f) ==="; git diff --no-index --color "$f" "examples/eslint/$(basename $f)" | head -20; done

# All XO changes:
for f in examples/*.js; do echo "=== $(basename $f) ==="; git diff --no-index --color "$f" "examples/xo/$(basename $f)" | head -20; done
```

### Count changes per file:
```bash
for f in examples/*.js; do b=$(basename $f); echo "$b: ESLint=$(git diff --no-index --numstat "$f" "examples/eslint/$b" | cut -f1,2) XO=$(git diff --no-index --numstat "$f" "examples/xo/$b" | cut -f1,2)"; done
```

## Key Differences Observed

### ESLint (22 rules)
- Fixed import ordering and spacing
- Enforced single quotes
- Added semicolons where missing
- Fixed object/array spacing
- Converted some variables to const

### XO (428 rules)
- Complete reformatting with 2-space indentation
- Converted all quotes to single
- Added/removed semicolons consistently
- Modernized syntax (template literals, arrow functions)
- Fixed spacing comprehensively
- Applied unicorn plugin rules (modern patterns)
- Added extensive code quality checks

## Files Overview

1. **imports-and-requires.js** - Module system patterns
2. **variable-declarations.js** - Variable declaration styles
3. **functions-and-arrows.js** - Function declaration patterns
4. **spacing-and-formatting.js** - Formatting inconsistencies
5. **array-methods.js** - Array iteration patterns
6. **error-handling.js** - Error handling approaches
7. **modern-syntax.js** - ES6+ vs ES5 patterns
8. **comments-and-docs.js** - Documentation styles

Run `./compare-linters.sh` for a complete list of diff commands for each file.