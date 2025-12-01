# PR Review Response: A Hermeneutic Approach to Feedback
**Skill Version:** 1.0.0
**Description:** Apply Heidegger's hermeneutic circle to understand and respond to PR reviews, differentiating between human expertise and AI pattern recognition

## Purpose

This skill helps Claude understand PR review comments within their full context—recognizing that feedback from humans and AI/bots emerges from fundamentally different interpretive frameworks. The hermeneutic circle teaches us that understanding comes from moving between the specific (individual comments) and the general (reviewer context, PR goals, team dynamics).

## Activation

This skill activates when:
- User invokes: `/respond-review [PR_NUMBER]`
- User says: "address PR comments" or "handle review feedback"
- A PR has review comments requiring response
- User runs: `skill: pr-review`

## Quick Start

```bash
# Analyze and respond to all PR review comments
/respond-review 456

# Focus on specific reviewer
/respond-review 456 --reviewer=johndoe

# Preview responses without posting
/respond-review 456 --dry-run
```

## The Hermeneutic Approach to PR Reviews

### Understanding Reviewer Types

Before addressing any comment, Claude must understand the nature of the reviewer:

#### Human Reviewers
- **Context**: Bring domain expertise, experience, and implicit knowledge
- **Intent**: May use shorthand, assume shared context, express preferences
- **Emotion**: Can convey frustration, enthusiasm, or concern
- **Interpretation**: Requires reading between lines, understanding team dynamics

#### AI/Bot Reviewers (Copilot, Claude, etc.)
- **Context**: Pattern-based analysis, systematic checks
- **Intent**: Explicit, rule-based, consistent
- **Emotion**: Neutral, objective
- **Interpretation**: Requires validation of patterns, checking for false positives

### Step 1: Gather PR Context (The Whole)

Before examining individual comments, understand the PR's nature:

1. **Understand the PR's purpose:**
   - Read PR title and description completely
   - Identify the problem being solved
   - Understand the approach taken
   - Note any stated constraints or trade-offs

2. **Analyze the changes:**
   - Review modified files and their relationships
   - Understand the architectural impact
   - Identify breaking changes or compatibility concerns
   - Assess test coverage changes

3. **Know your reviewers:**
   - Identify each reviewer (human vs bot)
   - For humans: Check their role (maintainer, peer, external)
   - For bots: Understand their analysis patterns
   - Review past interactions if available

4. **Team dynamics:**
   - Communication style (formal/informal)
   - Decision-making process
   - Technical preferences and patterns
   - Historical context from similar PRs

### Step 2: Examine Each Comment (The Parts)

For each review comment, apply different hermeneutic lenses:

#### For Human Comments:

1. **Surface reading:**
   - What is literally being asked?
   - Is this a question, suggestion, or requirement?
   - What code is being referenced?

2. **Contextual reading:**
   - What expertise does this reviewer bring?
   - Are they referencing team patterns or personal preference?
   - Is there historical context to this feedback?

3. **Emotional reading:**
   - What tone is conveyed?
   - Is there frustration with repeated issues?
   - Is this blocking or non-blocking feedback?

4. **Implicit reading:**
   - What's not being said directly?
   - Are there underlying concerns?
   - Is this part of a larger architectural discussion?

#### For AI/Bot Comments:

1. **Pattern identification:**
   - What pattern triggered this comment?
   - Is the pattern correctly identified?
   - Does it apply in this specific context?

2. **Validation check:**
   - Is this a true positive or false positive?
   - Does the surrounding code provide mitigation?
   - Are there project-specific exceptions?

3. **Severity assessment:**
   - Is this critical or informational?
   - Does it represent actual risk?
   - Can it be safely dismissed with justification?

4. **Systematic response:**
   - Should this pattern be fixed everywhere?
   - Is this a one-off exception?
   - Should project rules be updated?

### Step 3: Synthesize Understanding (The Circle)

Move between specific comments and PR context to formulate responses:

1. **For Human Feedback:**
   - Honor the expertise and experience shared
   - Address underlying concerns, not just surface issues
   - Acknowledge valid points even when disagreeing
   - Provide context for decisions made
   - Suggest compromises when appropriate

2. **For AI/Bot Feedback:**
   - Validate or refute with specific evidence
   - Provide context the bot lacks
   - Fix systematic issues it correctly identifies
   - Document why false positives don't apply
   - Update rules/configs to prevent future false positives

## Core Workflow

### 1. GATHER - Collect Review Data

```bash
# Fetch all review comments
./skills/pr-review/scripts/fetch-pr-reviews.sh [PR_NUMBER]

# Categorize by reviewer type
./skills/pr-review/scripts/categorize-reviewers.sh [PR_NUMBER]

# Extract:
- Reviewer identities and types
- Comment threads and contexts
- Requested changes vs suggestions
- Approval states
```

### 2. ANALYZE - Apply Hermeneutic Understanding

```yaml
For each comment:
  1. Identify reviewer type (human/bot)
  2. Apply appropriate interpretive lens
  3. Understand within PR context
  4. Determine response strategy
  5. Check for related comments
```

### 3. RESPOND - Craft Contextual Responses

#### Response Decision Matrix

