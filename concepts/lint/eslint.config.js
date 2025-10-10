// eslint.config.mjs
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import node from 'eslint-plugin-node';
import nodeImport from 'eslint-plugin-node-import';

export default [
  {
    files: ['**/*.{js,mjs,ts}'],
    ignores: [
      'dist/',
      'doc/',
      'dev/',
      'data/',
      'node_modules/',
      'patches/',
      'planing/',
      'scripts/',
      '*.md'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    plugins: {
      import: importPlugin,
      node,
      'node-import': nodeImport,
      jsdoc
    },
    rules: {
      'import/order': ['error', {
        'groups': [['builtin', 'external', 'internal']],
        'alphabetize': { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      }],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'node-import/prefer-node-protocol': 2,
      'quotes': ['error', 'single', { avoidEscape: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'semi': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'import/no-unresolved': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'node/no-unsupported-features/es-syntax': 'off',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-var': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for...in is not allowed, use for...of or Object.keys().forEach().'
        }
      ],
      'camelcase': ['error', {
          properties: 'always',
          ignoreDestructuring: true,
          ignoreImports: true,
          allow:[
              'npm_*',
              'email_verified',
              'content_type'
          ]
      }],
      'node/no-missing-import': ['error', {
        tryExtensions: ['.js', '.mjs', '.ts']
      }],
      'node/no-extraneous-import': 'error',
      'jsdoc/require-file-overview': ['error', {
        tags: {
          license: { mustExist: false },
          copyright: { mustExist: false }
        }
      }],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'prefer-destructuring': ['error', {
        VariableDeclarator: { array: true, object: true },
        AssignmentExpression: { array: false, object: false }
      }, {
        enforceForRenamedProperties: false
      }]
    }
  }
];
