# GitHub Advanced Security (GAS) Alert Fixer: A Hermeneutic Approach
**Skill Version:** 1.1.0
**Description:** Apply Heidegger's hermeneutic circle to understand and fix GitHub Advanced Security alerts within their full system context

## Purpose

This skill helps Claude properly address GitHub Advanced Security (GAS) alerts by understanding them within their full context—not as isolated issues, but as parts of a whole system. The hermeneutic circle teaches us that true understanding comes from moving between the specific (individual alerts) and the general (project architecture, operational context, security posture).

## Activation

This skill activates when:
- User invokes: `/fix-gas [PR_NUMBER]`
- User says: "fix security alerts" or "handle GAS alerts"
- A PR contains GitHub Advanced Security comments
- User runs: `skill: gas`

## Quick Start

```bash
# Analyze and fix all security alerts in PR #123
/fix-gas 123

# Analyze current PR (when in PR branch)
/fix-gas
```

## The Hermeneutic Approach to Security Alerts

Before diving into technical fixes, Claude must apply the hermeneutic circle—moving between the parts (individual alerts) and the whole (project context) to achieve true understanding.

### Step 1: Gather Project Context (The Whole)

Before examining any individual alert, understand the project's nature:

1. **Locate and read context files:**
   - `CLAUDE.md` - Project-specific guidance for Claude
   - `README.md` - Project overview and purpose
   - `SECURITY.md` - Security policies and practices
   - `.github/CODEOWNERS` - Responsibility structure
   - `package.json` or equivalent - Dependencies and scripts

2. **Understand the project's domain:**
   - Is this a library, application, or tool?
   - What are its security boundaries?
   - Who are the users (internal developers, public consumers)?
   - What data does it handle?

3. **Identify operational constraints:**
   - Performance requirements
   - Backwards compatibility needs
   - Deployment environment
   - Regulatory compliance requirements

### Step 2: Examine the Alert (The Part)

For each security alert:

1. **Read the full alert context:**
   - What vulnerability type is identified?
   - What is the attack vector?
   - What is the potential impact?

2. **Locate the code in question:**
   - Read the surrounding code (not just the flagged line)
   - Understand the function's purpose
   - Trace data flow through the system
   - Identify all callers and dependencies

3. **Evaluate the alert's validity:**
   - Is the vulnerable pattern actually reachable?
   - Are there existing mitigations elsewhere?
   - Does the project's threat model include this risk?

### Step 3: Synthesize Understanding (The Circle)

Move between the specific alert and project context to determine the appropriate response:

1. **Consider architectural implications:**
   - Would the suggested fix break existing patterns?
   - Does the vulnerability exist elsewhere in similar code?
   - Should the entire approach be reconsidered?

2. **Evaluate fix strategies:**
   - **Direct fix**: Apply the suggested remediation
   - **Contextual fix**: Modify the suggestion for project patterns
   - **Refactor**: Eliminate the vulnerable pattern entirely
   - **Dismiss**: Document why the alert doesn't apply
   - **Compensating controls**: Add validation/sanitization elsewhere

## Core Workflow

With the hermeneutic understanding established, Claude will execute these steps:

### 1. DETECT - Gather Alert Data
```bash
# Run the detection script
./skills/gas/scripts/view-pr-gas.sh [PR_NUMBER]

# Parse output for:
- Alert severity levels
- File locations and line numbers
- Vulnerability types
- CVE/CWE identifiers
```

### 2. ANALYZE - Context Assessment
```
For each alert, Claude will:
1. Read the affected file completely
2. Trace data flow (3 levels up/down from alert)
3. Check for existing mitigations
4. Identify similar patterns in codebase
5. Assess production reachability
```

### 3. FIX - Apply Targeted Solutions

