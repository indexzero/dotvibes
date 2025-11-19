# PR Review Response Skill

A Claude Code skill that applies Heidegger's hermeneutic circle to understand and respond to PR reviews, with intelligent differentiation between human expertise and AI/bot pattern recognition.

## Overview

This skill enables Claude to:
- 🔍 Identify reviewer types (human vs bot vs AI assistant)
- 🧠 Apply different interpretive frameworks for each reviewer type
- 💬 Craft contextually appropriate responses
- 🤝 Build relationships with human reviewers
- 🤖 Efficiently handle bot feedback
- 📊 Manage review threads holistically

## Key Innovation: Reviewer Differentiation

The skill recognizes that feedback from humans and AI/bots emerges from fundamentally different interpretive frameworks:

### Human Reviewers
- **Understanding**: Read between lines, grasp implicit context
- **Response**: Empathetic, acknowledging expertise and experience
- **Goal**: Build consensus, learn, strengthen relationships

### AI/Bot Reviewers
- **Understanding**: Validate patterns against project context
- **Response**: Evidence-based, systematic, educational
- **Goal**: Fix real issues, dismiss false positives, improve accuracy

## Installation

### Option 1: Project-Specific
```bash
mkdir -p .claude/skills
cp -r /path/to/dotvibes/skills/pr-review .claude/skills/
chmod +x .claude/skills/pr-review/scripts/*.sh
```

### Option 2: Global
```bash
mkdir -p ~/.claude/skills
cp -r /path/to/dotvibes/skills/pr-review ~/.claude/skills/
chmod +x ~/.claude/skills/pr-review/scripts/*.sh
```

## Quick Start

```bash
# In your project with an open PR
claude-code

# Analyze and respond to all reviews
/respond-review 789

# Focus on human reviewers only
/respond-review 789 --humans-only

# Preview responses without posting
/respond-review 789 --dry-run
```

## How It Works

### 1. Context Gathering
The skill first understands the "whole" - the PR's purpose, scope, and review landscape:
```bash
./scripts/fetch-pr-reviews.sh 789
```

### 2. Reviewer Categorization
Identifies each reviewer's nature using behavioral analysis:
```bash
./scripts/categorize-reviewers.sh 789
```

### 3. Hermeneutic Analysis
Applies different interpretive frameworks:
- **Humans**: Surface → Context → Emotional → Synthesis
- **Bots**: Pattern → Validation → Systemic → Value

### 4. Response Generation
Creates appropriate responses based on reviewer type and comment nature

### 5. Relationship Management
Maintains positive dynamics with humans while educating bots

## File Structure

```
skills/pr-review/
├── SKILL.md         # Main skill definition
├── PROMPTS.md       # Internal reasoning templates
├── README.md        # This file
└── scripts/
    ├── fetch-pr-reviews.sh      # Gather review data
    └── categorize-reviewers.sh  # Identify reviewer types
```

## Usage Examples

### Basic Commands
```bash
# Respond to all reviews
/respond-review

# Specific PR
/respond-review 456

# Human reviewers only
/respond-review 456 --humans-only

# Bot reviewers only
/respond-review 456 --bots-only

# Dry run (preview)
/respond-review 456 --dry-run
```

### Advanced Options
```bash
# Focus on blocking comments
/respond-review 456 --blocking-only

# Generate summary report
/respond-review 456 --summary

# Batch respond to similar issues
/respond-review 456 --batch-similar
```

## Behavioral Analysis

The skill analyzes reviewer behavior to determine type:

| Indicator | Human | Bot | AI Assistant |
|-----------|-------|-----|--------------|
| Irregular timing | ✅ | ❌ | ⚠️ |
| Personal pronouns | ✅ | ❌ | ⚠️ |
| Emotions/emojis | ✅ | ❌ | ❌ |
| Template language | ❌ | ✅ | ⚠️ |
| Instant response | ❌ | ✅ | ✅ |
| Context awareness | ✅ | ❌ | ⚠️ |
| Domain expertise | ✅ | ❌ | ⚠️ |

## Response Templates

