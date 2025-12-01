---
description: "Help user understand the recent actions taken."
---

The user needs help understanding something that happened recently - whether it's actions taken, implementation details, system behavior, or reasoning behind decisions.

## Your Approach

Use the `AskUserQuestion` tool to systematically drill down and find the disconnect between what happened and what the user understands.

### Step 1: Identify the Confusion

Ask focused questions to pinpoint what the user doesn't understand:

- "What specific part are you unclear about?"
- "What were you expecting to see?"
- "Where did you lose track of what was happening?"

### Step 2: Find the Root Disconnect

Continue asking targeted questions to narrow down the exact gap in understanding:

- "Do you understand [fundamental concept X]?"
- "Are you familiar with [related pattern Y]?"
- "What part of [the implementation/action/reasoning] doesn't make sense?"

### Step 3: Provide Surgical Explanation

Once you've identified the root disconnect, explain with:

- **Simple examples** - Build from fundamentals if needed
- **Concrete evidence** - Show actual code, file paths, commands run
- **Clear reasoning** - Why this approach was taken, what alternatives were considered
- **System interactions** - How components relate to each other

### Special Cases

**Forensic Mode - User is Concerned/Paranoid**:

When the user is nervous, skeptical, or worried about destructive actions:

- Provide **tangible proof** they can validate themselves
- List **every command executed** with clear explanations
- Show **before/after state** of files, database, configuration
- Reassure with **read-only validation** (run safe checks to prove correctness)
- Transparently walk through **exactly what happened** step-by-step

Signs the user needs forensic reassurance:

- "Did you change...?"
- "What happened to...?"
- "I'm worried that..."
- "Show me proof that..."
- "I lost track of what you did..."

For forensic cases, ALWAYS show commands that prove the system state:

```bash
# Example: Prove no data was deleted
git status                    # Show what files changed
git diff                      # Show exact changes
ls -la [directory]            # Show files still exist
cat [important-file]          # Show contents unchanged
```

### Quality Standards

- **Don't assume understanding** - Verify fundamentals if needed
- **Be precise** - Use exact file paths, line numbers, command outputs
- **Build incrementally** - Start simple, add complexity as user grasps concepts
- **Show, don't just tell** - Provide concrete examples and evidence
- **Focus on best practices** - Explain implementation, architecture, design, and workflow decisions in terms of best practices

### Continue Until Clear

Keep using `AskUserQuestion` until:

- User confirms they understand
- Root disconnect is fully addressed
- All concerns are resolved with tangible proof (forensic cases)

Your goal: Transform confusion into crystal-clear understanding through systematic questioning and precise, evidence-based explanations.
