# MAINTAINIZEN: Incremental Software Maintenance Prompting Technique

## Executive Summary

This document analyzes whether the following prompting technique is optimal for performing incremental software maintenance on large software systems:

```
1. Bring target content into context
2. Explain what you see in it that `<context framing>`
3. Justify that your assertions are correct with primary source evidence
4. `<Ask questions about assertions that are false, potentially misleading, or avoidant>`
5. When I have no further questions you may begin on `<task prompt>`
```

**Verdict: OPTIMAL** for its intended scope—pre-execution verification for incremental maintenance on non-trivial systems where correctness matters more than speed.

---

## Evidence Sources

### 1. Local Codebase (dotvibes)

| Source | Pattern | Alignment |
|--------|---------|-----------|
| `concepts/collab/punchlist*.md` | Punchlist workflow | **EXACT MATCH** |
| `concepts/collab/specify.md` | Context specification | Direct support |
| `concepts/truth/principle0.md` | Radical candor—truth above all | Validates Step 3-4 |
| `concepts/truth/co-arising.md` | "Bullshit and its recognition co-arise" | Validates Step 4 |
| `vlurp/.../clarify.md` | 525-line clarification workflow | Validates Step 4 |
| `efas/` | Evidence-based verification system | Validates Step 3 |

#### Punchlist Pattern (Primary Evidence)

The punchlist workflow implements this technique precisely:

```markdown
1. You will ask me what code you should read to develop the plan for the feature
   → STEP 1: Bring target content into context

2. I will tell you what code to go read, what you should pay attention to,
   and why it is relevant to the plan
   → STEP 2: Explain what you see (context framing)

3. Use sequential thinking 10 to create the initial plan then use your
   `project-task-planner` agent to think deep and review the plan
   → STEP 3: Justify assertions with evidence (sequential thinking)

4. You will ask for my review of the plan
   → STEP 4: Ask clarifying questions about assertions

5. Once approved you will move onto the next item
   → STEP 5: Begin on task prompt when clarifications resolved
```

---

### 2. Simon Willison's Writings

