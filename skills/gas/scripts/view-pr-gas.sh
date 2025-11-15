#!/bin/bash
# GitHub Security Review Threads Inspector
# Simple, beautiful, pragmatic - as Ashley Willis would design it

set -e

# Get PR number (from argument or current)
PR="${1:-$(gh pr view --json number -q .number)}"

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
echo "┃                    SECURITY REVIEW THREADS - PR #$PR                        ┃"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
echo

# Get all review comments from github-advanced-security bot
COMMENTS=$(gh api "repos/{owner}/{repo}/pulls/$PR/comments" --paginate | \
  jq -r '.[] | select(.user.login == "github-advanced-security[bot]") | @json')

# Count threads
THREAD_COUNT=$(echo "$COMMENTS" | wc -l | tr -d ' ')

if [ "$THREAD_COUNT" -eq 0 ]; then
  echo "✅ No security issues found in this PR!"
  exit 0
fi

echo "📊 Found $THREAD_COUNT security threads (all have Reply boxes)"
echo

# Process each comment
COUNT=1
echo "$COMMENTS" | while IFS= read -r comment_json; do
  # Parse comment fields
  COMMENT=$(echo "$comment_json" | jq -r '.')
  FILE=$(echo "$COMMENT" | jq -r '.path')
  LINE=$(echo "$COMMENT" | jq -r '.line')
  URL=$(echo "$COMMENT" | jq -r '.html_url')
  COMMIT=$(echo "$COMMENT" | jq -r '.commit_id')
  COMMENT_ID=$(echo "$COMMENT" | jq -r '.id')
  BODY=$(echo "$COMMENT" | jq -r '.body')

  # Extract issue title and alert number
  ISSUE_TITLE=$(echo "$BODY" | head -1 | sed 's/^## //')
  ALERT_NUM=$(echo "$BODY" | grep -o 'code-scanning/[0-9]*' | grep -o '[0-9]*' || echo "N/A")

  # Thread header
  echo "┌─────────────────────────────────────────────────────────────────────────────┐"
  echo "│ Thread $COUNT/$THREAD_COUNT: $FILE:$LINE"
  echo "└─────────────────────────────────────────────────────────────────────────────┘"
  echo
  echo "  🚨 $ISSUE_TITLE"
  echo "  📍 Location: $FILE:$LINE"
  echo "  🔗 View: $URL"
  echo

  # Show the problematic code with context
  echo "  📝 Code:"
  echo "  ────────"

  # Fetch the file at the specific commit and show context
  FILE_CONTENT=$(gh api "repos/{owner}/{repo}/contents/$FILE?ref=$COMMIT" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null || echo "")

  if [ -n "$FILE_CONTENT" ]; then
    # Calculate line range (5 before, 5 after)
    START=$((LINE > 5 ? LINE - 5 : 1))
    END=$((LINE + 5))

    # Extract and display lines with highlighting
    echo "$FILE_CONTENT" | sed -n "${START},${END}p" | while IFS= read -r code_line; do
      CURRENT_LINE=$((START++))
      if [ "$CURRENT_LINE" -eq "$LINE" ]; then
        # Highlight the problematic line
        printf "  %4d │ ▶ %s ◀\n" "$CURRENT_LINE" "$code_line"
      else
        printf "  %4d │   %s\n" "$CURRENT_LINE" "$code_line"
      fi
    done
  else
    echo "  (Unable to fetch code - file may have been moved or deleted)"
  fi
  echo

  # Extract fix suggestion based on issue type
  echo "  💡 Quick Fix:"
  echo "  ────────────"
  if echo "$ISSUE_TITLE" | grep -q "Incomplete string escaping"; then
    echo "  Change: .replace('*', '.*')"
    echo "  To:     .replace(/\\*/g, '.*')  // Global replacement"
    if echo "$ISSUE_TITLE" | grep -q "/%40/"; then
      echo "  Or:     .replace(/%40/g, '@')  // For URL encoding"
    fi
  elif echo "$ISSUE_TITLE" | grep -q "Insecure temporary file"; then
    cat << '  FIX'
  import { mkdtempSync } from 'fs';
  import { tmpdir } from 'os';
  import { join } from 'path';

  const tempDir = mkdtempSync(join(tmpdir(), 'alf3-'));
  FIX
  elif echo "$ISSUE_TITLE" | grep -q "race condition"; then
    cat << '  FIX'
  // Use atomic write with exclusive flag
  await fs.writeFile(path, data, { flag: 'wx' });
  FIX
  elif echo "$ISSUE_TITLE" | grep -q "Network data"; then
    cat << '  FIX'
  // Validate before writing
  function isValidPackageData(data) {
    return data &&
           typeof data.name === 'string' &&
           !data.name.includes('../');
  }
  if (!isValidPackageData(response)) {
    throw new Error('Invalid package data');
  }
  FIX
  fi
  echo

  # Reply command
  echo "  💬 To reply to this thread:"
  echo "     gh pr comment $PR --reply-to $COMMENT_ID --body \"Your message\""
  echo
  echo "─────────────────────────────────────────────────────────────────────────────"
  echo

  COUNT=$((COUNT + 1))
done

# Footer with useful commands
echo "┌─────────────────────────────────────────────────────────────────────────────┐"
echo "│                              QUICK ACTIONS                                  │"
echo "└─────────────────────────────────────────────────────────────────────────────┘"
echo
echo "  # Reply to all threads at once (mark as acknowledged):"
echo "  for id in \$(gh api repos/{owner}/{repo}/pulls/$PR/comments --jq '.[] | select(.user.login == \"github-advanced-security[bot]\") | .id'); do"
echo "    gh pr comment $PR --reply-to \$id --body \"Acknowledged - will address in follow-up\""
echo "  done"
echo
echo "  # Fix all string escaping issues at once:"
echo "  find run/alf3 -name '*.js' -exec sed -i \"\" \"s/\\.replace('\\*', '\\.*')/\\.replace(\\/\\\\\\*\\/g, '.*')/g\" {} +"
echo
echo "  # Open PR in browser to see threads:"
echo "  gh pr view $PR --web"
echo
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"