---
name: verify-efa
description: Verify code changes against an EFA (Explainer For Agents). Use when reviewing code for compliance with EFA guidelines, checking git diffs against EFA standards, or creating remediation plans.
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, AskUserQuestion, Task
---

# Verify EFA Compliance

This skill verifies code changes against EFA (Explainer For Agents) documents and produces remediation plans.

## Workflow

### Step 1: Gather User Input

Use the AskUserQuestion tool to collect required information:

**Question 1 - Select EFA:**
First, use Glob to find available EFAs: `dev/efas/*.md`
Then present them as options. If more than 4 EFAs exist, split into categories or show the most relevant ones.

Example question structure:
```
header: "EFA"
question: "Which EFA should we verify against?"
options:
  - label: "0003 - Package Specs"
    description: "npm-package-arg usage guidelines"
  - label: "0006 - Purl Parsing"
    description: "packageurl-js parsing requirements"
  - label: "Other EFA..."
    description: "I'll specify the EFA filename"
```

**Question 2 - Expert Personas:**
```
header: "Experts"
question: "Which expert personas should guide this review?"
options:
  - label: "Matteo Collina & John David Dalton"
    description: "Node.js core contributors perspective"
  - label: "Isaac Z. Schlueter & Kat Marchan"
    description: "npm ecosystem architects perspective"
  - label: "Custom experts..."
    description: "I'll specify expert names"
```

**Question 3 - Search Query:**
```
header: "MVQ"
question: "What's the minimum viable query to find related code?"
options:
  - label: "purl"
    description: "Search for purl/packageurl patterns"
  - label: "npa"
    description: "Search for npm-package-arg patterns"
  - label: "lockfile"
    description: "Search for lockfile parsing patterns"
  - label: "Custom query..."
    description: "I'll specify a search term"
```

**Question 4 - Plan Suffix:**
```
header: "Plan name"
question: "What suffix for the plan file? (becomes dev/specs/plans/YYYY-MM-DD-{suffix}.md)"
options:
  - label: "align-efa-NNNN"
    description: "Standard alignment plan naming"
  - label: "verify-efa-NNNN"
    description: "Verification-focused naming"
  - label: "Custom suffix..."
    description: "I'll specify the suffix"
```

### Step 2: Execute Verification

Once inputs are gathered, use the nodejs-principal agent with sequential thinking 20 to think as the specified experts:

1. Read the selected EFA file into context
2. Extract the EFA number from filename (e.g., "0006" → "EFA-0006")
3. Search codebase for files containing the MVQ keyword
4. Run `git diff --stat main` to identify changed files
5. Examine changes for issues outlined in the EFA
6. Write remediation plan to `dev/specs/plans/{DATE}-{PLAN_SUFFIX}.md`

### Step 3: Plan Document Structure

The plan should document:
- Which files were examined
- Which EFA guidelines were checked
- Any violations or issues found
- Specific remediation steps for each issue
- Code examples where applicable

## Reference

[@concepts/principle0.md](https://github.com/indexzero/dotvibes/blob/main/concepts/truth/principle0.md)
