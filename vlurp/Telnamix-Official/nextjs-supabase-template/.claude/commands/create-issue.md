---
description: "Create a GitHub issue"
allowed-tools:
  - "Bash(gh:*)"
---

# Create GitHub Issue Command

You are creating a GitHub issue for the repository following best practices and conventional formatting.

## User Instructions

The user may provide additional context or requirements after the command:

- `/git:create-issue add comprehensive logging to auth middleware`
- `/git:create-issue fix login timeout, label it critical and security`
- `/git:create-issue` (you'll infer from conversation context)

Parse their instructions and incorporate into the issue title, body, labels, and priority.

## Issue Numbering System

GitHub automatically assigns sequential numbers to issues (e.g., #1, #2, #3, etc.). These numbers are used to:

- Link commits to issues: `feat: add login (#42)`
- Auto-close issues: `Fixes #42` in commit/PR automatically closes issue #42 when merged
- Cross-reference: Mentioning `#42` anywhere creates a clickable link and timeline entry

## Available Labels in Repository

### Type Labels

- `feat` - New feature or request
- `fix` - Bug fixes
- `docs` - Improvements or additions to documentation
- `refactor` - Code refactoring
- `test` - Testing infrastructure, test coverage, test automation
- `perf` - Performance improvements
- `style` - Code style changes (formatting, whitespace)
- `build` - Build system or external dependencies
- `ci` - CI/CD pipeline changes
- `chore` - Maintenance tasks, dependency updates, tooling
- `security` - Security vulnerabilities
- `bug` - Something isn't working (alias for `fix`)

**Note:** Use both the conventional commit prefix in the title (e.g., `feat:`) AND the corresponding label (e.g., `feat`). They serve different purposes:

- **Title prefix**: Scannable in lists, consistent with commits, machine-readable
- **Label**: Filterable, clickable, color-coded, can combine multiple

### Priority Labels

- `priority: critical` - Drop everything (production broken, data loss, security vulnerability)
- `priority: high` - Next sprint (important feature, significant bug, HIPAA compliance)
- `priority: medium` - Backlog prioritized (nice to have, minor bug, refactor)
- `priority: low` - Nice to have (documentation, minor improvements)

### Status Labels

- `status: triage` - Needs initial review and prioritization (auto-apply to new issues)
- `status: ready` - Triaged and ready to be picked up
- `status: blocked` - Can't proceed, waiting on dependency
- `status: in-progress` - Actively being worked on
- `status: needs-review` - Ready for code review
- `status: on-hold` - Paused or waiting

### Area Labels

- `area: auth` - Authentication/authorization
- `area: api` - API endpoints
- `area: logging` - Logging infrastructure
- `area: database` - Database layer
- `area: ui` - User interface

**Note:** Can apply multiple area labels if the issue spans multiple domains.

### Special Labels

- `HIPAA-compliance` - HIPAA compliance related (audit trails, PHI handling, access control)
- `good first issue` - Good for newcomers (simple, well-defined, low risk)
- `help wanted` - Extra attention is needed (blocked, needs expertise, community help)
- `duplicate` - This issue already exists (reference original with `Duplicate of #123`)
- `invalid` - This doesn't seem right (off-topic, spam, not reproducible)
- `question` - Further information requested (clarification needed, discussion)
- `wontfix` - This will not be worked on (out of scope, design decision)

## Instructions

1. **Analyze the user's request** to understand:
   - What type of issue is this? (bug, enhancement, documentation, etc.)
   - What area does it affect? (auth, api, logging, database, ui)
   - What priority should it have? (critical, high, medium, low)
   - Does it involve HIPAA compliance?
   - Any user-specified labels

2. **Draft a comprehensive issue** with this structure:

   ```markdown
   ## Problem/Overview

   [Clear description of the problem or feature request]

   ### Current State

   - ✅ What's working
   - ❌ What's missing/broken

   ## Requirements

   [Detailed requirements, numbered or bulleted]

   ## Acceptance Criteria

   - [ ] Checkboxes for what defines "done"

   ## Technical Considerations

   [Implementation details, code snippets if helpful]

   ## Related Files

   - `path/to/file.ts` - Description

   ## Priority

   **[Critical/High/Medium/Low]** - Brief justification

   ## Labels

   [List of proposed labels]
   ```

3. **Select appropriate labels**:
   - **Always include**:
     - One type label (feat, fix, docs, refactor, test, perf, style, build, ci, chore, security, bug)
     - One priority label (critical, high, medium, low)
     - `status: triage` for new issues (default)
   - **Include if applicable**:
     - One or more area labels (auth, api, logging, database, ui)
     - `HIPAA-compliance` if security/audit/compliance related
     - `security` if security vulnerability
     - `good first issue` if simple/beginner-friendly
     - `help wanted` if you need extra attention or expertise
   - **Include user-specified labels** (add to the list)

4. **Present the issue to the user** in this format:

   ```
   📋 Issue Draft
   Title: [Your proposed title]

   Labels: [comma-separated list]

   Body:
   [Show the full issue body]

   ---

   Does this look good? I can:
   - Create it as-is
   - Adjust title, labels, or content
   - Cancel
   ```

5. **Wait for user approval** before creating the issue

6. **Create the issue** using gh CLI:

   ```bash
   gh issue create --title "..." --body "..." --label "label1,label2,label3"
   ```

7. **Return the issue URL** to the user

## Best Practices

### Title Format

Use Conventional Commits style (lowercase type, imperative mood):

- `feat: add user CSV export` (enhancements)
- `fix: resolve login timeout on mobile` (bugs)
- `docs: update API authentication guide` (documentation)
- `test: add integration tests for payments` (testing)
- `refactor: simplify auth middleware logic` (refactors)
- `perf: optimize database queries in user search` (performance)
- `chore: update dependencies to latest` (maintenance)

### Content Guidelines

- **Be specific**: Include file paths, line numbers, function names
  - ❌ "Login is broken"
  - ✅ "Login timeout in `middleware.ts:45` after 30 seconds"

- **Add code examples**: Show current vs. desired behavior

  ```typescript
  // Current (broken)
  const timeout = 5000; // Too short

  // Desired
  const timeout = 30000; // 30 seconds
  ```

- **Link related issues**: Reference other issues with `#123` syntax
  - "Relates to #42"
  - "Blocked by #15"
  - "Duplicate of #38"

- **Include acceptance criteria**: Checkboxes that define "done"
  - [ ] Login succeeds within 30 seconds
  - [ ] Tests pass for slow network conditions
  - [ ] No timeout errors in logs

### Priority Guidelines

- `priority: critical` - Production broken, data loss, security breach, HIPAA violation
- `priority: high` - Important feature, significant bug, compliance requirement, blocking work
- `priority: medium` - Useful feature, minor bug, refactor, nice-to-have improvement
- `priority: low` - Documentation, polish, minor enhancements

### Workflow Context

Once created, the issue lifecycle will be:

1. **Created** → `status: triage` (needs review)
2. **Triaged** → `status: ready` (approved for work)
3. **Started** → `status: in-progress` (someone working on it)
4. **Completed** → PR created with `Fixes #123` → Issue auto-closes when merged

## Example

User input: "We need logging in the auth middleware, label it as high priority"

Your response:

````
📋 Issue Draft

Title: feat: add comprehensive logging to auth middleware

Labels: feat,area: auth,area: logging,priority: high,status: triage,HIPAA-compliance

Body:
## Problem
The authentication middleware currently has no logging, making it impossible to audit authentication attempts, failures, or security events. This is a HIPAA compliance gap.

### Current State
- ✅ Middleware validates JWT tokens in `middleware.ts:145`
- ✅ Middleware checks permissions in `lib/auth/permissions.ts`
- ❌ No logging of auth events
- ❌ No audit trail for failures
- ❌ Cannot trace security incidents

## Requirements
1. Log all authentication attempts (success/failure)
2. Log authorization checks (permission validation)
3. Include user context (userId, sessionId, IP address, user agent)
4. Use EventType.LOGIN, EventType.AUTH_FAILURE, EventType.AUTHORIZATION_DENIED
5. Ensure HIPAA compliance with full audit trail

## Acceptance Criteria
- [ ] All auth middleware functions have appropriate logging
- [ ] Failed auth attempts logged with EventType.AUTH_FAILURE
- [ ] Successful logins logged with EventType.LOGIN
- [ ] Permission denials logged with EventType.AUTHORIZATION_DENIED
- [ ] User context (userId, sessionId, IP, userAgent) captured in all logs
- [ ] Integration tests verify logging behavior
- [ ] Logs include request ID for tracing

## Technical Considerations
```typescript
// In middleware.ts:145
import { logger } from '@/lib/logging/logger.server';

export async function middleware(req: NextRequest) {
  try {
    const session = await validateSession(req);
    logger.info('Authentication successful', {
      event: EventType.LOGIN,
      userId: session.userId,
      sessionId: session.id,
      requestId: req.headers.get('x-request-id'),
    });
  } catch (error) {
    logger.error('Authentication failed', {
      event: EventType.AUTH_FAILURE,
      error,
      requestId: req.headers.get('x-request-id'),
    });
  }
}
````

## Related Files

- `middleware.ts:145` - Main auth middleware
- `lib/auth/permissions.ts` - Permission validation
- `lib/logging/logger.server.ts` - Server-side logger

## Related Issues

None

## Priority

**High** - HIPAA requires comprehensive audit trails for all authentication/authorization events

---

Does this look good? I can:

- Create it as-is
- Adjust title, labels, or content
- Cancel

```

## Notes

- Always use the exact label names from the "Available Labels" section
- Multiple labels are comma-separated with no spaces: `label1,label2,label3`
- If unsure about priority, default to `medium` and let user adjust
- If the issue touches multiple areas, you can apply multiple area labels
- Always explain your reasoning for label choices
```