| Concept | Quote | Source |
|---------|-------|--------|
| Context Engineering | "The delicate art and science of filling the context window with just the right information for the next step" | [Context Engineering](https://simonwillison.net/2025/jun/27/context-engineering/) |
| Read Before Write | "I often start a new chat by dumping in existing code to seed that context" | [Here's how I use LLMs](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) |
| Scout Pattern | "Send out a scout... just to find out where the sticky bits are" | [Parallel coding agents](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/) |
| Iterative Questions | "Ask me one question at a time so we can develop a thorough spec" | [Harper Reed workflow](https://simonwillison.net/2025/Feb/21/my-llm-codegen-workflow-atm/) |
| Verification | "Never trust any piece of code until you've seen it work with your own eyes" | [Hallucinations in code](https://simonwillison.net/2025/Mar/2/hallucinations-in-code/) |
| AGENTS.md | "Read PDF.md before attempting to create a PDF" | [Claude Skills](https://simonwillison.net/2025/Oct/16/claude-skills/) |

#### Key Insight: Context Engineering > Prompt Engineering

> "People associate prompts with short task descriptions you'd give an LLM in your day-to-day use. When in every industrial-strength LLM app, context engineering is the delicate art and science of filling the context window with just the right information for the next step."

#### files-to-prompt Tool

Simon built a dedicated CLI tool for Step 1:
> "files-to-prompt concatenates together a bunch of files and directories to help pipe them into a LLM as part of a prompt."

---

### 3. Anthropic Official Guidance

| Document | Pattern | Alignment |
|----------|---------|-----------|
| Claude Code Best Practices | "Explore, Plan, Code, Commit" | **STRUCTURAL MATCH** |
| Context Engineering | Progressive Discovery | Validates Step 1-2 |
| Chain of Thought | "Thinking only counts when it's out loud" | Validates Step 2-3 |
| Prompt Chaining | "Gather info → List options → Analyze → Recommend" | Validates multi-step |
| Claude Tasks Mode | "Claude will ask clarifying questions before executing" | Validates Step 4 |

#### "Explore, Plan, Code, Commit" Workflow

> "Asking Claude to research and plan first significantly improves performance for problems requiring deeper thinking upfront, as without these steps, Claude tends to jump straight to coding a solution."

| Your Technique | Anthropic's Workflow |
|----------------|----------------------|
| 1. Load content into context | "reading relevant files without writing code initially" |
| 2. Explain what you observe | Exploration phase |
| 3. Justify with evidence | "creating a plan (preferably documented)" |
| 4. Ask clarifying questions | Codebase Q&A phase |
| 5. Execute the task | "implementing with verification" |

#### Extended Thinking

> "Using the word 'think' triggers extended thinking mode, which gives Claude additional computation time to evaluate alternatives more thoroughly. These specific phrases are mapped directly to increasing levels of thinking budget: 'think' < 'think hard' < 'think harder' < 'ultrathink.'"

---

## Analysis: Why This Technique Is Optimal

### Cognitive/Computational Benefits by Step

| Step | Benefit | Mechanism |
|------|---------|-----------|
| **1. Load content** | Reduces hallucination | Grounds in actual source material |
| **2. Explain context** | Forces demonstrated comprehension | Activates Chain of Thought |
| **3. Justify with evidence** | Prevents confabulation | Creates falsifiable reasoning chains |
| **4. Question assertions** | Catches errors early | Surfaces implicit assumptions |
| **5. Authorization gate** | Prevents premature action | Ensures corrections incorporated |

### Failure Modes if Steps Skipped

| Skip | Failure Mode | Severity |
|------|--------------|----------|
| Step 1 | Hallucinated code structure, non-existent APIs | **CRITICAL** |
| Step 2 | Hidden misunderstandings persist | HIGH |
| Step 3 | Plausible but wrong claims, unverifiable | HIGH |
| Step 4 | Lies of omission never surface | HIGH |
| Step 5 | Irreversible actions with incomplete understanding | MEDIUM-HIGH |

**Conclusion**: All steps are necessary; skipping ANY significantly degrades quality.

---

## Comparison to Alternative Approaches

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Single-shot prompting | Faster | High failure rate | **Worse** for complex tasks |
| Unstructured iteration | Flexible | Errors recur | **Less reliable** |
| Comprehensive upfront | Thorough | Context overflow | **Worse** for maintenance |
| Autonomous agents | Hands-off | No oversight | **Riskier** |
| **This technique** | Balanced | Requires engagement | **Optimal** for incremental maintenance |

---

## Theoretical Grounding

### Cognitive Science
- **Working memory offloading**: External comprehension reduces cognitive load
- **Metacognitive scaffolding**: Reflection before action improves performance
- **Distributed cognition**: Optimal allocation of human/model capabilities

### Epistemology
- **Scientific method**: Observe → Hypothesize → Evidence → Test → Proceed
- **Dialectical structure**: Thesis (Step 2) → Antithesis (Step 4) → Synthesis → Step 5
- **Falsificationism**: Step 4 actively seeks to disprove claims

### LLM Architecture
- **Context window optimization**: Relevant content kept active
- **Chain of Thought activation**: Evidence requirement triggers careful reasoning
- **Hallucination mitigation**: Citation requirement prevents fabrication

---

## Recommended Refinements

### Step 0: Scaling Heuristic (Add)
"Assess task complexity. For trivial tasks, use Steps 1+5 only."

### Step 2: Confidence Levels (Enhance)
"Explain what you see, with confidence levels for each assertion."

### Step 4: Exit Criteria (Clarify)
"Proceed when all flagged assertions addressed and no new concerns in last exchange."

### Step 6: Post-Execution Verification (Extend)
"Verify execution results against expected outcomes."

---

## Contexts Where This Technique Is Suboptimal

| Context | Why Suboptimal | Better Alternative |
|---------|----------------|-------------------|
| Trivial tasks ("fix typo on line 42") | Overhead exceeds benefit | Direct instruction |
| Time-critical emergencies | Protocol introduces latency | Fast iteration + rollback |
| Exploratory/creative work | Structure constrains creativity | Open-ended exploration |
| Highly repetitive tasks | Overhead multiplies | Template/batch processing |
| Complete greenfield development | No existing code to analyze | Specification-driven development |

---

## Recommendations

### For Practitioners
1. **ADOPT** this technique for complex incremental maintenance tasks
2. **SCALE** protocol depth based on task complexity/risk
3. **FOCUS** training on Step 4 questioning skills (key human contribution)
4. **TRACK** both speed AND rework rates to justify the "friction"

### For Teams
1. **STANDARDIZE** evidence format for Step 3 (consider EFA-style structure)
2. **DOCUMENT** common failure patterns for organizational learning
3. **BUILD** tooling to support protocol compliance

### For Future Development
1. **EXPLORE** adversarial self-prompting for partial Step 4 automation
2. **RESEARCH** optimal complexity thresholds for full vs. abbreviated protocol
3. **MAINTAIN** human gate (Step 5) for foreseeable future

---

## Sources

### Local Codebase
- `concepts/collab/punchlist.plan.md`
- `concepts/collab/punchlist.md`
- `concepts/collab/specify.md`
- `concepts/truth/principle0.md`
- `concepts/truth/co-arising.md`
- `concepts/truth/truth-focused.md`
- `vlurp/Telnamix-Official/nextjs-supabase-template/.claude/commands/clarify.md`
- `vlurp/eyaltoledano/claude-task-master/.taskmaster/CLAUDE.md`
- `vlurp/microsoft/amplifier/CLAUDE.md`
- `efas/all/0000-new-efa.md`

### Simon Willison
- [Here's how I use LLMs to help me write code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/)
- [Context Engineering](https://simonwillison.net/2025/jun/27/context-engineering/)
- [Embracing the parallel coding agent lifestyle](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/)
- [My LLM codegen workflow atm](https://simonwillison.net/2025/Feb/21/my-llm-codegen-workflow-atm/)
- [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/)
- [Hallucinations in code are the least dangerous form of LLM mistakes](https://simonwillison.net/2025/Mar/2/hallucinations-in-code/)
- [Claude Skills are awesome, maybe a bigger deal than MCP](https://simonwillison.net/2025/Oct/16/claude-skills/)
- [GitHub - simonw/files-to-prompt](https://github.com/simonw/files-to-prompt)

### Anthropic Official
- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Chain complex prompts for stronger performance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-prompts)
- [Let Claude think (chain of thought prompting)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-of-thought)
- [anthropics/courses - Prompt Engineering Interactive Tutorial](https://github.com/anthropics/courses/tree/master/prompt_engineering_interactive_tutorial)
- [anthropics/claude-plugins-official - code-simplifier](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier)
- [anthropics/skills - Agent Skills Repository](https://github.com/anthropics/skills)

---

## Conclusion

The incremental software maintenance prompting technique is:

- **Empirically validated**: Multiple independent sources confirm its effectiveness
- **Theoretically grounded**: Consistent with cognitive science, epistemology, and LLM architecture
- **Practically effective**: Clear prevention of failure modes at each step
- **Appropriately scoped**: Optimized for pre-execution verification

**Recommendation**: ADOPT for incremental software maintenance on non-trivial systems. Adapt depth based on task complexity. Extend with post-execution verification for complete workflow coverage.
