## 1. Update apply, verify, archive, continue templates

These four templates share the same simple pattern: remove the floating `## Step 0: Load Project Guidance` preamble, add guidance as Step 1 inside the `**Steps**` block with precise field descriptions, and renumber the existing steps (1→2, 2→3, …). Each file has both SkillTemplate (`instructions`) and CommandTemplate (`content`) — update both.

- [x] 1.1 Update `apply-change.ts` SkillTemplate: remove preamble, add Step 1 inside **Steps**, renumber Steps 1–7 → 2–8
- [x] 1.2 Update `apply-change.ts` CommandTemplate: same structural change as SkillTemplate
- [x] 1.3 Update `verify-change.ts` SkillTemplate: remove preamble, add Step 1 inside **Steps**, renumber Steps 1–8 → 2–9
- [x] 1.4 Update `verify-change.ts` CommandTemplate: same structural change as SkillTemplate
- [x] 1.5 Update `archive-change.ts` SkillTemplate: remove preamble, add Step 1 inside **Steps**, renumber Steps 1–6 → 2–7
- [x] 1.6 Update `archive-change.ts` CommandTemplate: same structural change as SkillTemplate
- [x] 1.7 Update `continue-change.ts` SkillTemplate: remove preamble, add Step 1 inside **Steps**, renumber Steps 1–4 → 2–5
- [x] 1.8 Update `continue-change.ts` CommandTemplate: same structural change as SkillTemplate

## 2. Update propose.ts (two-step-zero fix)

propose.ts has two Step 0s — the floating guidance preamble and "Parse --exploration flag" inside `**Steps**`. Remove the preamble, add guidance as Step 1, promote `--exploration` parsing to Step 2, and renumber the rest (1→3, 2→4, …, 7→9).

- [x] 2.1 Update `propose.ts` SkillTemplate: remove preamble, add Step 1 inside **Steps**, rename "Step 0: Parse --exploration flag" to Step 2, renumber Steps 1–7 → 3–9
- [x] 2.2 Update `propose.ts` CommandTemplate: same structural change as SkillTemplate

## 3. Update explore.ts (add **Steps** block)

explore.ts currently has `## Exploration Doc Setup` with `### Step 1–4` subsections instead of a flat `**Steps**` block. Remove the floating guidance preamble. Add a top-level `**Steps**` block containing: Step 1 (guidance), and Steps 2–5 (the former doc-setup steps 1–4 promoted into the block). The `## Exploration Doc Setup` heading is removed; its content folds into `**Steps**`. The `## Q&A Rounds`, `## End-of-Session Wrap-Up`, `## EnpalSpec Awareness`, and `## Guardrails` sections remain unchanged.

- [x] 3.1 Update `explore.ts` SkillTemplate: remove preamble and `## Exploration Doc Setup` heading, add `**Steps**` block with guidance as Step 1 and doc-setup steps as Steps 2–5
- [x] 3.2 Update `explore.ts` CommandTemplate: same structural change as SkillTemplate

## 4. Update parity tests

Template content hashes will change. Run the parity tests to identify which snapshots fail, then update them.

- [x] 4.1 Run parity tests and capture the failing hashes
- [x] 4.2 Update snapshot/hash values in the parity test file(s) to match the new template content
- [x] 4.3 Run the full test suite to confirm all tests pass
