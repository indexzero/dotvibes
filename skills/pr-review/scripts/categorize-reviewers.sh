#!/bin/bash
# Reviewer Categorizer - Differentiates Human from AI/Bot Reviewers
# Applies hermeneutic understanding to identify reviewer types and contexts

set -e

# Get PR number (from argument or current)
PR="${1:-$(gh pr view --json number -q .number)}"

# Input file from fetch-pr-reviews.sh
INPUT_FILE="/tmp/pr-${PR}-reviews.json"

if [ ! -f "$INPUT_FILE" ]; then
  echo "❌ Error: Run fetch-pr-reviews.sh first to gather review data"
  exit 1
fi

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
echo "┃                 REVIEWER CATEGORIZATION - PR #$PR                           ┃"
echo "┃         Applying Hermeneutic Understanding to Reviewer Types                ┃"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
echo

# Known bot patterns
BOT_PATTERNS='(\[bot\]$|^bot-|^github-actions|copilot|dependabot|semantic-release|codecov|coveralls|snyk|renovate|imgbot|allcontributors|greenkeeper|pyup|mergify|stale|auto-|lgtm|sonarcloud|codacy|codefactor|deepsource|codeclimate|hound|sider|pronto|danger|peril)'

# Known AI assistant patterns
AI_PATTERNS='(copilot|claude|chatgpt|bard|gemini|anthropic|openai|ai-reviewer|ai-assistant|ml-bot)'

