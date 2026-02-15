# Status Line Observability

Data available to `statusline-command.js` via stdin JSON (updated every 300ms max).

## Available Fields

### Context Window

| Field | Type | Description |
|-------|------|-------------|
| `context_window.context_window_size` | number | Total capacity (e.g., 200000) |
| `context_window.total_input_tokens` | number | Cumulative session input tokens |
| `context_window.total_output_tokens` | number | Cumulative session output tokens |
| `context_window.current_usage.input_tokens` | number | Current request input |
| `context_window.current_usage.output_tokens` | number | Current request output |
| `context_window.current_usage.cache_creation_input_tokens` | number | Tokens written to cache |
| `context_window.current_usage.cache_read_input_tokens` | number | Tokens read from cache |

### Cost & Duration

| Field | Type | Description |
|-------|------|-------------|
| `cost.total_cost_usd` | number | Session cost estimate in USD |
| `cost.total_duration_ms` | number | Wall-clock time |
| `cost.total_api_duration_ms` | number | Actual API execution time |
| `cost.total_lines_added` | number | Lines of code added |
| `cost.total_lines_removed` | number | Lines of code removed |

### Model & Session

| Field | Type | Description |
|-------|------|-------------|
| `model.id` | string | Model identifier (e.g., `claude-opus-4-5-20251101`) |
| `model.display_name` | string | Short name (e.g., `Opus`) |
| `session_id` | string | Unique session identifier |
| `version` | string | Claude Code version |

### Workspace

| Field | Type | Description |
|-------|------|-------------|
| `workspace.current_dir` | string | Current working directory |
| `workspace.project_dir` | string | Original project root |
| `cwd` | string | Alias for current directory |
| `transcript_path` | string | Path to session transcript JSONL |

---

## Calculated Metrics

```javascript
// Total session tokens (cumulative, survives compaction)
const totalTokens = context_window.total_input_tokens + context_window.total_output_tokens;

// NOTE: total_input_tokens is CUMULATIVE across the session, not current context usage.
// It will exceed context_window_size in long sessions due to auto-compaction.
// There is no field exposing current context window fullness.

// Cache efficiency (per-request)
const cacheHits = context_window.current_usage.cache_read_input_tokens;
const cacheWrites = context_window.current_usage.cache_creation_input_tokens;
const cacheEfficiency = cacheHits / (cacheHits + cacheWrites) * 100;

// Cost per token
const costPerToken = cost.total_cost_usd / totalTokens;

// API vs idle time
const apiPercent = (cost.total_api_duration_ms / cost.total_duration_ms) * 100;
```

---

## Full JSON Structure

```json
{
  "hook_event_name": "Status",
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/current/dir",
  "model": {
    "id": "claude-opus-4-5-20251101",
    "display_name": "Opus"
  },
  "workspace": {
    "current_dir": "/current/dir",
    "project_dir": "/project/root"
  },
  "version": "1.0.80",
  "cost": {
    "total_cost_usd": 0.01234,
    "total_duration_ms": 45000,
    "total_api_duration_ms": 2300,
    "total_lines_added": 156,
    "total_lines_removed": 23
  },
  "context_window": {
    "total_input_tokens": 15234,
    "total_output_tokens": 4521,
    "context_window_size": 200000,
    "current_usage": {
      "input_tokens": 8500,
      "output_tokens": 1200,
      "cache_creation_input_tokens": 5000,
      "cache_read_input_tokens": 2000
    }
  }
}
```

---

## Configuration

In `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusline-command.js"
  }
}
```
