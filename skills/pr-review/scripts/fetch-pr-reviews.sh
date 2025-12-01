#!/bin/bash
# PR Review Fetcher - Hermeneutic Context Gatherer
# Fetches all review comments and metadata for understanding the whole

set -e

# Get PR number (from argument or current)
PR="${1:-$(gh pr view --json number -q .number)}"

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
echo "┃                    PR REVIEW CONTEXT - PR #$PR                              ┃"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
echo

# Get PR metadata for context
echo "📋 PR CONTEXT (The Whole)"
echo "━━━━━━━━━━━━━━━━━━━━━━━"
PR_DATA=$(gh pr view "$PR" --json title,body,author,createdAt,additions,deletions,files,labels)
echo "$PR_DATA" | jq -r '"Title: " + .title'
echo "$PR_DATA" | jq -r '"Author: @" + .author.login + " (Created: " + .createdAt + ")"'
echo "$PR_DATA" | jq -r '"Changes: +" + (.additions|tostring) + " -" + (.deletions|tostring) + " across " + (.files|length|tostring) + " files"'
echo "$PR_DATA" | jq -r '"Labels: " + (.labels | map(.name) | join(", "))'
echo
echo "Description:"
echo "$PR_DATA" | jq -r '.body' | head -20
echo

# Get review summary
echo "👥 REVIEWERS (Understanding the Participants)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Fetch all reviews
REVIEWS=$(gh api "repos/{owner}/{repo}/pulls/$PR/reviews" --paginate)

# Count by type
echo "$REVIEWS" | jq -r 'group_by(.user.login) | .[] | {
  reviewer: .[0].user.login,
  type: .[0].user.type,
  is_bot: (.[0].user.login | test("\\[bot\\]$|^bot-|copilot|dependabot|semantic-release";"i")),
  states: [.[] | .state]
} |
if .is_bot then "🤖" else "👤" end + " @" + .reviewer +
" (" + .type + "): " + (.states | join(", "))'

echo

# Get review comments
echo "💬 REVIEW COMMENTS (The Parts to Understand)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

COMMENTS=$(gh api "repos/{owner}/{repo}/pulls/$PR/comments" --paginate)
ISSUE_COMMENTS=$(gh api "repos/{owner}/{repo}/issues/$PR/comments" --paginate)

# Process review comments
REVIEW_COUNT=$(echo "$COMMENTS" | jq 'length')
ISSUE_COUNT=$(echo "$ISSUE_COMMENTS" | jq 'length')

echo "Found: $REVIEW_COUNT code review comments, $ISSUE_COUNT general comments"
echo

# Group comments by reviewer
echo "📊 COMMENT DISTRIBUTION"
echo "─────────────────────"

# Create combined comment analysis
echo "$COMMENTS" | jq -r '
group_by(.user.login) |
map({
  reviewer: .[0].user.login,
  is_bot: (.[0].user.login | test("\\[bot\\]$|bot-|copilot|dependabot";"i")),
  count: length,
  files: [.[] | .path] | unique | length,
  latest: (.[0].created_at)
}) |
.[] |
(if .is_bot then "🤖" else "👤" end) + " @" + .reviewer +
": " + (.count|tostring) + " comments on " + (.files|tostring) + " files"'

echo

# Show recent comment threads
echo "💭 ACTIVE THREADS (Conversations in Progress)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get comment threads with replies
echo "$COMMENTS" | jq -r '
sort_by(.created_at) | reverse |
.[:10] |
.[] |
"┌─ @" + .user.login + " (" + (.created_at | split("T")[0]) + ")" +
(if (.user.login | test("\\[bot\\]")) then " 🤖" else " 👤" end) + "\n" +
"├─ File: " + .path + ":" + (.line // .original_line // 0 | tostring) + "\n" +
"├─ Status: " + (if .in_reply_to_id then "Reply to #" + (.in_reply_to_id|tostring) else "New thread" end) + "\n" +
"└─ Comment: " + (.body | split("\n")[0] | .[0:100]) +
(if (.body | length) > 100 then "..." else "" end) + "\n"'

# Categorize pending actions
echo "📌 PENDING ACTIONS (What Needs Response)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find unresolved threads (comments without replies from author)
echo "Extracting threads requiring response..."

# Get PR author
PR_AUTHOR=$(echo "$PR_DATA" | jq -r '.author.login')

# Find comments that might need responses
NEEDS_RESPONSE=$(echo "$COMMENTS" | jq -r --arg author "$PR_AUTHOR" '
map(select(.user.login != $author)) |
group_by(.id) |
map({
  id: .[0].id,
  reviewer: .[0].user.login,
  is_bot: (.[0].user.login | test("\\[bot\\]")),
  file: .[0].path,
  line: (.[0].line // .[0].original_line // 0),
  created: .[0].created_at,
  body_preview: (.[0].body | split("\n")[0] | .[0:80])
}) |
.[:10] |
.[] |
(if .is_bot then "🤖" else "👤" end) + " @" + .reviewer +
" in " + .file + ":" + (.line|tostring) +
"\n  \"" + .body_preview + "...\""')

if [ -n "$NEEDS_RESPONSE" ]; then
  echo "$NEEDS_RESPONSE"
else
  echo "No pending comments requiring response"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Export data for further processing
EXPORT_FILE="/tmp/pr-${PR}-reviews.json"
echo "💾 Exporting complete review data to: $EXPORT_FILE"

# Create comprehensive export
jq -n \
  --argjson pr_data "$PR_DATA" \
  --argjson reviews "$REVIEWS" \
  --argjson comments "$COMMENTS" \
  --argjson issue_comments "$ISSUE_COMMENTS" \
  --arg pr_number "$PR" \
  --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  '{
    pr_number: $pr_number,
    fetched_at: $timestamp,
    pr: $pr_data,
    reviews: $reviews,
    review_comments: $comments,
    issue_comments: $issue_comments
  }' > "$EXPORT_FILE"

echo "✅ Review context gathered. Use $EXPORT_FILE for detailed analysis."
echo
echo "Next: Run categorize-reviewers.sh to apply hermeneutic analysis"