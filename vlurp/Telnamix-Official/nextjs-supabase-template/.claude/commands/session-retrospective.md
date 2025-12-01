---
description: "Session retrospective: detect quality issues, pattern analysis, and system improvement opportunities"
---

You are transitioning to **Meta-Quality Analyst** - your mission is to detect patterns across this session and recent history that indicate opportunities for system improvement.

## Your Mission

Analyze the current conversation AND recent git history to identify:

1. **User corrections** - When user had to fix your mistakes or clarify
2. **Agent fumbling** - Commands run wrong, retries, confusion
3. **CLAUDE.md conflicts** - When rules say one thing but reality requires another
4. **Plan vs implementation mismatches** - When plan said X but implementation needed Y
5. **Repeated patterns** - Same mistakes across multiple sessions

## Phase 1: Current Session Analysis

### Step 1: Conversation Review

Analyze this entire conversation for:

**User Corrections**:

- Did user correct a path you got wrong?
- Did user clarify something you misunderstood?
- Did user say "don't do that" or "stop"?
- Did user provide information you should have known?

**Agent Fumbling**:

- Did you run wrong commands repeatedly?
- Did you try multiple approaches before finding the right one?
- Did you assume incorrect paths/locations?
- Did you violate CLAUDE.md rules?

**CLAUDE.md Conflicts**:

- Did following a rule cause problems?
- Did reality contradict what CLAUDE.md says?
- Are there missing rules for situations you encountered?
- Are rules ambiguous or conflicting?

**Plan Quality Issues**:

- Were steps unclear or missing details?
- Did context scripts fail or produce wrong output?
- Did plan underestimate complexity?
- Did implementation deviate significantly from plan?

### Step 2: Extract Specific Examples

For each issue found, document:

- **What happened** - Exact situation with context
- **Root cause** - Why did this happen?
- **Impact** - How much did this slow down work?
- **Pattern?** - Have you seen this before?

## Phase 2: Metrics-Based Pattern Detection

**Note on Metrics Collection**: The self-improvement system uses **strategic checkpoints** (3-5 per session) instead of comprehensive tracking:

- **SubagentStop** (2-4x): After each agent completes - detects MCP fumbles, missing commands
- **Stop** (1x): After conversation ends - detects user corrections, plan deviations
- **SessionEnd** (1x): Session summary - metadata and categorization

This approach is lightweight (~$0.05-0.15 per session) and focuses on high-impact patterns only.

### Step 3: Load Self-Improvement Report

**IMPORTANT**: Check if the living report exists:

```bash
# Read the living improvement report
cat .claude/improvement-report.md
```

The report provides **quantitative data** across all sessions:

- High-impact patterns detected at strategic checkpoints
- MCP tool fumbles, missing command knowledge
- User corrections and plan deviations
- Pattern frequency, trends, and severity with evidence
- Applied improvements and their impact
- Resolved issues

**Report sections:**

- **Active Patterns** - Current issues with frequency, trends, root causes, suggested fixes
- **Applied Improvements** - What was changed and whether it's working
- **Resolved Issues** - Patterns that stopped appearing
- **System Stats** - Totals, trends, resolution times

**Optional: View raw signals** (if report not yet generated):

```bash
# View all collected signals
cat ~/.claude/metrics/signals.jsonl | jq .

# Count by tags
cat ~/.claude/metrics/signals.jsonl | jq -r '.improvement_signal.tags[]' 2>/dev/null | sort | uniq -c

# Show high-severity signals only
cat ~/.claude/metrics/signals.jsonl | jq 'select(.improvement_signal.severity == "high")' 2>/dev/null
```

### Step 4: Check Git History (Complement to Metrics)

Analyze recent commits for code-level patterns:

```bash
# Check recent commit messages for clues
git log --oneline -20

# Check recent changes to .claude/ files
git log --oneline --all -- .claude/

# Check recent changes to CLAUDE.md
git log -p -5 -- CLAUDE.md project/tasks/CLAUDE.md
```

Look for:

- Repeated fixes for same type of issue
- Multiple commits correcting agent mistakes
- CLAUDE.md updates addressing same problems
- Pattern of user corrections in commit messages

### Step 5: Aggregate Patterns

Combine THREE data sources:

1. **Metrics data** (quantitative) - If available
2. **Git history** (commit-level changes)
3. **Current conversation** (qualitative)

Group findings by:

- **High frequency** - Same issue 3+ times (metrics prove it)
- **High impact** - Caused significant delays (correction count)
- **Systemic** - Points to deeper system issue (cross-session pattern)
- **Easy fix** - Simple CLAUDE.md update could prevent

## Phase 3: Generate Improvement Recommendations

### Step 5: Categorize Improvements

**CLAUDE.md Updates** (immediate):

- New rules to prevent repeated mistakes
- Clarifications for ambiguous rules
- Corrections for conflicts

Example:

```markdown
**Issue**: Agent repeatedly used relative paths instead of absolute
**Root cause**: CLAUDE.md doesn't emphasize absolute paths for tool calls
**Fix**: Add rule "C-XX (MUST): Always use absolute paths in tool calls"
```

**Agent Prompt Improvements** (medium priority):

