 ## Context

enpalspec is a fork of openspec. The `package.json` bin field already exposes the binary as `enpalspec`, but the internal skill names, CLI program name, and command text still use `openspec`. This means users who run `enpalspec init` get skills installed into `openspec-*` directories, see `Usage: openspec` in help output, and read `openspec list` instructions inside their installed skills.

The changes are pure renames — no new logic, no new APIs, no data model changes.

## Goals / Non-Goals

**Goals:**
- All generated skill directory names use `enpalspec-*` prefix
- All CLI invocations inside templates and command files use `enpalspec`
- The CLI program name shows `enpalspec` in help and error output
- The `SKILL_NAMES` array and `WORKFLOW_TO_SKILL_DIR` maps are consistent with the new names

**Non-Goals:**
- Renaming the `openspec/` data directory on disk
- Renaming `bin/openspec.js` (internal file, not user-visible)
- Changing `legacy-cleanup.ts` detection patterns — those globs (`openspec-*.md`) must remain to clean up files installed by the upstream openspec tool on other AI tools (cursor, windsurf, etc.)
- Renaming schema format strings (`'openspec'`, `'openspec-change'`) — internal data format identifiers
- Renaming global config/data dir names (`~/.config/openspec/`) — separate migration concern
- Updating shell completion function names (`_openspec_*`) — cosmetic, separate concern

## Decisions

**Rename all skill `name:` and `dirName` values in one pass**

Every workflow template in `src/core/templates/workflows/*.ts` has a `name: 'openspec-*'` field. Every `dirName` in `src/core/shared/skill-generation.ts` uses `openspec-*`. These are the source of truth — rename them all to `enpalspec-*`. The `SKILL_NAMES` array in `tool-detection.ts` and both `WORKFLOW_TO_SKILL_DIR` maps must match exactly.

Note: there are two `WORKFLOW_TO_SKILL_DIR` maps — one in `src/core/init.ts` and one in `src/core/profile-sync-drift.ts`. Both must be updated. The one in `init.ts` is a local duplicate; long-term it could be removed in favour of the one in `profile-sync-drift.ts`, but that's out of scope here.

**Replace `openspec` CLI invocations in templates and commands with `enpalspec`**

All template content (in `src/core/templates/workflows/*.ts`) that says `openspec list`, `openspec status`, `openspec new`, `openspec instructions`, `openspec feedback` gets replaced with `enpalspec`. Same for `.claude/commands/enpalspec/*.md` and `.claude/commands/opsx/*.md`. This is the text that ends up inside installed SKILL.md files and slash command files — it must match the actual binary name.

**Update `.name('openspec')` in Commander program**

`src/cli/index.ts` calls `.name('openspec')` on the Commander program. This controls `Usage: openspec ...` in help and error messages. Changing to `.name('enpalspec')` makes help output consistent with the actual binary.

## Risks / Trade-offs

**Stale installed skills on existing users' machines**
- [Risk] Users who already ran `enpalspec init` have `openspec-*` skill directories installed. After this change, `enpalspec init` will generate `enpalspec-*` directories, but the old ones won't be auto-removed.
- Mitigation: `profile-sync-drift.ts` detects drift between installed skills and expected skills. Re-running `enpalspec init` (or `enpalspec update`) will install the new `enpalspec-*` skills. The old `openspec-*` directories become orphans — a future cleanup pass can remove them via `legacy-cleanup.ts`.

**Two `WORKFLOW_TO_SKILL_DIR` maps must stay in sync**
- [Risk] The duplicate map in `init.ts` can silently diverge from the one in `profile-sync-drift.ts`.
- Mitigation: Update both in this change. Deduplication is tracked separately.