# Extract and categorize all unique reviewers
echo "🔍 ANALYZING REVIEWER PATTERNS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create categorization
CATEGORIZED=$(cat "$INPUT_FILE" | jq -r --arg bot_patterns "$BOT_PATTERNS" --arg ai_patterns "$AI_PATTERNS" '
def categorize_reviewer(user):
  {
    username: user.login,
    type: user.type,
    created_at: user.created_at,
    bio: user.bio,
    company: user.company,
    is_bot_by_name: (user.login | test($bot_patterns; "i")),
    is_bot_by_type: (user.type == "Bot"),
    is_ai_assistant: (user.login | test($ai_patterns; "i")),
    avatar: user.avatar_url,
    profile: user.html_url
  };

# Collect all reviewers
[
  (.reviews[].user),
  (.review_comments[].user),
  (.issue_comments[].user)
] |
unique_by(.login) |
map(categorize_reviewer(.)) |
sort_by(.username)')

# Display categorization
echo "$CATEGORIZED" | jq -r '.[] |
  (if .is_bot_by_name or .is_bot_by_type then
    if .is_ai_assistant then "🤖🧠" else "🤖 " end
  else "👤 " end) +
  .username + " (" + .type + ")" +
  (if .is_bot_by_name or .is_bot_by_type then
    " - " + (if .is_ai_assistant then "AI Assistant" else "Bot/Automation" end)
  else
    " - Human" + (if .company then " from " + .company else "" end)
  end)'

echo

# Analyze comment patterns
echo "📊 BEHAVIORAL ANALYSIS"
echo "━━━━━━━━━━━━━━━━━━━━━"

# Analyze comment patterns for each reviewer
cat "$INPUT_FILE" | jq -r --arg bot_patterns "$BOT_PATTERNS" '
def analyze_behavior(comments):
  {
    total_comments: (comments | length),
    avg_length: (comments | map(.body | length) | add / length),
    response_times: (comments | map(.created_at) | sort),
    uses_templates: (comments | map(.body) | group_by(.) | map(length) | max > 1),
    has_code_blocks: (comments | map(.body | test("```")) | any),
    has_questions: (comments | map(.body | test("\\?")) | any),
    has_emotions: (comments | map(.body | test("😀|😃|😄|😁|😅|😂|🤣|😊|😇|🙂|😉|😌|😍|🥰|😘|😗|😙|😚|😋|😛|😜|🤪|😝|🤗|🤔|🤨|😐|😑|😶|🙄|😏|😣|😥|😮|🤐|😯|😪|😫|😴|😌|😛|😜|😝|👍|👎|❤️|💔|🎉|🔥|⚠️|❌|✅|⭐|🚀|💡|🐛|📝|🔧|♻️|⬆️|⬇️|🎯|💯|🙏|👏|💪")) | any),
    has_personal_pronouns: (comments | map(.body | test("\\b(I|me|my|mine|we|our|you|your)\\b"; "i")) | any)
  };

# Group comments by reviewer
.review_comments |
group_by(.user.login) |
map({
  reviewer: .[0].user.login,
  is_bot: (.[0].user.login | test($bot_patterns; "i")),
  behavior: analyze_behavior(.)
}) |
.[] |
.reviewer + ":" +
"\n  Comments: " + (.behavior.total_comments | tostring) +
"\n  Avg length: " + ((.behavior.avg_length // 0) | floor | tostring) + " chars" +
"\n  Has templates: " + (.behavior.uses_templates | tostring) +
"\n  Has code: " + (.behavior.has_code_blocks | tostring) +
"\n  Has questions: " + (.behavior.has_questions | tostring) +
"\n  Has emotions: " + (.behavior.has_emotions | tostring) +
"\n  Personal pronouns: " + (.behavior.has_personal_pronouns | tostring) +
"\n  " + (if .is_bot then "→ Likely BOT"
         elif .behavior.has_emotions and .behavior.has_personal_pronouns then "→ Likely HUMAN"
         elif .behavior.uses_templates and (not .behavior.has_emotions) then "→ Likely BOT"
         else "→ Uncertain" end) +
"\n"'

echo

# Generate response strategy
echo "🎯 RESPONSE STRATEGY RECOMMENDATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count by category
HUMANS=$(echo "$CATEGORIZED" | jq '[.[] | select(.is_bot_by_name == false and .is_bot_by_type == false)] | length')
BOTS=$(echo "$CATEGORIZED" | jq '[.[] | select(.is_bot_by_name or .is_bot_by_type) | select(.is_ai_assistant | not)] | length')
AI_ASSISTANTS=$(echo "$CATEGORIZED" | jq '[.[] | select(.is_ai_assistant)] | length')

echo "Reviewer Distribution:"
echo "  👤 Human Reviewers: $HUMANS"
echo "  🤖 Traditional Bots: $BOTS"
echo "  🧠 AI Assistants: $AI_ASSISTANTS"
echo

echo "Recommended Approach:"
if [ "$HUMANS" -gt 0 ]; then
  echo "  1. PRIORITIZE human feedback (relationship + expertise)"
  echo "     - Address concerns empathetically"
  echo "     - Acknowledge domain knowledge"
  echo "     - Engage in discussion where needed"
fi

if [ "$AI_ASSISTANTS" -gt 0 ]; then
  echo "  2. VALIDATE AI assistant suggestions"
  echo "     - Check for context awareness"
  echo "     - Verify pattern applicability"
  echo "     - Provide missing project context"
fi

if [ "$BOTS" -gt 0 ]; then
  echo "  3. SYSTEMATICALLY address bot patterns"
  echo "     - Batch similar issues"
  echo "     - Document false positives"
  echo "     - Update configurations if needed"
fi

echo

# Generate hermeneutic summary
echo "📚 HERMENEUTIC CONTEXT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat "$INPUT_FILE" | jq -r '
{
  pr_context: {
    title: .pr.title,
    author: .pr.author.login,
    scope: "+" + (.pr.additions | tostring) + "/-" + (.pr.deletions | tostring),
    file_count: (.pr.files | length)
  },
  review_landscape: {
    total_reviewers: ([.reviews[].user.login, .review_comments[].user.login] | unique | length),
    total_comments: ((.review_comments | length) + (.issue_comments | length)),
    approval_status: (.reviews | map(select(.state == "APPROVED")) | length),
    changes_requested: (.reviews | map(select(.state == "CHANGES_REQUESTED")) | length)
  }
} |
"PR WHOLE (Context for Understanding Parts):" +
"\n  Title: " + .pr_context.title +
"\n  Author: " + .pr_context.author +
"\n  Scope: " + .pr_context.scope + " across " + (.pr_context.file_count | tostring) + " files" +
"\n\nREVIEW WHOLE (Social/Technical Context):" +
"\n  Reviewers: " + (.review_landscape.total_reviewers | tostring) +
"\n  Comments: " + (.review_landscape.total_comments | tostring) +
"\n  Approvals: " + (.review_landscape.approval_status | tostring) +
"\n  Changes requested: " + (.review_landscape.changes_requested | tostring) +
"\n\nHERMENEUTIC INSIGHT:" +
"\n  This PR exists within a " +
(if .review_landscape.total_reviewers > 3 then "collaborative" else "focused" end) +
" review culture with " +
(if .review_landscape.total_comments > 20 then "thorough" else "moderate" end) +
" scrutiny."'

echo

# Export categorization
OUTPUT_FILE="/tmp/pr-${PR}-categorized.json"
echo "$CATEGORIZED" > "$OUTPUT_FILE"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 Categorization saved to: $OUTPUT_FILE"
echo "✅ Ready for differentiated response generation"
echo
echo "Use the skill to generate appropriate responses:"
echo "  - Empathetic, contextual responses for humans"
echo "  - Evidence-based validation for bots"
echo "  - Context-aware evaluation for AI assistants"