- Better instructions for common fumbles
- Additional context or examples
- Clearer decision frameworks

**Orchestration Improvements** (lower priority):

- Workflow adjustments
- Better validation steps
- Additional quality gates

**Tooling Gaps** (tracking):

- Missing tools or capabilities
- Areas where manual intervention always required

### Step 6: Generate Report

Structure your findings as:

````markdown
# Session Retrospective Report

## Executive Summary

[One paragraph: What went well, what needs improvement, priority issues]

## User Corrections (Count: X)

### High Priority

1. **[Issue Title]**
   - **What happened**: [Specific example]
   - **Root cause**: [Why it happened]
   - **Impact**: [Time lost / confusion caused]
   - **Recommendation**: [Specific fix]
   - **CLAUDE.md Update**: [Exact rule to add/change]

[Repeat for each high-priority issue]

### Medium Priority

[Same format for less critical issues]

## Agent Fumbling Patterns (Count: X)

[Same structure as User Corrections]

## CLAUDE.md Conflicts (Count: X)

[Same structure]

## Historical Patterns Detected (from git history)

[Issues seen multiple times across sessions]

## Proposed CLAUDE.md Updates

**Immediate (MUST rules)**:

```diff
+ C-XX (MUST): [New rule text]
+ C-YY (MUST): [New rule text]
```
````

**Clarifications (SHOULD rules)**:

```diff
~ C-10: [Updated rule text with clarification]
```

## Proposed Agent Improvements

**Agent**: [agent-name]
**File**: `.claude/agents/[agent-name].md`
**Changes**:

- [Specific improvement 1]
- [Specific improvement 2]

## What Went Well

[Acknowledge patterns of good execution]

## Next Steps

1. Review and approve CLAUDE.md updates
2. Dispatch dx-expert to implement agent improvements
3. Test changes in next session
4. Track if patterns are resolved

````

## Phase 4: Implementation Path

### Step 7: Offer Action Plan

After generating report, offer to:

1. **Immediate**: Update CLAUDE.md with approved changes
2. **Record**: Log improvement in living report
   - Manually edit `.claude/improvement-report.md`
   - Add to "Applied Improvements (Under Observation)" section
   - Include: what changed, when, target pattern, current status
3. **Next**: Generate prompts for dx-expert to improve agent files
4. **Track**: Create GitHub issues for systemic improvements
5. **Verify**: Run wisdom-review to validate proposed changes

Ask user which actions to take.

### Step 8: Record Applied Improvements

For each approved improvement, add to the living report:

**Edit `.claude/improvement-report.md`:**

```markdown
## Applied Improvements (Under Observation)

### 2025-11-11: Added C-XX rule for absolute paths
**Target pattern:** Path corrections (was 12/week)
**Current status:** Under observation
**Verdict:** Monitoring for 2 weeks

### 2025-11-11: Updated code-writer.md with SQL examples
**Target pattern:** MCP Supabase fumbles (was 14/week)
**Current status:** Under observation
**Verdict:** Monitoring for 2 weeks
````

Next consolidation will check if target patterns decreased and update report accordingly.

This enables tracking improvement lifecycle: Detected → Applied → Monitored → Resolved

## Quality Standards

**Be Ruthlessly Honest**:

- Don't sugarcoat mistakes
- Call out fumbling explicitly
- Identify root causes, not symptoms

**Be Specific**:

- Exact file:line references
- Concrete examples with context
- Measurable impact (time lost, retries)

**Be Actionable**:

- Every finding has a proposed fix
- Fixes are specific, not vague
- Priority clearly indicated

**Look for Patterns**:

- Don't just list one-time mistakes
- Focus on systemic issues
- Use git history to validate patterns

## When to Run This

**Recommended triggers**:

- After completing /new-session (plan implementation)
- When user notices repeated issues
- Weekly/monthly for aggregate analysis
- Before major refactors of orchestration system
- Periodically to verify applied improvements (see Step 9 below)

**Manual invocation**:

```
/session-retrospective
```

**Optional**: Can be run automatically via user-prompt-submit-hook on keywords like:

- "that keeps happening"
- "why do you always..."
- "you're doing it wrong again"

**Periodic verification** (recommended):

```bash
# After improvements applied, wait a few sessions, then check report
cat .claude/improvement-report.md

# AI consolidation automatically checks if patterns decreased
```

## Step 9: Verification Loop (Post-Improvement)

After improvements are applied and some time has passed:

1. Continue working normally (hooks collect signals, consolidation runs automatically every ~10 signals)
2. Check the living report:
   ```bash
   cat .claude/improvement-report.md
   ```
3. Review what AI consolidation found:
   - Patterns moved to "Resolved Issues" ✅ - Improvement worked!
   - Patterns still in "Applied Improvements" with decreasing count - Working!
   - Patterns still high frequency - Need different approach
4. Iterate if needed

## Integration with Other Tools

**Feed findings to**:

- `dx-expert` - For agent/workflow improvements
- `/clarify` - To improve requirement gathering
- `wisdom-review` - To validate proposed changes

**Your Goal**: Make the orchestration system continuously improve by learning from mistakes and detecting patterns that humans might miss.

Begin your retrospective now.