#### Decision Matrix
```
┌─────────────────────────┬──────────────────┬─────────────────┐
│ Alert Type              │ Auto-Fix?        │ Action          │
├─────────────────────────┼──────────────────┼─────────────────┤
│ Incomplete escaping     │ Yes              │ Apply regex fix │
│ SQL injection           │ Yes              │ Parameterize    │
│ Path traversal          │ Yes              │ Sanitize input  │
│ Insecure temp files     │ Yes              │ Use mkdtemp     │
│ Race conditions         │ Conditional      │ Atomic ops      │
│ Network validation      │ Conditional      │ Add validation  │
│ Dependency CVEs         │ No (notify)      │ Document risk   │
│ Custom/Unknown          │ No (escalate)    │ Ask user        │
└─────────────────────────┴──────────────────┴─────────────────┘
```

### 4. VALIDATE - Ensure Correctness
```bash
# After each fix:
npm test -- --testPathPattern=[affected_file]
npm run lint [affected_file]
git diff [affected_file]  # Review changes
```

### 5. REPORT - Document Changes
Generate structured output:
```markdown
## Security Fixes Applied - PR #[NUMBER]

### Summary
- Fixed: X alerts
- Dismissed: Y alerts
- Escalated: Z alerts
- Runtime impact: [MINIMAL|MODERATE|SIGNIFICANT]

### Details
[For each alert: fix applied, rationale, verification]
```

## Alert-Specific Patterns

### Incomplete String Escaping
**Detection:** `.replace('pattern', 'replacement')` with single occurrence
**Fix Pattern:**
```javascript
// Before
str.replace('*', '.*')
str.replace('%40', '@')

// After
str.replace(/\*/g, '.*')
str.replace(/%40/g, '@')
```
**Validation:** Ensure all occurrences are replaced

### SQL Injection
**Detection:** String concatenation in SQL queries
**Fix Pattern:**
```javascript
// Before
db.query(`SELECT * FROM users WHERE id = ${userId}`)

// After
db.query('SELECT * FROM users WHERE id = ?', [userId])
```
**Validation:** No user input in query strings

### Path Traversal
**Detection:** Unvalidated file paths from user input
**Fix Pattern:**
```javascript
// Before
fs.readFile(userPath)

// After
const safePath = path.resolve(baseDir, path.normalize(userPath))
if (!safePath.startsWith(baseDir)) {
  throw new Error('Invalid path')
}
fs.readFile(safePath)
```
**Validation:** Paths confined to safe directory

### Insecure Temporary Files
**Detection:** Predictable temp file names
**Fix Pattern:**
```javascript
// Before
const tempFile = '/tmp/data.json'

// After
import { mkdtempSync } from 'fs'
import { tmpdir } from 'os'
const tempDir = mkdtempSync(path.join(tmpdir(), 'app-'))
const tempFile = path.join(tempDir, 'data.json')
```
**Validation:** Unique, unpredictable paths

## Tool Orchestration

Claude will use these tool sequences:

### For Analysis Phase
```yaml
sequence:
  - Bash: Run view-pr-gas.sh
  - Read: Get full file content
  - Grep: Find similar patterns
  - Read: Check test files
```

### For Fix Phase
```yaml
sequence:
  - Edit: Apply security fix
  - Bash: Run affected tests
  - If tests fail:
    - Edit: Revert changes
    - AskUserQuestion: Get guidance
```

### For Validation Phase
```yaml
sequence:
  - Bash: npm test
  - Bash: npm run lint
  - Bash: Check for breaking changes
  - If all pass:
    - Bash: git add [files]
    - Bash: git commit -m "fix: [alert_type]"
```

## Error Recovery

### When Automated Fix Fails
1. Revert the attempted fix
2. Document why it failed
3. Create a manual fix suggestion
4. Ask user for guidance with context

### When Tests Break
1. Check if test assumptions changed
2. Update tests if security fix is correct
3. Otherwise, revert and escalate

### When PR Too Large (>50 alerts)
1. Process in batches of 10
2. Commit after each batch
3. Run full test suite between batches

## Examples

