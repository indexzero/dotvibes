# PR Review - Internal Prompt Templates

These prompts guide Claude's application of the hermeneutic circle when understanding and responding to PR reviews.

## Initial PR Context Gathering

Before analyzing any reviews, establish the whole:

```
PR CONTEXT UNDERSTANDING (The Whole):

1. PR PURPOSE & SCOPE:
   - Primary objective: [What problem does this solve?]
   - Scope boundaries: [What's in/out of scope?]
   - Breaking changes: [Any compatibility impacts?]
   - Trade-offs made: [What was prioritized?]

2. CHANGE ANALYSIS:
   - Files modified: [Count and primary areas]
   - Architectural impact: [Systemic changes?]
   - Risk assessment: [What could break?]
   - Test coverage: [What's tested/not tested?]

3. TEAM DYNAMICS:
   - Team culture: [Formal/informal, collaborative/hierarchical]
   - Review standards: [Strict/flexible, focus areas]
   - Decision patterns: [Consensus/maintainer-led]
   - Communication style: [Direct/diplomatic]

4. REVIEWER LANDSCAPE:
   - Human reviewers: [Names, roles, expertise areas]
   - Bot reviewers: [Which bots, what they check]
   - Review history: [Past interactions, patterns]
   - Power dynamics: [Whose approval matters most]

This understanding frames how I interpret each review comment.
```

## Reviewer Identification Template

For each reviewer, determine their nature:

```
REVIEWER ANALYSIS:

Username: [reviewer_username]

IDENTIFICATION:
□ Human indicators:
  - Irregular comment timing
  - Natural language variations
  - Context-aware observations
  - Emotional expressions
  - Personal pronouns usage

□ Bot indicators:
  - [bot] in username
  - Systematic comment patterns
  - Instant response time
  - Template-like language
  - Pattern-based observations

CLASSIFICATION: [HUMAN|BOT|UNCERTAIN]

If HUMAN:
  - Role: [Maintainer|Contributor|External]
  - Expertise: [Inferred from comments]
  - Review style: [Thorough|Quick|Focused]
  - Historical relationship: [First time|Regular|Senior]

If BOT:
  - Type: [Security|Style|Coverage|Dependency|AI Assistant]
  - Ruleset: [What it checks for]
  - Reliability: [Known false positive patterns]
  - Configuration: [Can we adjust its rules?]
```

## Human Comment Analysis Template

Apply hermeneutic understanding to human feedback:

```
HUMAN COMMENT HERMENEUTIC ANALYSIS:

Comment: "[Full comment text]"
Reviewer: [Name] ([Role])

PART → WHOLE → PART MOVEMENT:

1. SURFACE READING (The Part):
   - Literal request: [What are they asking?]
   - Comment type: [Question|Suggestion|Request|Blocker]
   - Tone: [Friendly|Neutral|Concerned|Frustrated]
   - Specificity: [Vague|Clear|Detailed]

2. CONTEXTUAL EXPANSION (Part to Whole):
   - Reviewer's expertise lens: [What background informs this?]
   - Team patterns referenced: [Implicit standards mentioned?]
   - Historical context: [Related to past discussions?]
   - Broader concerns: [Architectural/maintenance worries?]

3. EMOTIONAL/SOCIAL READING (The Human Whole):
   - Emotional undertone: [What feelings are present?]
   - Relationship dynamics: [Senior teaching? Peer discussing?]
   - Face-saving needs: [Should I acknowledge their expertise?]
   - Unspoken expectations: [What do they really want?]

4. SYNTHESIS (Whole back to Part):
   Given all context, this comment is really about:
   - Core concern: [The actual issue]
   - Hidden request: [What they're not saying directly]
   - Relationship need: [Recognition/learning/collaboration]

RESPONSE STRATEGY:
- Address: [Surface request + underlying concern]
- Tone: [Match their formality level]
- Acknowledgment: [What expertise/insight to recognize]
- Action: [Fix|Discuss|Clarify|Defer]
```

## AI/Bot Comment Analysis Template

Apply systematic understanding to bot feedback:

```
BOT COMMENT ANALYSIS:

Comment: "[Full comment text]"
Bot: [Name] ([Type])

SYSTEMATIC EVALUATION:

1. PATTERN IDENTIFICATION:
   - Triggered rule: [What pattern was detected?]
   - Rule category: [Security|Style|Performance|Quality]
   - Severity: [Error|Warning|Info]
   - Automated fix available: [Yes|No]

2. CONTEXTUAL VALIDATION:
   - Pattern correctly identified? [Yes|No|Partial]
   - Context bot is missing:
     * Project conventions: [What it doesn't know]
     * Mitigation elsewhere: [Compensating controls]
     * Intentional deviation: [Why we do this differently]
   - False positive indicators:
     * [List specific reasons]

3. SYSTEMIC IMPLICATIONS:
   - Pattern elsewhere: [Does this exist in other files?]
   - Rule adjustment needed: [Should we configure the bot?]
   - Team learning: [Should we document this pattern?]
   - Technical debt: [Does this reveal a broader issue?]

4. VALUE ASSESSMENT:
   - True positive value: [What risk does this prevent?]
   - False positive cost: [Time wasted if wrong]
   - Fix complexity: [Trivial|Simple|Complex|Risky]
   - Worth addressing: [Yes|No|Partially]

RESPONSE STRATEGY:
- If valid: Fix systematically
- If invalid: Dismiss with evidence
- If partial: Fix what's valid, explain remainder
- If pattern: Address everywhere or document exception
```