```
┌─────────────────────┬────────────────┬───────────────────┐
│ Comment Type        │ Human Reviewer │ AI/Bot Reviewer   │
├─────────────────────┼────────────────┼───────────────────┤
│ Valid concern       │ Fix + thank    │ Fix + confirm     │
│ Preference          │ Discuss/adopt  │ Evaluate pattern  │
│ Misunderstanding    │ Clarify gently │ Provide context   │
│ Out of scope        │ Defer politely │ Document scope    │
│ False positive      │ Explain context│ Dismiss + evidence│
│ Question            │ Answer fully   │ Clarify pattern   │
│ Blocking issue      │ Fix immediately│ Validate first    │
└─────────────────────┴────────────────┴───────────────────┘
```

### 4. IMPLEMENT - Make Changes

```bash
# For accepted feedback
- Make requested changes
- Update tests if needed
- Add documentation
- Commit with attribution

# For discussion items
- Post clarifying response
- Suggest alternatives
- Request more context
- Propose compromise
```

### 5. COMMUNICATE - Post Responses

Generate responses that reflect understanding:

#### For Human Reviewers:
```markdown
@reviewer Thanks for catching this! You're absolutely right about [specific insight].
I've updated the implementation to [change made]. This also addresses your concern
about [underlying issue].
```

#### For AI/Bot Reviewers:
```markdown
This alert is a false positive in this context because [specific reason].
The code at [file:line] provides [mitigation]. Project conventions established
in [reference] handle this pattern differently.
```

## Response Templates by Reviewer Type

### Human Reviewer Responses

#### Accepting Feedback
```
Thank you for this insight, @{reviewer}. {Acknowledge expertise/experience}.
I've {specific change made} which {benefit achieved}.
{Optional: This aligns with your earlier point about X}
```

#### Respectful Disagreement
```
I appreciate your perspective on {topic}, @{reviewer}.
I chose {current approach} because {reasoning with context}.
Would {alternative/compromise} address your concern while maintaining {requirement}?
```

#### Clarification Request
```
Good point about {topic}, @{reviewer}. To ensure I address this correctly,
could you clarify {specific question}?
I want to make sure the solution aligns with {team goal/pattern}.
```

### AI/Bot Reviewer Responses

#### Valid Pattern Fix
```
Fixed: {Clear description of change}
This addresses the {pattern type} identified by the analysis.
Verified with {test/validation performed}.
```

#### False Positive Dismissal
```
This is a false positive because:
1. {Specific context bot lacks}
2. {Mitigation that exists elsewhere}
3. {Project-specific pattern or exception}

Reference: {Link to documentation/precedent}
```

#### Partial Acceptance
```
Partially addressed: The {valid concern} has been fixed in {change}.
The {other part} doesn't apply here due to {specific reason}.
Updated {config/rules} to prevent future false positives.
```

## Hermeneutic Principles for Reviews

### The Human Circle
- **Part**: Individual comment from human reviewer
- **Whole**: Their expertise, role, past reviews, team dynamics
- **Synthesis**: Response that honors their contribution while advancing the PR

### The AI Circle
- **Part**: Pattern-based comment from bot
- **Whole**: Bot's ruleset, project context it lacks, systematic patterns
- **Synthesis**: Response that fixes real issues while educating the system

### Universal Principles

1. **Respect the Reviewer**: Whether human or bot, feedback has value
2. **Context is King**: Always provide context the reviewer may lack
3. **Learn from Patterns**: Both human and AI feedback reveal patterns
4. **Improve the System**: Use feedback to enhance code and process
5. **Build Relationships**: With humans through appreciation, with bots through configuration

## Tool Orchestration

### For Analysis Phase
```yaml
sequence:
  - Bash: Run fetch-pr-reviews.sh
  - Bash: Run categorize-reviewers.sh
  - Read: PR description and changes
  - Grep: Find related code patterns
  - Read: Team documentation/conventions
```

### For Response Phase
```yaml
sequence:
  - Edit: Make accepted changes
  - Bash: Run relevant tests
  - Write: Craft responses
  - Bash: Post comments via gh CLI
  - Bash: Update PR status
```

## Configuration

### Required Files
- `skills/pr-review/scripts/fetch-pr-reviews.sh` - Get review comments
- `skills/pr-review/scripts/categorize-reviewers.sh` - Identify reviewer types
- `.claude/team-context.md` - Optional team dynamics documentation

### Environment Variables
```bash
GITHUB_TOKEN           # For API access
PR_RESPONSE_STYLE      # formal|casual|technical
AUTO_FIX_BOT_ISSUES   # true|false (default: true)
HUMAN_REVIEW_PRIORITY # true|false (default: true)
```

## Success Metrics

Track effectiveness:
- Human reviewer satisfaction (re-reviews needed)
- Bot false positive rate
- Time to address feedback
- Conversation depth (back-and-forth reduction)
- PR approval velocity

## Key Differentiation

### Human Reviewers
- **Approach**: Empathetic, contextual, relationship-aware
- **Priority**: Understanding intent beyond words
- **Response**: Thoughtful, acknowledging expertise
- **Goal**: Build consensus and learn

### AI/Bot Reviewers
- **Approach**: Systematic, evidence-based, pattern-focused
- **Priority**: Validate patterns against context
- **Response**: Precise, educational for the system
- **Goal**: Improve accuracy and reduce noise

## Remember

The goal is not to simply address comments mechanically, but to understand each piece of feedback within its proper context—recognizing that human wisdom and AI analysis emerge from different interpretive frameworks. The hermeneutic circle helps us move between the specific feedback and its broader context to craft responses that truly advance the PR toward successful merge.

---

*This skill applies Heidegger's hermeneutic circle to PR review responses, recognizing the fundamental difference between human expertise and artificial pattern recognition.*