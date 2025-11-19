# GAS Skill - Internal Prompt Templates

These prompts guide Claude's application of the hermeneutic circle when processing security alerts.

## Hermeneutic Context Gathering Template

Before analyzing any alerts, establish the whole:

```
PROJECT UNDERSTANDING (The Whole):

1. DOMAIN CONTEXT:
   - Project type: [library/application/tool/service]
   - Primary purpose: [What does this project do?]
   - User base: [Who uses this? Internal/external/public?]
   - Data sensitivity: [What data is handled?]

2. ARCHITECTURAL CONTEXT:
   - Design patterns observed: [List patterns found]
   - Security boundaries identified: [Where are trust boundaries?]
   - Existing security measures: [What protections exist?]
   - Technical constraints: [Performance/compatibility requirements]

3. OPERATIONAL CONTEXT:
   - Deployment environment: [Where does this run?]
   - Threat model: [What threats are relevant?]
   - Compliance requirements: [Any regulations?]
   - Risk tolerance: [From SECURITY.md or inferred]

This understanding of the whole will inform how I interpret each part (alert).
```

## Hermeneutic Alert Analysis Template

When analyzing each alert, apply the hermeneutic circle:

```
ALERT: [Type] in [File:Line]

PART → WHOLE MOVEMENT (Understanding the alert in context):

1. THE PART (Specific Alert):
   - Vulnerability type: [What is claimed?]
   - Code pattern: [What specific code triggered this?]
   - Immediate risk: [What could happen here?]

2. CONTEXTUALIZING IN THE WHOLE:
   - Role in system: [What does this code do in the larger system?]
   - Architectural fit: [How does this align with project patterns?]
   - Trust boundaries: [Where does this sit relative to security boundaries?]
   - Similar patterns: [Where else does this pattern appear?]

3. WHOLE → PART MOVEMENT (Reinterpreting based on context):
   - Given project type [X], is this truly vulnerable?
   - Given operational environment [Y], is this exploitable?
   - Given existing controls [Z], is this mitigated?

4. HERMENEUTIC SYNTHESIS:
   - Is user input involved? [YES/NO]
     * Input source within trust model: [Description]
     * Validation at boundaries: [Where/How]

   - Production reachability: [YES/NO/CONDITIONAL]
     * Execution path: [Trace from entry point]
     * Conditions required: [What must be true?]

   - Compensating controls: [EXIST/ABSENT/PARTIAL]
     * Location: [Specific files:lines]
     * Sufficiency analysis: [Why sufficient/insufficient]

5. EMERGENT UNDERSTANDING:
   - True risk level: [HIGH/MEDIUM/LOW/NONE]
   - Fix appropriateness: [NECESSARY/BENEFICIAL/UNNECESSARY/HARMFUL]
   - System impact of fixing:
     * Performance: [Analysis based on architecture]
     * Compatibility: [Analysis based on constraints]
     * Patterns: [Consistency with project conventions]

DECISION: [FIX/CONTEXTUAL_FIX/DISMISS/ESCALATE]
RATIONALE: [Synthesis of part-whole understanding]
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

## Hermeneutic Decision Framework

When deciding on a fix strategy, apply the circle one final time:

```
HERMENEUTIC FIX DECISION:

1. PART CONSIDERATION (The specific fix):
   - Standard fix: [What is typically recommended?]
   - Technical correctness: [Is the fix technically sound?]
   - Local impact: [What changes in immediate code?]

2. WHOLE CONSIDERATION (System-wide implications):
   - Architectural harmony: [Does fix align with patterns?]
   - Ripple effects: [What else might be affected?]
   - Operational impact: [How does this affect deployment/performance?]
   - Maintenance burden: [What future cost does this create?]

3. SYNTHESIS (Emerging from the circle):
   - If fixing: How to adapt fix to project's whole?
   - If dismissing: What evidence from whole justifies this?
   - If escalating: What whole-system question needs answering?

FINAL STRATEGY:
[Choose based on hermeneutic understanding, not mechanical rules]
```

---

These templates ensure Claude applies Heidegger's hermeneutic circle to security analysis, achieving deep understanding through the interplay of parts and whole rather than mechanical rule application.