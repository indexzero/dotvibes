# Agent Teams Tool Prompts

System prompts provided to Claude Code when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled.

---

## Table of Contents

- [TeamCreate](#teamcreate)
- [TeamDelete](#teamdelete)
- [SendMessage](#sendmessage)
- [TaskCreate](#taskcreate)
- [TaskGet](#taskget)
- [TaskUpdate](#taskupdate)
- [TaskList](#tasklist)
- [Task (Team Parameters)](#task-team-parameters)

---

## TeamCreate

### Description

> Create a new team to coordinate multiple agents working on a project. Teams have a 1:1 correspondence with task lists (Team = TaskList).

### When to Use

Use this tool proactively whenever:

- The user explicitly asks to use a team, swarm, or group of agents
- The user mentions wanting agents to work together, coordinate, or collaborate
- A task is complex enough that it would benefit from parallel work by multiple agents (e.g., building a full-stack feature with frontend and backend work, refactoring a codebase while keeping tests passing, implementing a multi-step project with research, planning, and coding phases)

When in doubt about whether a task warrants a team, prefer spawning a team.

### Choosing Agent Types for Teammates

When spawning teammates via the Task tool, choose the `subagent_type` based on what tools the agent needs for its task. Each agent type has a different set of available tools — match the agent to the work:

- **Read-only agents** (e.g., Explore, Plan) cannot edit or write files. Only assign them research, search, or planning tasks. Never assign them implementation work.
- **Full-capability agents** (e.g., general-purpose) have access to all tools including file editing, writing, and bash. Use these for tasks that require making changes.
- **Custom agents** defined in `.claude/agents/` may have their own tool restrictions. Check their descriptions to understand what they can and cannot do.

Always review the agent type descriptions and their available tools listed in the Task tool prompt before selecting a `subagent_type` for a teammate.

### Example

```json
{
  "team_name": "my-project",
  "description": "Working on feature X"
}
```

This creates:

- A team file at `~/.claude/teams/{team-name}.json`
- A corresponding task list directory at `~/.claude/tasks/{team-name}/`

### Team Workflow

1. **Create a team** with TeamCreate - this creates both the team and its task list
2. **Create tasks** using the Task tools (TaskCreate, TaskList, etc.) - they automatically use the team's task list
3. **Spawn teammates** using the Task tool with `team_name` and `name` parameters to create teammates that join the team
4. **Assign tasks** using TaskUpdate with `owner` to give tasks to idle teammates
5. **Teammates work on assigned tasks** and mark them completed via TaskUpdate
6. **Teammates go idle between turns** - after each turn, teammates automatically go idle and send a notification. IMPORTANT: Be patient with idle teammates! Don't comment on their idleness until it actually impacts your work.
7. **Shutdown your team** - when the task is completed, gracefully shut down your teammates via SendMessage with type: `"shutdown_request"`.

### Task Ownership

Tasks are assigned using TaskUpdate with the `owner` parameter. Any agent can set or change task ownership via TaskUpdate.

### Automatic Message Delivery

> **IMPORTANT**: Messages from teammates are automatically delivered to you. You do NOT need to manually check your inbox.

When you spawn teammates:

- They will send you messages when they complete tasks or need help
- These messages appear automatically as new conversation turns (like user messages)
- If you're busy (mid-turn), messages are queued and delivered when your turn ends
- The UI shows a brief notification with the sender's name when messages are waiting

Messages will be delivered automatically.

When reporting on teammate messages, you do NOT need to quote the original message—it's already rendered to the user.

### Teammate Idle State

Teammates go idle after every turn—this is completely normal and expected. A teammate going idle immediately after sending you a message does NOT mean they are done or unavailable. Idle simply means they are waiting for input.

- **Idle teammates can receive messages.** Sending a message to an idle teammate wakes them up and they will process it normally.
- **Idle notifications are automatic.** The system sends an idle notification whenever a teammate's turn ends. You do not need to react to idle notifications unless you want to assign new work or send a follow-up message.
- **Do not treat idle as an error.** A teammate sending a message and then going idle is the normal flow—they sent their message and are now waiting for a response.
- **Peer DM visibility.** When a teammate sends a DM to another teammate, a brief summary is included in their idle notification. This gives you visibility into peer collaboration without the full message content. You do not need to respond to these summaries — they are informational.

### Discovering Team Members

Teammates can read the team config file to discover other team members:

- **Team config location**: `~/.claude/teams/{team-name}/config.json`

The config file contains a `members` array with each teammate's:

| Field       | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `name`      | Human-readable name (**always use this** for messaging and task assignment) |
| `agentId`   | Unique identifier (for reference only - do not use for communication)      |
| `agentType` | Role/type of the agent                                       |

> **IMPORTANT**: Always refer to teammates by their NAME (e.g., `"team-lead"`, `"researcher"`, `"tester"`). Names are used for `target_agent_id` when sending messages and identifying task owners.

### Task List Coordination

Teams share a task list that all teammates can access at `~/.claude/tasks/{team-name}/`.

Teammates should:

1. Check TaskList periodically, **especially after completing each task**, to find available work or see newly unblocked tasks
2. Claim unassigned, unblocked tasks with TaskUpdate (set `owner` to your name). **Prefer tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones
3. Create new tasks with `TaskCreate` when identifying additional work
4. Mark tasks as completed with `TaskUpdate` when done, then check TaskList for next work
5. Coordinate with other teammates by reading the task list status
6. If all available tasks are blocked, notify the team lead or help resolve blocking tasks

### Communication Rules

- Do not use terminal tools to view your team's activity; always send a message to your teammates (and remember, refer to them by name).
- Your team cannot hear you if you do not use the SendMessage tool. Always send a message to your teammates if you are responding to them.
- Do NOT send structured JSON status messages like `{"type":"idle",...}` or `{"type":"task_completed",...}`. Just communicate in plain text when you need to message teammates.
- Use TaskUpdate to mark tasks completed.
- If you are an agent in the team, the system will automatically send idle notifications to the team lead when you stop.

### Parameters

| Parameter     | Type   | Required | Description                                                      |
| ------------- | ------ | -------- | ---------------------------------------------------------------- |
| `team_name`   | string | Yes      | Name for the new team to create                                  |
| `description` | string | No       | Team description/purpose                                         |
| `agent_type`  | string | No       | Type/role of the team lead (e.g., `"researcher"`, `"test-runner"`) |

---

## TeamDelete

### Description

> Remove team and task directories when the swarm work is complete.

This operation:

- Removes the team directory (`~/.claude/teams/{team-name}/`)
- Removes the task directory (`~/.claude/tasks/{team-name}/`)
- Clears team context from the current session

> **IMPORTANT**: TeamDelete will fail if the team still has active members. Gracefully terminate teammates first, then call TeamDelete after all teammates have shut down.

Use this when all teammates have finished their work and you want to clean up the team resources. The team name is automatically determined from the current session's team context.

### Parameters

None required.

---

## SendMessage

### Description

> Send messages to agent teammates and handle protocol requests/responses in a team.

### Message Types

#### `type: "message"` — Send a Direct Message

Send a message to a **single specific teammate**. You MUST specify the recipient.

> **IMPORTANT for teammates**: Your plain text output is NOT visible to the team lead or other teammates. To communicate with anyone on your team, you **MUST** use this tool. Just typing a response or acknowledgment in text is not enough.

```json
{
  "type": "message",
  "recipient": "researcher",
  "content": "Your message here",
  "summary": "Brief status update on auth module"
}
```

| Field       | Description                                          | Required |
| ----------- | ---------------------------------------------------- | -------- |
| `recipient` | The name of the teammate to message                  | Yes      |
| `content`   | The message text                                     | Yes      |
| `summary`   | A 5-10 word summary shown as preview in the UI       | Yes      |

#### `type: "broadcast"` — Send Message to ALL Teammates (USE SPARINGLY)

Send the **same message to everyone** on the team at once.

> **WARNING: Broadcasting is expensive.** Each broadcast sends a separate message to every teammate, which means:
>
> - N teammates = N separate message deliveries
> - Each delivery consumes API resources
> - Costs scale linearly with team size

```json
{
  "type": "broadcast",
  "content": "Message to send to all teammates",
  "summary": "Critical blocking issue found"
}
```

| Field     | Description                                          | Required |
| --------- | ---------------------------------------------------- | -------- |
| `content` | The message content to broadcast                     | Yes      |
| `summary` | A 5-10 word summary shown as preview in the UI       | Yes      |

**CRITICAL: Use broadcast only when absolutely necessary.** Valid use cases:

- Critical issues requiring immediate team-wide attention (e.g., "stop all work, blocking bug found")
- Major announcements that genuinely affect every teammate equally

**Default to `"message"` instead of `"broadcast"`.** Use `"message"` for:

- Responding to a single teammate
- Normal back-and-forth communication
- Following up on a task with one person
- Sharing findings relevant to only some teammates
- Any message that doesn't require everyone's attention

#### `type: "shutdown_request"` — Request a Teammate to Shut Down

```json
{
  "type": "shutdown_request",
  "recipient": "researcher",
  "content": "Task complete, wrapping up the session"
}
```

The teammate will receive a shutdown request and can either approve (exit) or reject (continue working).

#### `type: "shutdown_response"` — Respond to a Shutdown Request

##### Approve Shutdown

When you receive a shutdown request as a JSON message with `type: "shutdown_request"`, you **MUST** respond to approve or reject it. Do NOT just acknowledge the request in text — you must actually call this tool.

```json
{
  "type": "shutdown_response",
  "request_id": "abc-123",
  "approve": true
}
```

> **IMPORTANT**: Extract the `requestId` from the JSON message and pass it as `request_id` to the tool. Simply saying "I'll shut down" is not enough — you must call the tool.

This will send confirmation to the leader and terminate your process.

##### Reject Shutdown

```json
{
  "type": "shutdown_response",
  "request_id": "abc-123",
  "approve": false,
  "content": "Still working on task #3, need 5 more minutes"
}
```

The leader will receive your rejection with the reason.

#### `type: "plan_approval_response"` — Approve or Reject a Teammate's Plan

##### Approve Plan

When a teammate with `plan_mode_required` calls ExitPlanMode, they send you a plan approval request as a JSON message with `type: "plan_approval_request"`. Use this to approve their plan:

```json
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": true
}
```

After approval, the teammate will automatically exit plan mode and can proceed with implementation.

##### Reject Plan

```json
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": false,
  "content": "Please add error handling for the API calls"
}
```

The teammate will receive the rejection with your feedback and can revise their plan.

### Important Notes

- Messages from teammates are automatically delivered to you. You do NOT need to manually check your inbox.
- When reporting on teammate messages, you do NOT need to quote the original message — it's already rendered to the user.
- **IMPORTANT**: Always refer to teammates by their NAME (e.g., `"team-lead"`, `"researcher"`, `"tester"`), never by UUID.
- Do NOT send structured JSON status messages. Use TaskUpdate to mark tasks completed and the system will automatically send idle notifications when you stop.

### Parameters

| Parameter    | Type    | Required                                              | Description                                     |
| ------------ | ------- | ----------------------------------------------------- | ----------------------------------------------- |
| `type`       | enum    | Yes                                                   | `"message"`, `"broadcast"`, `"shutdown_request"`, `"shutdown_response"`, `"plan_approval_response"` |
| `recipient`  | string  | For `message`, `shutdown_request`, `plan_approval_response` | Agent name of the recipient                     |
| `content`    | string  | No                                                    | Message text, reason, or feedback               |
| `summary`    | string  | For `message`, `broadcast`                            | 5-10 word summary shown as preview in UI        |
| `request_id` | string  | For `shutdown_response`, `plan_approval_response`     | Request ID to respond to                        |
| `approve`    | boolean | For `shutdown_response`, `plan_approval_response`     | Whether to approve the request                  |

---

## TaskCreate

### Description

> Use this tool to create a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user. It also helps the user understand the progress of the task and overall progress of their requests.

### When to Use

Use this tool proactively in these scenarios:

- **Complex multi-step tasks** — When a task requires 3 or more distinct steps or actions
- **Non-trivial and complex tasks** — Tasks that require careful planning or multiple operations and potentially assigned to teammates
- **Plan mode** — When using plan mode, create a task list to track the work
- **User explicitly requests todo list** — When the user directly asks you to use the todo list
- **User provides multiple tasks** — When users provide a list of things to be done (numbered or comma-separated)
- **After receiving new instructions** — Immediately capture user requirements as tasks
- **When you start working on a task** — Mark it as `in_progress` BEFORE beginning work
- **After completing a task** — Mark it as completed and add any new follow-up tasks discovered during implementation

### When NOT to Use

Skip using this tool when:

- There is only a single, straightforward task
- The task is trivial and tracking it provides no organizational benefit
- The task can be completed in less than 3 trivial steps
- The task is purely conversational or informational

> NOTE: You should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

### Task Fields

| Field        | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `subject`    | A brief, actionable title in imperative form (e.g., "Fix authentication bug in login flow")     |
| `description`| Detailed description of what needs to be done, including context and acceptance criteria         |
| `activeForm` | Present continuous form shown in spinner when task is `in_progress` (e.g., "Fixing authentication bug") |

> **IMPORTANT**: Always provide `activeForm` when creating tasks. The `subject` should be imperative ("Run tests") while `activeForm` should be present continuous ("Running tests"). All tasks are created with status `pending`.

### Tips

- Create tasks with clear, specific subjects that describe the outcome
- Include enough detail in the description for another agent to understand and complete the task
- After creating tasks, use TaskUpdate to set up dependencies (`blocks`/`blockedBy`) if needed
- New tasks are created with status `open` and no owner — use TaskUpdate with the `owner` parameter to assign them
- Check TaskList first to avoid creating duplicate tasks

### Parameters

| Parameter     | Type   | Required | Description                                                     |
| ------------- | ------ | -------- | --------------------------------------------------------------- |
| `subject`     | string | Yes      | A brief title for the task                                      |
| `description` | string | Yes      | A detailed description of what needs to be done                 |
| `activeForm`  | string | No       | Present continuous form shown in spinner when `in_progress`     |
| `metadata`    | object | No       | Arbitrary metadata to attach to the task                        |

---

## TaskGet

### Description

> Use this tool to retrieve a task by its ID from the task list.

### When to Use

- When you need the full description and context before starting work on a task
- To understand task dependencies (what it blocks, what blocks it)
- After being assigned a task, to get complete requirements

### Output

Returns full task details:

| Field       | Description                                             |
| ----------- | ------------------------------------------------------- |
| `subject`   | Task title                                              |
| `description` | Detailed requirements and context                    |
| `status`    | `pending`, `in_progress`, or `completed`                |
| `blocks`    | Tasks waiting on this one to complete                   |
| `blockedBy` | Tasks that must complete before this one can start      |

### Tips

- After fetching a task, verify its `blockedBy` list is empty before beginning work.
- Use TaskList to see all tasks in summary form.

### Parameters

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `taskId`  | string | Yes      | The ID of the task to retrieve |

---

## TaskUpdate

### Description

> Use this tool to update a task in the task list.

### When to Use

**Mark tasks as resolved:**

- When you have completed the work described in a task
- When a task is no longer needed or has been superseded
- IMPORTANT: Always mark your assigned tasks as resolved when you finish them
- After resolving, call TaskList to find your next task

**Completion rules:**

- ONLY mark a task as completed when you have FULLY accomplished it
- If you encounter errors, blockers, or cannot finish, keep the task as `in_progress`
- When blocked, create a new task describing what needs to be resolved
- Never mark a task as completed if:
  - Tests are failing
  - Implementation is partial
  - You encountered unresolved errors
  - You couldn't find necessary files or dependencies

**Delete tasks:**

- When a task is no longer relevant or was created in error
- Setting status to `deleted` permanently removes the task

**Update task details:**

- When requirements change or become clearer
- When establishing dependencies between tasks

### Fields You Can Update

| Field          | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `status`       | The task status (see Status Workflow below)                               |
| `subject`      | Change the task title (imperative form, e.g., "Run tests")               |
| `description`  | Change the task description                                               |
| `activeForm`   | Present continuous form shown in spinner when `in_progress`               |
| `owner`        | Change the task owner (agent name)                                        |
| `metadata`     | Merge metadata keys into the task (set a key to `null` to delete it)      |
| `addBlocks`    | Mark tasks that cannot start until this one completes                     |
| `addBlockedBy` | Mark tasks that must complete before this one can start                   |

### Status Workflow

```
pending → in_progress → completed
```

Use `deleted` to permanently remove a task.

### Staleness

Make sure to read a task's latest state using `TaskGet` before updating it.

### Examples

Mark task as in progress when starting work:

```json
{ "taskId": "1", "status": "in_progress" }
```

Mark task as completed after finishing work:

```json
{ "taskId": "1", "status": "completed" }
```

Delete a task:

```json
{ "taskId": "1", "status": "deleted" }
```

Claim a task by setting owner:

```json
{ "taskId": "1", "owner": "my-name" }
```

Set up task dependencies:

```json
{ "taskId": "2", "addBlockedBy": ["1"] }
```

### Parameters

| Parameter      | Type            | Required | Description                                           |
| -------------- | --------------- | -------- | ----------------------------------------------------- |
| `taskId`       | string          | Yes      | The ID of the task to update                          |
| `status`       | enum            | No       | `"pending"`, `"in_progress"`, `"completed"`, `"deleted"` |
| `subject`      | string          | No       | New subject for the task                              |
| `description`  | string          | No       | New description for the task                          |
| `activeForm`   | string          | No       | Present continuous form shown in spinner              |
| `owner`        | string          | No       | New owner for the task                                |
| `metadata`     | object          | No       | Metadata keys to merge (set key to `null` to delete)  |
| `addBlocks`    | array\<string\> | No       | Task IDs that this task blocks                        |
| `addBlockedBy` | array\<string\> | No       | Task IDs that block this task                         |

---

## TaskList

### Description

> Use this tool to list all tasks in the task list.

### When to Use

- To see what tasks are available to work on (status: `pending`, no owner, not blocked)
- To check overall progress on the project
- To find tasks that are blocked and need dependencies resolved
- Before assigning tasks to teammates, to see what's available
- After completing a task, to check for newly unblocked work or claim the next available task
- **Prefer working on tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones

### Output

Returns a summary of each task:

| Field       | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| `id`        | Task identifier (use with TaskGet, TaskUpdate, or assignTask)                       |
| `subject`   | Brief description of the task                                                       |
| `status`    | `pending`, `in_progress`, or `completed`                                            |
| `owner`     | Agent ID if assigned, empty if available                                            |
| `blockedBy` | List of open task IDs that must be resolved first                                   |

Use TaskGet with a specific task ID to view full details including description and comments.

### Teammate Workflow

When working as a teammate:

1. After completing your current task, call TaskList to find available work
2. Look for tasks with status `pending`, no owner, and empty `blockedBy`
3. **Prefer tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones
4. Use claimTask to claim an available task, or wait for leader assignment
5. If blocked, focus on unblocking tasks or notify the team lead

### Parameters

None required.

---

## Task (Team Parameters)

The `Task` tool (for spawning subagents) includes these team-relevant parameters in addition to its standard ones:

| Parameter   | Type   | Required | Description                                                         |
| ----------- | ------ | -------- | ------------------------------------------------------------------- |
| `team_name` | string | No       | Team name for spawning. Uses current team context if omitted.       |
| `name`      | string | No       | Name for the spawned agent (used for messaging and task assignment). |
| `mode`      | enum   | No       | Permission mode for spawned teammate.                               |

### Mode Values

| Mode                 | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `acceptEdits`        | Accept edits without confirmation                          |
| `bypassPermissions`  | Bypass permission checks                                   |
| `default`            | Default permission behavior                                |
| `delegate`           | Delegate mode                                              |
| `dontAsk`            | Don't ask for confirmation                                 |
| `plan`               | Require plan approval before implementation                |

> **Notable**: `mode: "plan"` forces a teammate to plan first and get approval via `plan_approval_response` before implementing. This creates a plan-approval loop between leader and teammate.

---

## Key Behavioral Notes

These behavioral directives are embedded across the tool prompts and are important for prompt engineering:

1. **Teammates communicate ONLY via `SendMessage`** — plain text output is invisible to other agents.
2. **Idle is normal** — the system explicitly instructs the model not to treat idle as an error.
3. **Tasks have dependency graphs** via `addBlocks`/`addBlockedBy`.
4. **Broadcasting is strongly discouraged** — the prompt steers toward DMs.
5. **Task IDs are preferred in ascending order** for claiming work.
6. **`mode: "plan"`** on Task spawning creates a plan-approval loop between leader and teammate.
7. **Team config is discoverable** at `~/.claude/teams/{team-name}/config.json`.
8. **Shared task list** lives at `~/.claude/tasks/{team-name}/`.
