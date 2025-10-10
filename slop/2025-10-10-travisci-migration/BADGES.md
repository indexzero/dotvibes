# Status Badges for README

## GitHub Actions CI Badge

### Basic Badge (Recommended)
```markdown
[![CI](https://github.com/indexzero/baltar/actions/workflows/ci.yaml/badge.svg)](https://github.com/indexzero/baltar/actions/workflows/ci.yaml)
```

### Branch-Specific Badge
```markdown
[![CI](https://github.com/indexzero/baltar/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/indexzero/baltar/actions/workflows/ci.yaml)
```

### With Event Filter
```markdown
[![CI](https://github.com/indexzero/baltar/actions/workflows/ci.yaml/badge.svg?event=push)](https://github.com/indexzero/baltar/actions/workflows/ci.yaml)
```

## Codecov Badge (Optional)

After setting up Codecov integration:

```markdown
[![codecov](https://codecov.io/gh/indexzero/baltar/branch/main/graph/badge.svg)](https://codecov.io/gh/indexzero/baltar)
```

With token (for private repos):
```markdown
[![codecov](https://codecov.io/gh/indexzero/baltar/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/indexzero/baltar)
```

## NPM Version Badge

```markdown
[![npm version](https://badge.fury.io/js/baltar.svg)](https://www.npmjs.com/package/baltar)
```

Alternative:
```markdown
[![npm](https://img.shields.io/npm/v/baltar.svg)](https://www.npmjs.com/package/baltar)
```

## Node Version Badge

```markdown
[![node](https://img.shields.io/node/v/baltar.svg)](https://www.npmjs.com/package/baltar)
```

## License Badge

```markdown
[![license](https://img.shields.io/github/license/indexzero/baltar.svg)](LICENSE)
```

## Combined Example for README Header

```markdown
# baltar

[![CI](https://github.com/indexzero/baltar/actions/workflows/ci.yaml/badge.svg)](https://github.com/indexzero/baltar/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/baltar.svg)](https://www.npmjs.com/package/baltar)
[![node](https://img.shields.io/node/v/baltar.svg)](https://www.npmjs.com/package/baltar)
[![license](https://img.shields.io/github/license/indexzero/baltar.svg)](LICENSE)

A few small utilities for working with tarballs and http.
```

## Shields.io Custom Badges

For more customization options, visit: https://shields.io/

Example custom badges:

```markdown
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-9.x-orange)
```

## Status Page

You can also view the live status at:
```
https://github.com/indexzero/baltar/actions/workflows/ci.yaml
```