## Response Crafting Template

### For Human Reviewers

```
HUMAN RESPONSE COMPOSITION:

ELEMENTS TO INCLUDE:
1. Acknowledgment: [Recognize their insight/expertise]
2. Understanding: [Show you grasp their concern]
3. Context: [Provide info they might not have]
4. Action: [What you'll do or why you won't]
5. Collaboration: [Invite further discussion if needed]

TONE CALIBRATION:
- Match formality: [Formal|Casual|Technical]
- Emotional response: [Enthusiasm|Appreciation|Concern]
- Status dynamics: [Peer|Senior|Junior appropriate]

EXAMPLE STRUCTURES:

For Agreement:
"[Acknowledgment] You're absolutely right about [specific insight].
[Action] I've [change made] which [benefit].
[Forward-looking] This also helps with [future benefit]."

For Disagreement:
"[Appreciation] I see your point about [concern].
[Context] In this case, [explaining factors] led me to [approach].
[Opening] Would [alternative] address your concern while [maintaining requirement]?"

For Clarification:
"[Recognition] That's an interesting observation about [topic].
[Seeking understanding] To make sure I address this properly,
[Specific question] could you elaborate on [aspect]?
[Intent] I want to ensure [goal alignment]."
```

### For Bot Reviewers

```
BOT RESPONSE COMPOSITION:

RESPONSE TYPES:

1. TRUE POSITIVE ACKNOWLEDGMENT:
"Fixed: [Precise description]
[If pattern] Applied fix to all [N] occurrences.
Verification: [How tested/validated]"

2. FALSE POSITIVE DISMISSAL:
"False positive: [Category - context/mitigation/intentional]
Reason: [Specific technical explanation]
Evidence: [File:line references or documentation]
[Optional] Suggested rule update: [Config change]"

3. PARTIAL ACCEPTANCE:
"Partially applicable:
✓ Fixed: [What was valid and fixed]
✗ Not applicable: [What doesn't apply and why]
Context: [Missing information that explains the difference]"

4. PATTERN EDUCATION:
"This pattern is intentional in our codebase:
- Rationale: [Why we do this]
- Documentation: [Where it's documented]
- Configuration: [How to update bot rules]"
```

## Comment Thread Management

For managing ongoing discussions:

```
THREAD EVOLUTION TRACKING:

Thread ID: [Comment thread identifier]
Participants: [List of all participants]
Current State: [Open|Resolved|Blocked|Discussing]

HERMENEUTIC PROGRESSION:
1. Initial comment: [Summary and interpretation]
2. Response: [What was said, what was meant]
3. Follow-up: [How understanding evolved]
4. Resolution path: [Converging or diverging?]

INTERVENTION NEEDED WHEN:
- Misunderstanding persists after 2 exchanges
- Emotional escalation detected
- Scope creep occurring
- Different participants have conflicting views

RESOLUTION STRATEGIES:
- Summarize mutual understanding
- Propose specific next steps
- Escalate to synchronous discussion
- Document decision for future reference
```

## Batch Response Strategy

When handling multiple comments:

```
MULTI-COMMENT RESPONSE PLAN:

CATEGORIZATION:
Human Comments: [Count]
- Blocking: [List]
- Suggestions: [List]
- Questions: [List]

Bot Comments: [Count]
- Valid patterns: [List]
- False positives: [List]
- Needs investigation: [List]

PRIORITY ORDER:
1. Human blockers (relationship + technical critical)
2. Bot security issues (if valid)
3. Human questions (maintain engagement)
4. Human suggestions (show receptiveness)
5. Bot style/quality issues
6. Bot false positives (batch dismiss)

RESPONSE BATCHING:
- Group related comments for single fix
- Address all comments from same reviewer together
- Fix all instances of same pattern once
- Post responses in logical order

COMMUNICATION STRATEGY:
- Start with appreciation for thorough review
- Address blockers first with clear solutions
- Group minor fixes in single "addressed in [commit]"
- End with invitation for further discussion
```

## Review Completion Check

Before finalizing responses:

```
PRE-POST VERIFICATION:

HUMAN REVIEWER CHECKLIST:
□ All concerns addressed (surface + underlying)
□ Appropriate recognition given
□ Tone matches team culture
□ No defensive language
□ Clear next steps stated

BOT REVIEWER CHECKLIST:
□ All valid issues fixed
□ False positives clearly explained
□ Patterns addressed systematically
□ Configuration updates noted
□ Evidence provided for dismissals

RELATIONSHIP CHECKLIST:
□ Maintained reviewer respect
□ Strengthened team dynamics
□ Learned from feedback
□ Improved codebase
□ Advanced PR toward merge

FINAL REVIEW:
- Would I want to receive these responses?
- Do they advance understanding?
- Will they reduce back-and-forth?
- Have I been truthful and helpful?
```

---

These templates ensure Claude applies the hermeneutic circle to understand PR reviews deeply, recognizing the fundamental interpretive differences between human expertise and artificial analysis.