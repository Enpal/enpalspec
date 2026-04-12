## Context

Six workflow templates in `src/core/templates/workflows/` each contain a "Load Project Guidance" block. This block calls `enpalspec guidance <workflow> --json` and tells the agent how to use the result. Currently the block is prepended as a floating `## Step 0` preamble above the `**Steps**` section, and the field-application instructions are vague. The change is purely textual — no CLI behaviour changes, no new commands, no data model changes.

## Goals / Non-Goals

**Goals:**
- Guidance block becomes Step 1 inside `**Steps**` in all six templates (SkillTemplate + CommandTemplate per file)
- Field descriptions become precise: `context` = binding constraints (apply throughout, not in outputs); `instructions` = workflow-specific overrides if non-null
- "Before anything else, run:" phrasing removed
- `explore.ts` gains a top-level `**Steps**` block; existing doc-setup steps 1–4 become Steps 2–5
- `propose.ts` "Parse --exploration flag" moves from Step 0 to Step 2
- Matching spec updates for `propose-skill-workflow` and `explore-skill-workflow`

**Non-Goals:**
- Changing the `enpalspec guidance` CLI command behaviour
- Refactoring the SkillTemplate/CommandTemplate duplication pattern
- Updating templates that don't currently have guidance (`ff-change.ts`, `new-change.ts`, `sync-specs.ts`, `feedback.ts`, `bulk-archive-change.ts`, `onboard.ts`)
- Adding guidance requirements to apply/verify/archive/continue specs (no existing spec for this)

## Decisions

### Guidance as Step 1, not preamble

The floating `## Step 0` pattern allows agents to treat guidance as optional context. Making it Step 1 inside `**Steps**` places it in the required execution sequence.

Alternative considered: keep it as a preamble but make it more prominent (e.g., add a MUST NOT skip note). Rejected — structural position is more reliable than emphasis language.

### Precise field descriptions

Replace "use as project background" / "treat as additional guidance" with role-specific language:
- `context`: Binding project constraints — tech stack, platform requirements, conventions. Apply throughout. Do NOT include in outputs.
- `instructions`: Workflow-specific overrides for this session (apply only if non-null).

Modelled directly on how `enpalspec instructions` fields are documented in the templates.

### explore.ts gets a `**Steps**` block

`explore.ts` currently uses `## Exploration Doc Setup` with `### Step 1–4` subsections instead of a flat `**Steps**` block. Adding a `**Steps**` block makes all six templates structurally consistent. The existing subsection steps become Steps 2–5 within `**Steps**`; `## Q&A Rounds`, `## End-of-Session Wrap-Up`, and `## Guardrails` remain as top-level sections (they describe ongoing behaviors, not setup steps).

Alternative considered: renumber within `## Exploration Doc Setup`. Rejected — inconsistency with the other five templates would persist.

### propose.ts step renumbering

propose.ts currently has two Step 0s (guidance preamble + "Parse --exploration flag" inside **Steps**). With guidance as Step 1, "Parse --exploration flag" becomes Step 2, and the rest shift up by one.

## Risks / Trade-offs

- **Parity tests will fail** → All parity tests hash template content; they must be updated after this change. This is expected and intentional.
- **Downstream projects** → Projects that have already installed the templates won't be affected until they run `enpalspec update`. The change is backward-compatible (guidance command behaviour is unchanged).
- **12 blocks to edit** → Six files × two blocks (SkillTemplate + CommandTemplate). Risk of inconsistency between the two blocks in a file. Mitigated by updating both blocks in the same edit pass per file.
