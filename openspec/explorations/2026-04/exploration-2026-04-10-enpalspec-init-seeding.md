---
# Exploration: enpalspec-init-seeding

**Date:** 2026-04-10
**Linked change:** none

## Context

The user wants `enpalspec init` to seed real content into `config.yaml` — tech stack, per-artifact rules, and per-skill guidance — rather than leaving everything commented-out. The motivation is "so other tools can call this", suggesting the init command needs a programmatic path (flags, not just interactive prompts) that external tooling can invoke to bootstrap a project with meaningful guidance already in place.

The `guidance` command (`src/commands/guidance.ts`) and the `skills:` config key are already implemented. The `serializeConfig` function in `config-prompts.ts` accepts a `Partial<ProjectConfig>` but currently only uses `schema`. The init flow creates `config.yaml` via `createConfig()`, which calls `serializeConfig({ schema: DEFAULT_SCHEMA })`.

## Notes

<!-- Written at Phase 1 → Phase 2 transition -->

## Rounds

<!-- Q&A questions are appended here before the user answers them -->

## Insights & Decisions

_Decision:_ New flag `--config <file>` on `enpalspec init`. Accepts a path to a YAML seed file. — _Reason:_ "other tools" (scripts, CI, repo templates) need a single machine-friendly flag; a file is easier to compose than multiple inline flags for structured fields like rules/skills.

_Decision:_ Seed file format mirrors config.yaml keys (`context`, `rules`, `skills`) — no `schema` field needed, init always sets that itself. — _Reason:_ Zero new format to learn; callers can copy the relevant portion of any config.yaml.

_Decision:_ Interactive mode prompts for context with a simple one-line input (Enter to skip). Rules and skills are not prompted — edit config.yaml manually. — _Reason:_ Context is the most common seed value and fits a one-liner; rules/skills are structured enough that an editor is the better UX.

_Decision:_ If `config.yaml` already exists (extend mode / re-init) and `--config` was passed, skip seeding but emit a visible warning. — _Reason:_ Existing config always wins (no surprise overwrites), but the caller should know their seed file was ignored.

_Decision:_ `serializeConfig()` already accepts `Partial<ProjectConfig>` — it just needs to write real YAML values when context/rules/skills are present, not just comment-only blocks. — _Reason:_ The plumbing is already there; this is purely a serialisation gap to close.

## Open Questions

- Should the interactive context prompt appear even when `--tools` is passed (non-interactive flag)? Likely no — if the caller is scripting, they'd use `--config` instead. Keep the prompt gated on `canPromptInteractively()`.
