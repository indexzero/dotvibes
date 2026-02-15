---
description: Verify code against EFA guidelines with interactive selection
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, AskUserQuestion, Task
---

# Verify EFA Compliance

Use the **verify-efa skill** to verify code changes against EFA (Explainer For Agents) documents.

The skill will interactively prompt for:
1. Which EFA to verify against (from dev/efas/*.md)
2. Expert personas for the review
3. Minimum viable query (MVQ) to find related code
4. Plan suffix for the output file

Start now by using AskUserQuestion to gather these inputs, then execute the verification.
