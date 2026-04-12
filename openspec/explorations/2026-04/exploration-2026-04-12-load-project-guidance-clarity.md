# Exploration: load-project-guidance-clarity

**Date:** 2026-04-12
**Linked change:** none

## Context

The "Load Project Guidance" step exists as a prepended "Step 0" in every workflow template (propose, apply, explore, verify, archive, continue). The user wants two things: (1) make the step's instructions clearer and more actionable (like the `get instructions` pattern), and (2) properly integrate it into the numbered **Steps** section as Step 1 rather than leaving it as an orphaned pre-amble.

## Observations

### Current structure pattern (all templates)

Every template follows this shape:

```
[preamble text / description]

## Step 0: Load Project Guidance

Before anything else, run:
```bash
enpalspec guidance <workflow> --json
```
If the command succeeds and returns non-null fields: use `context` as project background
throughout this session, and treat `instructions` as additional guidance. If the command
fails or returns null fields, continue normally — no action needed.

[more preamble / I'll do X section]

---

**Steps**

0. [first real step - in propose.ts this is also "0"!]
1. ...
```

The guidance block is structurally floating — it sits above `**Steps**` but calls itself "Step 0", creating a confusing double-zero in `propose.ts` specifically.

### The double-zero problem in propose.ts

`propose.ts` has:
- `## Step 0: Load Project Guidance` (the preamble block)
- Then inside `**Steps**`:
  - `0. **Parse --exploration flag**` ← also step 0!
  - `1. **If no clear input provided, ask what they want to build**`

Two step 0s. The other templates (apply, verify, archive, continue) start their `**Steps**` at 1, which avoids the collision but still has the structural disconnect.

### What the guidance command actually returns

```json
{
  "skill": "propose",
  "context": "Tech stack: TypeScript, Node.js (≥20.19.0), ESM modules...",
  "instructions": null
}
```

Two fields: `context` (always non-null in practice) and `instructions` (can be null). The template text currently says:
- "use `context` as project background throughout this session"
- "treat `instructions` as additional guidance"

Compare to how the `instructions` command is documented:

```
- `context`: Project background (constraints for you - do NOT include in output)
- `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
- `template`: The structure to use for your output file
- `instruction`: Schema-specific guidance for this artifact type
- `outputPath`: Where to write the artifact
- `dependencies`: Completed artifacts to read for context
```

Each field has a precise, actionable role. The guidance step by contrast is vague — "use as project background" tells the model almost nothing about how to concretely apply it.

### What "use as context" actually means

Looking at what `context` contains (the actual output):
```
Tech stack: TypeScript, Node.js (≥20.19.0), ESM modules
Package manager: pnpm
...
Cross-platform requirements: ...
```

This is constraint/background information — it should inform decisions (e.g., always use `path.join()`, use pnpm not npm, target Node 20+). The current instruction "use as project background" is too soft. It doesn't tell the model to treat it as binding constraints that affect every subsequent step.

And `instructions` when non-null would be workflow-specific overrides — e.g., "for this project, always ask X before proposing." But because it's null in the current config, that pathway is never exercised, making the second part of the instruction a dead branch.

### How guidance differs from `instructions` command

| Aspect | `enpalspec instructions` | `enpalspec guidance` |
|--------|--------------------------|----------------------|
| Purpose | Artifact-specific instructions per artifact | Project-wide context per workflow |
| Fields | 6 clearly named fields with specific roles | 2 fields with vague instructions |
| When used | During artifact creation loop | Once at session start |
| How applied | Explicit: template = structure, rules = constraints | Implicit: "background" and "guidance" |
| Currently enforced | Clearly (template is used as structure) | Weakly (vague application) |

### Step numbering across all templates

```
propose.ts     → Step 0 (guidance) | Steps: 0, 1, 2, 3, 4, 5, 6, 7
apply-change.ts → Step 0 (guidance) | Steps: 1, 2, 3, 4, 5, 6, 7
explore.ts     → Step 0 (guidance) | Doc Setup: Step 1, 2, 3, 4
verify-change.ts → Step 0 (guidance) | Steps: 1, 2, 3, 4, 5, 6, 7, 8
archive-change.ts → Step 0 (guidance) | Steps: 1, 2, 3, 4, 5, 6
continue-change.ts → Step 0 (guidance) | Steps: 1, 2, 3, 4
```

The guidance block is always above the **Steps** section, never inside it. It's prepended, not woven. This means the model can treat it as a preamble that doesn't have to be strictly executed as part of the flow.

### The "get instructions" model is the gold standard

The `get instructions` pattern works well because:
1. It's inside the steps loop — it's clearly a step
2. Its output fields are named and role-defined
3. The model knows exactly what to do with each field
4. It's tied to a specific moment (before creating each artifact)

The guidance step should mirror this clarity. Instead of "use as project background," it should say what specifically to do with each field, and it should be numbered as Step 1 inside `**Steps**`.

### What needs to change

Two distinct issues:
1. **Structural**: Move the block inside `**Steps**` as Step 1, renumber the rest
2. **Clarity**: Rewrite the application instructions to be as specific as the `instructions` command

For (2), the improved guidance step should say something like:
- `context`: Read this. These are binding project constraints — tech stack, platform requirements, conventions. Apply them throughout this session as if they were part of your own knowledge. Do NOT include in outputs.
- `instructions`: If non-null, treat as workflow-specific overrides for this session — they modify or extend the default behavior of this workflow.

## Rounds

## Round 1 — Structural integration and language precision

### Q1.1 — Where exactly does guidance become Step 1?

In propose.ts, there's a separate argument-parsing step (currently "Step 0: Parse --exploration flag") that must happen before the guidance step would make sense. Should guidance be Step 1 even when there's an argument to parse first?

- [ ] Guidance is Step 1, argument parsing merges into Step 1 or moves into the preamble
- [x] Guidance is Step 1, argument parsing moves to Step 2 (guidance first, always) ← recommended: consistent with "before anything else" intent
- [ ] In propose specifically, argument parsing stays as Step 1, guidance becomes Step 2

> **Your answer / freetext:**
>

### Q1.2 — How specific should the field-application instructions be?

The current instruction is "use `context` as project background, treat `instructions` as additional guidance." How prescriptive should the new language be?

- [ ] Keep it loose — "use as background" is enough, models understand
- [x] Add a brief role for each field (like the `instructions` command) — "context = binding constraints, instructions = workflow overrides" ← recommended: mirrors the clarity of the instructions command pattern
- [ ] Write out concrete behavioral rules for each field (very verbose)

> **Your answer / freetext:**
>

### Q1.3 — Should the preamble text ("Before anything else, run:") stay or go?

Currently the guidance block uses "Before anything else, run:" as motivation. If guidance moves inside **Steps** as Step 1, does this language still make sense?

- [x] Remove "Before anything else" — it's implicit when it's Step 1 ← recommended: the numbered position communicates priority
- [ ] Keep it — it reinforces that guidance cannot be skipped
- [ ] Replace with a note about why guidance is Step 1 (e.g., "Load project context before any decisions are made")

> **Your answer / freetext:**
>

### Q1.4 — Should the Skill template and CommandTemplate be kept in sync, or is there a smarter approach?

Currently every workflow template has the guidance block duplicated in both `instructions` (SkillTemplate) and `content` (CommandTemplate). Any change needs to be made twice per file, across 6 files = 12 edits minimum.

- [ ] Keep as-is, edit both blocks manually per file
- [x] No change to the pattern — the duplication is a known structural issue, but fixing it is out of scope for this change ← recommended: the user's request is about clarity and integration, not refactoring the template architecture
- [ ] Extract guidance step to a shared string constant per file and reference it in both

> **Your answer / freetext:**
>

## Round 2 — Handling explore.ts's different structure

### Q2.1 — How should guidance integrate into explore.ts?

`explore.ts` doesn't use a `**Steps**` block like the other five templates. Instead its steps live inside `## Exploration Doc Setup` as `### Step 1`, `### Step 2`, etc. Guidance can't become "Step 1" in a `**Steps**` block that doesn't exist.

