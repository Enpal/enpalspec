## Why

The "Load Project Guidance" step is floated as a disconnected preamble ("Step 0") above the `**Steps**` block in every workflow template, making it easy for an AI agent to treat it as optional context rather than a required step. The language for applying the guidance output is also vague — "use as project background" and "treat as additional guidance" do not tell the agent what to do differently from normal behaviour.

## What Changes

- Move the guidance block from a floating preamble into `**Steps**` as Step 1 in all six workflow templates: `propose.ts`, `apply-change.ts`, `explore.ts`, `verify-change.ts`, `archive-change.ts`, `continue-change.ts`
- Renumber all subsequent steps accordingly
- In `propose.ts`, the existing "Step 0: Parse --exploration flag" becomes Step 2 (guidance always comes first)
- Replace vague field-application language with precise role definitions: `context` = binding project constraints to apply throughout the session (not included in outputs); `instructions` = workflow-specific overrides for this session if non-null
- Remove the "Before anything else, run:" phrasing — position as Step 1 communicates priority
- Add a top-level `**Steps**` block to `explore.ts` (currently uses subsections under `## Exploration Doc Setup`); the existing steps 1–4 become Steps 2–5; `## Q&A Rounds`, `## End-of-Session Wrap-Up`, and `## Guardrails` remain as sections
- Apply changes to both `SkillTemplate.instructions` and `CommandTemplate.content` in each file (12 blocks total)
- Update the guidance-fetching requirement language in `propose-skill-workflow` and `explore-skill-workflow` specs to use the same precision

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `propose-skill-workflow`: Update the guidance-fetching requirement to specify precise field roles (`context` = binding constraints, `instructions` = workflow overrides) and to require guidance as Step 1 in the numbered **Steps** sequence
- `explore-skill-workflow`: Same update as propose-skill-workflow

## Impact

- `src/core/templates/workflows/propose.ts` — SkillTemplate and CommandTemplate
- `src/core/templates/workflows/apply-change.ts` — SkillTemplate and CommandTemplate
- `src/core/templates/workflows/explore.ts` — SkillTemplate and CommandTemplate
- `src/core/templates/workflows/verify-change.ts` — SkillTemplate and CommandTemplate
- `src/core/templates/workflows/archive-change.ts` — SkillTemplate and CommandTemplate
- `src/core/templates/workflows/continue-change.ts` — SkillTemplate and CommandTemplate
- `openspec/specs/propose-skill-workflow/spec.md` — delta spec for guidance requirement
- `openspec/specs/explore-skill-workflow/spec.md` — delta spec for guidance requirement
- Downstream: any project that runs `enpalspec update` will receive the updated templates
- Tests: parity tests that hash template content will need updating after the change
