---
description: "Commit code to remote"
allowed-tools:
  - "Bash(git:*)"
---

## User Instructions

The user may provide additional context after the command:

- `/git:commit fixes #123`
- `/git:commit closes #45 and #67, also related to #12`
- `/git:commit this is a breaking change`
- `/git:commit` (you'll infer from the diff)

Parse their instructions and incorporate into the commit message, especially issue linking and breaking change annotations.

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
- Open issues in repo: gh issue list --limit 10

## Your Task

Add all changes to staging, create a commit following Conventional Commits format, and push to remote.

## Commit Message Structure

Use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat:` - New feature (correlates with MINOR in SemVer)
- `fix:` - Bug fix (correlates with PATCH in SemVer)
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring (neither fixes bug nor adds feature)
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `build:` - Build system or external dependencies
- `ci:` - CI configuration changes
- `chore:` - Other changes (dependency updates, tooling, etc.)

### Breaking Changes

- Add '!' after type/scope: "feat!: drop support for Node 14"
- Or add footer: `BREAKING CHANGE: description of breaking change`

### Issue Linking

**CRITICAL:** Properly link commits to issues using these patterns:

#### 1. Auto-Close Issue (when this commit/PR fully resolves the issue)

Use closing keywords in the commit body or footer:

```
fix: resolve login timeout on mobile

Increased session timeout from 5s to 30s to handle slow networks.

Fixes #123
```

**Closing keywords:** `Fixes`, `Closes`, `Resolves` (case-insensitive)

- When merged to main branch → Issue automatically closes

#### 2. Reference Issue (progress update, doesn't close)

Use `(#123)` in description or mention in body:

```
feat: add CSV export button (#156)

Added export button to reports page. Still need to implement
the actual export logic and tests.

Related to #156
```

**Reference keywords:** `Related to`, `Part of`, `See`, `Ref` (informal, doesn't auto-close)

#### 3. Multiple Issues

```
feat: improve auth middleware logging

Added comprehensive logging for all auth events.

Fixes #42
Closes #43
Related to #15
```

### Examples

#### Example 1: Bug fix that closes an issue

```
fix: resolve session timeout on mobile devices (#123)

Increased timeout from 5 seconds to 30 seconds to accommodate
slower network conditions on mobile.

Changes:
- Updated SESSION_TIMEOUT constant in lib/auth/session.ts
- Added timeout configuration tests
- Updated documentation

Fixes #123
```

#### Example 2: Feature implementation (partial progress)

```
feat: add CSV export button to reports page (#156)

Added UI button component, still need to implement backend
export logic in next commit.

Related to #156
```

#### Example 3: Feature completion (closes issue)

```
feat: complete CSV export functionality (#156)

Implemented full CSV export pipeline:
- Export button UI (from previous commit)
- Backend export API endpoint
- CSV generation service
- Integration tests

Fixes #156
```

#### Example 4: Simple commit without issue

```
chore: update dependencies to latest versions
```

#### Example 5: Breaking change

```
feat!: migrate to new auth API

Replaced legacy auth system with modern OAuth 2.0 flow.

BREAKING CHANGE: Old auth tokens are no longer valid. Users must re-authenticate.

Fixes #89
```

## Instructions

1. **Analyze the changes** in `git diff` to understand what was modified
2. **Check open issues** to see if any are relevant to these changes
3. **Determine commit type** (feat, fix, docs, etc.)
4. **Write descriptive subject line** (imperative mood, lowercase, no period)
5. **Add body if needed** (explain WHY, not WHAT - the diff shows what)
6. **Link issues appropriately**:
   - Use `Fixes #123` if this commit/PR fully resolves an issue
   - Use `(#123)` or `Related to #123` if this is partial progress
   - Skip issue linking if not related to any issue
7. **NEVER mention Claude or Anthropic** in commit messages
8. **Use HEREDOC format** for multi-line commits:

```bash
git commit -m "$(cat <<'EOF'
feat: add user export functionality (#156)

Implemented CSV export for user data with proper
HIPAA-compliant audit logging.

Fixes #156
EOF
)"
```
