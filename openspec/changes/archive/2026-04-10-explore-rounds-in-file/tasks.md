## 1. Update Seeded Template Strings

- [x] 1.1 In `getExploreSkillTemplate()` (`src/core/templates/workflows/explore.ts`): remove the Phase 1 → Phase 2 transition section entirely; replace with the document-first session model — on invocation the assistant writes Observations + Round 1 to the file in one shot
- [x] 1.2 In `getExploreSkillTemplate()`: remove the Phase 1 free-form exploration section and Phase 1 question discipline rule
- [x] 1.3 In `getExploreSkillTemplate()`: add vague topic clarification flow — if topic is too vague, ask clarifying questions in chat (one at a time, biggest blast radius first) before writing to doc
- [x] 1.4 In `getExploreSkillTemplate()`: update chat role — after first doc write, post a full findings digest (3–5 bullets) in chat; after each answered round, post a decision summary before writing the next round
- [x] 1.5 In `getExploreSkillTemplate()`: update the initial exploration doc template — replace `## Notes` with `## Observations` (placeholder: `<!-- Written by assistant before Round 1 -->`); remove `## Open Questions` section
- [x] 1.6 In `getExploreSkillTemplate()`: update the end-of-session section — write `## Insights & Decisions` only (no `## Open Questions`); if questions remain, ask them as a final round
- [x] 1.7 Apply the same changes (1.1–1.6) to `getOpsxExploreCommandTemplate()` — both templates must stay in sync

## 2. Update OpenSpec Specs

- [x] 2.1 Apply the delta from `openspec/changes/explore-rounds-in-file/specs/explore-skill-workflow/spec.md` into `openspec/specs/explore-skill-workflow/spec.md` — merge MODIFIED requirements, apply REMOVED requirements (delete Phase 1, Phase 1→2 transition, Phase 1 question discipline)
- [x] 2.2 Apply the delta from `openspec/changes/explore-rounds-in-file/specs/exploration-docs/spec.md` into `openspec/specs/exploration-docs/spec.md` — merge MODIFIED doc structure, apply REMOVED Notes section requirement

## 3. Verify

- [x] 3.1 Read both updated template functions and confirm no Phase 1 / Phase 2 language remains
- [x] 3.2 Read both templates and confirm Observations section (not Notes) is in the embedded doc template
- [x] 3.3 Read both templates and confirm vague topic clarification flow is present
- [x] 3.4 Read both templates and confirm chat posts a full findings digest (not just a navigation prompt)
- [x] 3.5 Read both templates and confirm end-of-session writes Insights & Decisions only (no Open Questions)
- [x] 3.6 Confirm `getExploreSkillTemplate` and `getOpsxExploreCommandTemplate` are consistent
- [x] 3.7 Read `openspec/specs/explore-skill-workflow/spec.md` and confirm Phase 1 requirements removed, document-first requirements present
- [x] 3.8 Read `openspec/specs/exploration-docs/spec.md` and confirm Notes section removed, Observations section and no-Open-Questions present
- [x] 3.9 Run tests and update parity hashes if needed
