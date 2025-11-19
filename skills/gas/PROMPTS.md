# GAS Skill - Internal Prompt Templates

These prompts are used by Claude internally when processing security alerts.

## Alert Analysis Template

When analyzing each alert, use this internal reasoning:

```
ALERT: [Type] in [File:Line]

QUESTIONS TO ANSWER:
1. Is user input involved? [YES/NO]
   - If YES: What's the input source?
   - If YES: What validation exists?

2. Is this code reachable in production? [YES/NO/UNCERTAIN]
   - If YES: What's the execution path?
   - If NO: Why not? (dead code, test-only, etc.)

3. Are there compensating controls? [YES/NO]
   - If YES: Where? (List specific files:lines)
   - If YES: Are they sufficient?

4. Will the standard fix work? [YES/NO/NEEDS_MODIFICATION]
   - If NO: What's the issue?
   - If NEEDS_MODIFICATION: What changes needed?

5. Impact of fixing:
   - Performance: [NONE/MINIMAL/SIGNIFICANT]
   - Compatibility: [PRESERVED/BREAKING]
   - Tests affected: [List test files]

DECISION: [FIX/DISMISS/ESCALATE]
RATIONALE: [One sentence explanation]
```

## Fix Verification Template

After applying each fix:

```
FIX APPLIED: [Description]
FILE: [Path]
LINES CHANGED: [Range]

VERIFICATION CHECKLIST:
□ Code compiles without errors
□ Linter passes for changed file
□ Unit tests pass for module
□ Integration tests pass (if applicable)
□ No performance regression detected
□ Security issue resolved
□ No new vulnerabilities introduced

CONFIDENCE: [HIGH/MEDIUM/LOW]
NEEDS REVIEW: [YES/NO]
```

## Batch Processing Template

For multiple alerts:

```
BATCH ANALYSIS - [Count] Alerts

CATEGORIZATION:
- Auto-fixable: [Count] alerts
  * [Type]: [Count]
  * [Type]: [Count]
- Needs review: [Count] alerts
  * Reason: [Description]
- False positives: [Count] alerts
  * Pattern: [Description]

EXECUTION PLAN:
1. Fix auto-fixable alerts in order of:
   - Severity (HIGH → MEDIUM → LOW)
   - Confidence (HIGH → MEDIUM → LOW)
   - File locality (group by file)

2. For review items:
   - Prepare context summary
   - Generate fix suggestions
   - Queue for user decision

3. For false positives:
   - Document justification
   - Create dismissal comments

ESTIMATED TIME: [Minutes]
RISK LEVEL: [LOW/MEDIUM/HIGH]
```

## Dismissal Justification Template

When dismissing an alert:

```
DISMISSAL - Alert #[Number]

TYPE: [FALSE_POSITIVE/ACCEPTED_RISK/MITIGATED_ELSEWHERE]

EVIDENCE:
1. [Specific fact with file:line reference]
2. [Specific fact with file:line reference]
3. [Additional evidence if needed]

VERIFICATION:
- Traced execution path: [Description]
- Checked input sources: [List]
- Confirmed controls: [List with locations]

CONFIDENCE: [HIGH/MEDIUM]
REVIEWED BY: Claude Code (Automated Analysis)
DATE: [Current date]

GitHub Comment:
"Security alert dismissed as [TYPE]. [One-line summary of evidence].
See [file:line] for compensating control. Alert does not represent
exploitable vulnerability in production environment."
```

## Escalation Template

When escalating to user:

```
ESCALATION REQUIRED - Alert #[Number]

ALERT: [Type and location]

ISSUE:
[Clear description of why automated fix isn't appropriate]

OPTIONS:
A) [First approach]
   - Pros: [List]
   - Cons: [List]
   - Example: [Code snippet]

B) [Second approach]
   - Pros: [List]
   - Cons: [List]
   - Example: [Code snippet]

C) [Third approach if applicable]

RECOMMENDATION:
Option [Letter] because [rationale].

QUESTIONS FOR USER:
1. [Specific question about preference/context]
2. [Additional question if needed]

IMPACT ANALYSIS:
- If Option A: [Impact description]
- If Option B: [Impact description]
```

## Commit Message Template

For git commits:

```
fix(security): [action] to prevent [vulnerability type]

- Fixed [count] instances of [vulnerability]
- Updated [files changed]
- Verified with [test type]

Security: Resolves GitHub Advanced Security alert(s) #[numbers]
Impact: [NONE/MINIMAL/MODERATE] on existing functionality
Testing: All tests passing, no regressions detected

[If multiple fixes in commit, list each:]
* [file:line] - [specific change made]
* [file:line] - [specific change made]
```

## PR Comment Summary Template

```markdown
## 🔒 Security Alert Resolution Summary

**PR:** #[number]
**Processed:** [timestamp]
**Duration:** [time taken]

### 📊 Results
| Status | Count | Details |
|--------|-------|---------|
| ✅ Fixed | [n] | Automated fixes applied successfully |
| 🔍 Dismissed | [n] | False positives or mitigated elsewhere |
| ⚠️ Needs Review | [n] | Requires manual decision |
| ❌ Failed | [n] | Could not process automatically |

### ✅ Fixed Issues
[For each fixed alert:]
- **[Type]** in `[file:line]`
  - Applied: [fix description]
  - Verified: Tests pass, functionality preserved

### 🔍 Dismissed Alerts
[For each dismissed:]
- **[Type]** in `[file:line]`
  - Reason: [dismissal reason]
  - Evidence: [brief justification]

### ⚠️ Requires Attention
[For each needs review:]
- **[Type]** in `[file:line]`
  - Issue: [why manual review needed]
  - Suggested: [recommended approach]

### 🎯 Next Steps
1. Review changes in commits [list SHA prefixes]
2. Address items requiring manual review
3. Run full test suite before merge

---
*Automated analysis by Claude Code GAS Skill v1.0.0*
```

## Error Recovery Template

When something goes wrong:

```
ERROR ENCOUNTERED

CONTEXT:
- Processing: [Alert type] in [file:line]
- Step: [Where in workflow]
- Error: [Error message or description]

ATTEMPTED:
1. [First recovery action] → [Result]
2. [Second recovery action] → [Result]

STATE:
- Files modified: [List or NONE]
- Tests status: [PASSING/FAILING/UNKNOWN]
- Git status: [CLEAN/DIRTY]

ROLLBACK:
[If files modified:]
- Reverted: [files]
- Restored: [original state]

USER ACTION NEEDED:
[Clear instruction on what user should do]

PREVENTION:
[Suggestion to avoid this in future]
```

## Pattern Recognition Template

For identifying similar issues:

```
PATTERN DETECTED

PRIMARY ISSUE:
- Type: [Vulnerability type]
- Location: [file:line]
- Pattern: [Code pattern]

SIMILAR OCCURRENCES FOUND:
[Count] additional instances detected

LOCATIONS:
1. [file:line] - [Confidence: HIGH/MEDIUM/LOW]
2. [file:line] - [Confidence: HIGH/MEDIUM/LOW]
[...]

RECOMMENDATION:
[WHEN PATTERN FOUND:]
Apply same fix to all [count] instances to prevent future alerts.

[WHEN NO PATTERN:]
Issue appears isolated to single location.

SEARCH QUERIES USED:
- Grep: [pattern]
- AST: [if applicable]
```

---

These templates ensure consistent, thorough analysis of security alerts while maintaining clear documentation and decision trails.