The current structure of the skill/command content:
```
## Step 0: Load Project Guidance   ← the floating block
...

## Exploration Doc Setup

### Step 1: Derive the topic
### Step 2: Determine the file path
### Step 3: Check if topic needs clarification
### Step 4: Create the document
```

Options for integrating guidance:

- [ ] Renumber the Exploration Doc Setup steps, making guidance `### Step 1` and bumping the rest to 2–5 ← recommended: guidance becomes a proper step in the same heading hierarchy, consistent with the intent of "Step 1 in the natural set of steps"
- [ ] Keep `## Exploration Doc Setup` intact (steps 1–4), move guidance to a dedicated `## Step 1: Load Project Guidance` section before it
- [x] Add a top-level `**Steps**` block to explore.ts, making it consistent with the other five templates, with guidance as Step 1

> **Your answer / freetext:**
> 

## Insights & Decisions

_Decision:_ Guidance moves inside `**Steps**` as Step 1 across all six templates — _Reason:_ As a numbered step it is part of the required flow, not an optional preamble; consistent placement enforces execution.

_Decision:_ In `propose.ts`, the "Parse --exploration flag" step moves from Step 0 to Step 2 — _Reason:_ Guidance must come first ("before anything else"), argument parsing is a detail that follows context loading.

_Decision:_ The "Before anything else, run:" phrasing is removed — _Reason:_ The numbered position already communicates priority; the phrase is redundant inside a step.

_Decision:_ Field descriptions get precision — `context` = "binding project constraints (tech stack, platform requirements, conventions) — apply throughout, do NOT include in outputs"; `instructions` = "workflow-specific overrides for this session if non-null" — _Reason:_ Mirrors the clarity of the `enpalspec instructions` command field descriptions; removes ambiguity about how to apply what's returned.

_Decision:_ `explore.ts` gets a top-level `**Steps**` block added — _Reason:_ Makes it structurally consistent with the other five templates; the existing `## Exploration Doc Setup` steps 1–4 become Steps 2–5 inside it. `## Q&A Rounds`, `## End-of-Session Wrap-Up`, and `## Guardrails` remain as separate sections (they describe ongoing behaviors, not setup steps).

_Decision:_ SkillTemplate/CommandTemplate duplication stays — both blocks are edited per file — _Reason:_ Refactoring the template architecture is out of scope for this change.

_Decision:_ No change to `ff-change.ts`, `new-change.ts`, `sync-specs.ts`, `feedback.ts`, `bulk-archive-change.ts`, `onboard.ts` — only the six templates that already reference guidance are in scope.