### For Humans
```markdown
Thank you for this insight, @reviewer! You're absolutely right about [specific point].
I've [action taken] which [benefit achieved].
Does this address your concern about [underlying issue]?
```

### For Bots
```markdown
Fixed: [Precise description]
Validation: [How verified]
Pattern addressed in [N] locations
```

### For AI Assistants
```markdown
Valid suggestion partially applied:
✅ Fixed: [What was correct]
ℹ️ Context: [What the AI missed]
This aligns with our project patterns documented in [location]
```

## Hermeneutic Principles

The skill applies Heidegger's hermeneutic circle:

1. **Parts ↔ Whole**: Each comment understood within PR context
2. **Reviewer Context**: Human expertise vs AI patterns
3. **Emergent Understanding**: Meaning arises from the interplay
4. **Appropriate Response**: Tailored to reviewer's framework

## Configuration

### Environment Variables
```bash
GITHUB_TOKEN              # Required for API access
PR_RESPONSE_STYLE        # formal|casual|technical
HUMAN_PRIORITY           # true|false (default: true)
AUTO_FIX_BOT_ISSUES     # true|false (default: true)
BATCH_BOT_RESPONSES     # true|false (default: true)
```

### Project Configuration
Create `.claude/pr-review.config.json`:
```json
{
  "team_style": "collaborative",
  "bot_patterns": ["custom-bot", "internal-checker"],
  "trusted_humans": ["lead-dev", "architect"],
  "auto_approve_bots": ["dependabot"],
  "response_templates": {
    "human_agreement": "Custom template...",
    "bot_dismissal": "Custom template..."
  }
}
```

## Best Practices

### With Human Reviewers
1. **Always acknowledge** their expertise
2. **Address underlying concerns**, not just surface issues
3. **Invite dialogue** when disagreeing
4. **Build relationships** through respectful interaction
5. **Learn from patterns** in their feedback

### With Bot Reviewers
1. **Validate patterns** against context
2. **Batch similar issues** for efficiency
3. **Document false positives** clearly
4. **Update configurations** to reduce noise
5. **Fix systematically** across codebase

### With AI Assistants
1. **Verify context awareness**
2. **Provide missing information**
3. **Validate suggestions** against project patterns
4. **Educate through responses**
5. **Leverage valid insights**

## Troubleshooting

### "Cannot categorize reviewer"
- Check scripts have execution permissions
- Verify GitHub token has appropriate access
- Review may be from an unusual bot pattern

### "Response not appropriate"
- Check `.claude/pr-review.config.json` for overrides
- Verify reviewer categorization is correct
- May need manual classification for edge cases

### "Comments not fetched"
- Ensure PR exists and is accessible
- Check GitHub API rate limits
- Verify network connectivity

## Performance

- Fetching reviews: ~2-5 seconds
- Categorization: ~1-2 seconds
- Response generation: ~5-10 seconds per comment
- Posting responses: ~1 second each

## Integration

### CI/CD Pipeline
```yaml
name: Auto-respond to PR Reviews
on:
  pull_request_review:
    types: [submitted]
  pull_request_review_comment:
    types: [created]

jobs:
  respond:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run PR Review Skill
        run: |
          claude-code skill:pr-review ${{ github.event.pull_request.number }}
```

### Git Hooks
```bash
# .git/hooks/post-review
claude-code skill:pr-review --check-new
```

## Version History

- **1.0.0**: Initial release with human/bot differentiation
  - Hermeneutic analysis framework
  - Behavioral categorization
  - Differentiated response templates

## Philosophy

This skill embodies the understanding that PR reviews are not just technical checks but human communications (when from humans) or pattern validations (when from bots). By applying the hermeneutic circle, Claude can understand each comment within its proper context and respond appropriately.

The goal is not mechanical response generation but genuine understanding—recognizing that human wisdom and artificial analysis require fundamentally different interpretive approaches.

## Support

- Report issues in the repository
- Contribute reviewer patterns for better categorization
- Share response templates that work well with your team

---

Built with the understanding that code review is as much about relationships as it is about code quality.