### Example 1: String Escaping Fix
```javascript
// Alert: Incomplete string escaping in run/alf3/lib/utils.js:42

// Original code
const pattern = userInput.replace('*', '.*')

// Fixed code
const pattern = userInput.replace(/\*/g, '.*')

// Commit message
fix(security): use global regex replacement to prevent injection

Replaces single-occurrence string replacement with global regex
to ensure all instances are properly escaped.

Fixes: github-advanced-security[bot] alert #1
```

### Example 2: Dismissal with Justification
```javascript
// Alert: Potential SQL injection in src/db/query.js:89

// Analysis shows:
// 1. Input is from internal config file
// 2. No user input reaches this code
// 3. Additional validation at API boundary

// Action: Dismiss with comment
"This alert is a false positive. The value comes from a
trusted internal configuration file with no user input path.
Additionally, input validation occurs at the API boundary
in src/api/middleware/validate.js:34"
```

## Performance Targets

- Single alert: < 10 seconds
- 10 alerts: < 60 seconds
- 50 alerts: < 5 minutes
- Include test validation time

## Integration Points

### CI/CD Pipeline
```yaml
on: [pull_request]
jobs:
  fix-security:
    steps:
      - uses: anthropics/claude-code@v1
      - run: claude-code skill:gas
```

### Git Hooks
```bash
# .git/hooks/pre-push
claude-code skill:gas --check-only
```

### PR Comment Automation
```javascript
// After fixes applied
gh pr comment $PR --body "$(claude-code skill:gas --summary)"
```

## Skill Configuration

### Required Files
- `skills/gas/scripts/view-pr-gas.sh` - Alert detection script
- Project must have `package.json` or language-specific manifest
- Git repository with GitHub remote

### Environment Variables
```bash
GITHUB_TOKEN    # For API access
GAS_AUTO_FIX    # true|false (default: true)
GAS_BATCH_SIZE  # Number of alerts per commit (default: 10)
GAS_TEST_TIMEOUT # Ms to wait for tests (default: 30000)
```

## Safety Constraints

1. **Never auto-fix without tests passing**
2. **Always preserve functionality** - security fixes must not break features
3. **Document every dismissal** with clear justification
4. **Escalate architectural issues** that require design changes
5. **Maintain audit trail** in git history

## Escape Hatches

When Claude encounters:
- Unknown alert types → Ask user for example fix
- Conflicting fixes → Show options, let user choose
- Breaking changes → Explain impact, await approval
- Missing context → Request additional files/info

## Usage Examples

```bash
# Fix all alerts in PR 123
/fix-gas 123

# Check alerts without fixing (dry run)
/fix-gas 123 --dry-run

# Fix only high-severity alerts
/fix-gas 123 --severity=high

# Generate report only
/fix-gas 123 --report-only

# Fix with custom commit message prefix
/fix-gas 123 --commit-prefix="security:"
```

## Success Metrics

Track and optimize for:
- Fix accuracy rate (>95%)
- Test pass rate after fixes (>99%)
- Time to resolution (<5 min average)
- False positive identification (>90% accuracy)
- User intervention rate (<10%)
- Context understanding depth (alerts evaluated within system whole)

## Key Hermeneutic Principles

Remember throughout the process:

1. **Context First**: Never fix an alert without understanding its context within the whole system
2. **The Circle**: Continuously move between the specific (alert) and general (architecture)
3. **Emergent Understanding**: Allow insights to emerge from the interplay between parts and whole
4. **Systemic Thinking**: Consider how fixes affect the entire system, not just the immediate code
5. **Pragmatic Philosophy**: Apply Heidegger's hermeneutic circle in a practical, actionable way

## Implementation Philosophy

The goal is not to achieve zero alerts mechanically, but to achieve appropriate security through deep understanding. Each fix should emerge from comprehending the relationship between the code (part), its purpose (context), and its operational environment (whole).

When in doubt, err on the side of understanding more context rather than applying fixes quickly. A well-understood dismissal based on system-wide analysis is better than a poorly-understood fix that breaks production systems.

---

*This skill applies Heidegger's hermeneutic circle to automated security remediation, following Anthropic's Claude Code best practices while maintaining philosophical depth.*