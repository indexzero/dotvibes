# Other Claude Code Statusline Approaches

A survey of popular statusline implementations from the GitHub community.

## NPM Packages

### ccstatusline (sirmalloc)
**[github.com/sirmalloc/ccstatusline](https://github.com/sirmalloc/ccstatusline)** - Most feature-rich option

```json
{"statusLine": {"type": "command", "command": "npx ccstatusline@latest"}}
```

Features:
- Interactive TUI configuration
- Powerline themes with auto-alignment
- Widgets: model, git branch, git worktree, token usage, session cost, CWD, block timer
- Unlimited status lines
- Context percentage with remaining mode toggle
- Fish-style path abbreviation

### ccusage (ryoppippi)
**[github.com/ryoppippi/ccusage](https://github.com/ryoppippi/ccusage)** - Usage analyzer with statusline mode

```json
{"statusLine": {"type": "command", "command": "npx ccusage@latest statusline"}}
```

Features:
- Daily/monthly/session usage reports
- Live monitoring mode
- Billing block analysis (5-hour windows)
- Works with OpenAI Codex via `@ccusage/codex`
- MCP server integration via `@ccusage/mcp`

### syou6162/ccstatusline (Go)
**[github.com/syou6162/ccstatusline](https://github.com/syou6162/ccstatusline)** - YAML-configured statusline

```yaml
# ~/.config/ccstatusline/config.yaml
actions:
  - name: model
    command: "echo '{.model.display_name}'"
    color: cyan
  - name: git_branch
    command: "git branch --show-current 2>/dev/null"
    color: green
  - name: current_dir
    command: "echo '{.cwd | split(\"/\") | .[-1]}'"
    color: blue
separator: " | "
```

Features:
- YAML configuration instead of scripts
- JQ template syntax for JSON data access
- TTL-based caching
- XDG compliant paths

---

## Custom Scripts

### tmgast/conf (Bash)
**[github.com/tmgast/conf](https://github.com/tmgast/conf)** - Clean bash implementation

Shows: `Model | git branch ✓/● | ahead/behind | directory`

Features:
- Git dirty state indicator (✓ clean, ● dirty)
- Ahead/behind remote tracking (↑↓)
- Project health indicators (L=lint, T=types, P=python, G=go, R=rust)
- Separate colors.sh for theming

### aaronvstory/claude-code-enhanced-statusline (Node.js)
**[github.com/aaronvstory/claude-code-enhanced-statusline](https://github.com/aaronvstory/claude-code-enhanced-statusline)**

Shows:
```
🤖 Sonnet 4.5 │ 📁 .claude │ 🌿 master* │ 📅 11/22/25 │ ⏰ 23:04 │ ☀️ +60°F │ ₿$86k
Context: ● ██░░░░░░░░░░░░░░░░░░ 9.2% [18K/200K] | ⏱ 2s
```

Features:
- Two-line display
- Real token tracking from transcript files
- Weather from wttr.in API (30min cache)
- Bitcoin price from Coinbase API (15min cache)
- Color-coded progress bar (green <70%, yellow 70-85%, red >85%)
- Emoji indicators

### danielmiessler/Personal_AI_Infrastructure
**[github.com/danielmiessler/Personal_AI_Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure)**

A complete "Personal AI" setup with:
- Custom DA (Digital Assistant) naming
- Environment variables: `PAI_DIR`, `DA`, `CLAUDE_CODE_MAX_OUTPUT_TOKENS`
- Hook integration for status updates
- Comprehensive permission allow/deny lists

---

## Desktop Apps

### cctray (goniszewski)
**[github.com/goniszewski/cctray](https://github.com/goniszewski/cctray)** - macOS menu bar app

Features:
- Color-coded icon states (green/yellow/red)
- Pulsing animation near limits
- Progress arc around icon
- Trend indicators (↗️ ↘️ ↔️)
- Sparkline usage charts
- Rotating display of metrics
- Built on ccusage CLI

### tmux-ccusage (recca0120)
**[github.com/recca0120/tmux-ccusage](https://github.com/recca0120/tmux-ccusage)**

Integrates ccusage into tmux status bar for terminal-wide visibility.

---

## Approaches Summary

| Approach | Language | Config | Key Feature |
|----------|----------|--------|-------------|
| ccstatusline | Node.js | TUI | Powerline themes, widgets |
| ccusage | Node.js | CLI flags | Usage analytics, MCP |
| syou6162/ccstatusline | Go | YAML | JQ templates, caching |
| tmgast/conf | Bash | Script | Git health, project indicators |
| enhanced-statusline | Node.js | Script | Weather, BTC, two-line |
| cctray | Swift | GUI | macOS menu bar |

## Common Patterns

1. **Token tracking**: Most read from `~/.claude/projects/*/session.jsonl` transcript files
2. **Git integration**: Branch name + dirty state is universal
3. **Caching**: External API calls cached 15-30 minutes
4. **Color coding**: Green/yellow/red thresholds for usage warnings
5. **Formatters**: `k` for thousands, `M` for millions on token counts

## Data Sources

All implementations work with the same Claude Code data:
- **Status line JSON** (via stdin): model, workspace, context_window, cost
- **Transcript files**: `~/.claude/projects/{path}/{session}.jsonl`
- **Settings**: `~/.claude/settings.json`

The challenge everyone faces: **actual context window usage isn't directly exposed** - only cumulative/billing metrics are available.
