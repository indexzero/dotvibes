#!/bin/bash
# Compare linter results

echo "📝 Diff Commands for Comparing Linter Results"
echo "=============================================="
echo ""

FILES=(
  "imports-and-requires.js"
  "variable-declarations.js"
  "functions-and-arrows.js"
  "spacing-and-formatting.js"
  "array-methods.js"
  "error-handling.js"
  "modern-syntax.js"
  "comments-and-docs.js"
)

for file in "${FILES[@]}"; do
  echo "🔍 File: $file"
  echo "─────────────────────────────"

  echo "# ESLint changes (original → eslint-fixed):"
  echo "git diff --no-index --color examples/$file examples/eslint/$file"
  echo ""

  echo "# XO changes (original → xo-fixed):"
  echo "git diff --no-index --color examples/$file examples/xo/$file"
  echo ""

  echo "# Compare both fixes (eslint-fixed vs xo-fixed):"
  echo "git diff --no-index --color examples/eslint/$file examples/xo/$file"
  echo ""
  echo "══════════════════════════════════════════════"
  echo ""
done

echo "🚀 One-liner commands for quick comparison:"
echo ""
echo "# View all ESLint changes at once:"
echo 'for f in examples/*.js; do echo "=== $(basename $f) ==="; git diff --no-index --color "$f" "examples/eslint/$(basename $f)" | head -30; done'
echo ""
echo "# View all XO changes at once:"
echo 'for f in examples/*.js; do echo "=== $(basename $f) ==="; git diff --no-index --color "$f" "examples/xo/$(basename $f)" | head -30; done'
echo ""
echo "# Quick summary of changes per file:"
echo 'for f in examples/*.js; do b=$(basename $f); echo "$b: ESLint=$(git diff --no-index --numstat "$f" "examples/eslint/$b" | cut -f1,2) XO=$(git diff --no-index --numstat "$f" "examples/xo/$b" | cut -f1,2)"; done'