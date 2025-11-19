# GitHub Advanced Security (GAS) Alert Fixer
**Skill Version:** 1.0.0
**Description:** Automatically analyze and fix GitHub Advanced Security alerts with context-aware solutions

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

## Core Workflow

Claude will execute these steps automatically:

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

---

*This skill follows Anthropic's Claude Code best practices for automated security remediation.*