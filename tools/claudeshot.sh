#!/usr/bin/env bash
#
# claudeshot.sh - Archive Claude Code directories
#
# Creates timestamped archives of:
#   ~/.claude          → YYYY.MM.DD.dotclaude.tgz
#   /private/tmp/claude → YYYY.MM.DD.tmpclaude.tgz
#

set -euo pipefail

DATE=$(date +%Y.%m.%d)
OUTDIR="${CLAUDESHOT_OUTDIR:-$(pwd)}"

mkdir -p "$OUTDIR"

# Archive ~/.claude
if [[ -d "$HOME/.claude" ]]; then
  tar -czvf "$OUTDIR/$DATE.dotclaude.tgz" -C "$HOME" \
    --exclude='.claude/plugins/marketplaces' \
    --exclude='.claude/plugins/repos' \
    .claude
  echo "Created $OUTDIR/$DATE.dotclaude.tgz"
else
  echo "Skipping ~/.claude (does not exist)"
fi

# Archive /private/tmp/claude (dereference symlinks to include actual content)
if [[ -d "/private/tmp/claude" ]]; then
  tar -chzvf "$OUTDIR/$DATE.tmpclaude.tgz" -C /private/tmp claude
  echo "Created $OUTDIR/$DATE.tmpclaude.tgz"
else
  echo "Skipping /private/tmp/claude (does not exist)"
fi
