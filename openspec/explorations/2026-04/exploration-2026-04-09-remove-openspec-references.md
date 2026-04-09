---
date: 2026-04-09
topic: remove-openspec-references
status: active
---

# Exploration: Remove Leftover openspec References

## Context

enpalspec is a fork of openspec. The skills and commands in this repo still contain
leftover references to `openspec` — in names, paths, commands, and text. This exploration
investigates what those references are, which are easy to fix, and how to approach
cleaning them up.

## Rounds

No formal Q&A rounds — scope was clarified conversationally.

## Insights & Decisions

- **Binary is already `enpalspec`** — `package.json` bin field already maps `enpalspec` → `./bin/openspec.js`. No bin rename needed.
- **`.claude/skills/openspec-*/` are installed output** — generated on `enpalspec init`, not source. Ignore them; they'll be correct once source is fixed.
- **`openspec/` folder on disk stays** — the data directory name is not being renamed.
- **`bin/openspec.js` filename stays** — internal only, not user-visible, not worth touching.
- **Tier 3 (CLI `.name()`) is in scope** — `src/cli/index.ts` `.name('openspec')` shows in help text; should be `enpalspec`.
- **`legacy-cleanup.ts` detection patterns stay** — those `openspec-*.md` globs are for cleaning up old installed files from users who had the upstream openspec; they must remain `openspec-*`.

### Files to change

**Skill name/identity (source of truth for installed skills):**
- `src/core/templates/workflows/*.ts` — `name: 'openspec-*'` → `'enpalspec-*'`
- `src/core/shared/skill-generation.ts` — `dirName: 'openspec-*'` → `'enpalspec-*'`
- `src/core/shared/tool-detection.ts` — `SKILL_NAMES` array entries
- `src/core/init.ts` — `WORKFLOW_TO_SKILL_DIR` mapping values
- `src/core/profile-sync-drift.ts` — `WORKFLOW_TO_SKILL_DIR` mapping values (duplicate)

**CLI command text in templates/commands:**
- `src/core/templates/workflows/*.ts` — `openspec list/status/new/instructions` → `enpalspec`; cross-refs `openspec-sync-specs`, `openspec-continue-change` → `enpalspec-*`
- `src/core/shared/skill-generation.ts` — default `'Requires openspec CLI.'` and `author: 'openspec'`
- `.claude/commands/enpalspec/*.md` — `openspec` CLI calls → `enpalspec`
- `.claude/commands/opsx/*.md` — `openspec` CLI calls → `enpalspec`

**CLI program name:**
- `src/cli/index.ts` — `.name('openspec')` → `.name('enpalspec')`, user-facing strings

## Open Questions

- None — scope is fully defined.
