# Exploration: refine-seeded-skills-and-config

**Date:** 2026-04-10
**Linked change:** none

## Context

The user wants to refine two things together: (1) the seeded explore/propose skills, and (2) the config.yaml that is seeded into projects by default. Currently config.yaml can inject context and per-artifact rules into artifact instructions, but there is no equivalent mechanism for skill steps (explore, propose, apply, etc.). The goal is to allow project-specific instructions/context to flow into skill step execution — so teams can amend explore or propose with project-specific conventions. The user also has a colleague's architecture reference to share as example input.

## Notes

<!-- Written at Phase 1 → Phase 2 transition -->

## Rounds

<!-- Q&A questions are appended here before the user answers them -->

## Insights & Decisions

_Decision:_ New CLI command is named `enpalspec guidance <skill-name>`. — _Reason:_ "instructions" was too ambiguous against artifact instructions; "guidance" is distinct and reads naturally.

_Decision:_ `enpalspec guidance <skill-name> --json` returns `{ skill, context, instructions }` — mirroring the artifact instructions shape. `context` carries the shared project context from config.yaml `context:` field; `instructions` carries the skill-specific content from `skills.<skill-name>:`. — _Reason:_ Consistent with how artifact instructions separate context from rules from instruction; AI consumer knows what to do with each field.

_Decision:_ Config key is `skills:`, keyed by skill name (e.g., `skills.explore`, `skills.propose`). All keys pass through without validation — unknown skill names are silently accepted. — _Reason:_ Follows the same passthrough philosophy as `GlobalConfigSchema.passthrough()`; no hardcoded allowlist to maintain.

_Decision:_ The skill calls `enpalspec guidance <skill-name> --json` as its very first step, before any other action. If the command fails, returns nothing, or returns empty fields, the skill continues normally without error. — _Reason:_ Graceful degradation is essential; projects without config shouldn't experience any breakage.

_Decision:_ The seeded default `config.yaml` will include commented-out `skills:` examples to make the feature discoverable. What those examples look like is a separate discussion (tied to init defaults refinement). — _Reason:_ Scoped out to keep this change focused.

_Decision:_ Skill refinements (explore/propose behaviour improvements) and init defaults (better seeded config.yaml content) are separate follow-up explorations. — _Reason:_ User explicitly scoped them out to keep this change focused.

## Open Questions

- What do the commented-out `skills:` examples in the seeded config.yaml look like? (deferred to init defaults exploration)
- Should `enpalspec guidance` warn if `openspec/config.yaml` exists but has no `skills:` key, or stay fully silent? (likely silent — no action needed)
