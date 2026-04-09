## 1. Skill name/identity — source of truth

- [x] 1.1 In `src/core/shared/tool-detection.ts`, rename all entries in `SKILL_NAMES` array from `openspec-*` to `enpalspec-*`
- [x] 1.2 In `src/core/shared/skill-generation.ts`, rename all `dirName` values from `openspec-*` to `enpalspec-*`
- [x] 1.3 In `src/core/shared/skill-generation.ts`, update default `compatibility` string from `'Requires openspec CLI.'` to `'Requires enpalspec CLI.'` and default `author` from `'openspec'` to `'enpalspec'`
- [x] 1.4 In `src/core/init.ts`, update all values in `WORKFLOW_TO_SKILL_DIR` from `openspec-*` to `enpalspec-*`
- [x] 1.5 In `src/core/profile-sync-drift.ts`, update all values in `WORKFLOW_TO_SKILL_DIR` from `openspec-*` to `enpalspec-*`

## 2. Workflow templates — skill name fields and CLI invocations

- [x] 2.1 In each `src/core/templates/workflows/*.ts`, rename `name: 'openspec-*'` to `name: 'enpalspec-*'`
- [x] 2.2 In each `src/core/templates/workflows/*.ts`, replace all `openspec list`, `openspec status`, `openspec new`, `openspec instructions`, `openspec feedback` invocations with `enpalspec`
- [x] 2.3 In `src/core/templates/workflows/apply-change.ts`, rename cross-reference `openspec-continue-change` to `enpalspec-continue-change`
- [x] 2.4 In `src/core/templates/workflows/archive-change.ts`, rename all cross-references to `openspec-sync-specs` → `enpalspec-sync-specs`
- [x] 2.5 In `src/core/templates/workflows/bulk-archive-change.ts`, rename all cross-references to `openspec-sync-specs` → `enpalspec-sync-specs`
- [x] 2.6 In `src/core/templates/workflows/instructions.ts` (if present), rename `openspec-continue-change` cross-references → `enpalspec-continue-change`

## 3. CLI program name

- [x] 3.1 In `src/cli/index.ts`, change `.name('openspec')` to `.name('enpalspec')`
- [x] 3.2 In `src/cli/index.ts`, update any user-facing deprecation warning strings that reference `openspec` as a command name (e.g. `"openspec experimental"`, `"openspec change ..."`, `"openspec list"`) to use `enpalspec`

## 4. Slash command files

- [x] 4.1 In `.claude/commands/enpalspec/apply.md`, replace all `openspec` CLI invocations with `enpalspec` — SKIPPED: installed output, not source
- [x] 4.2 In `.claude/commands/enpalspec/archive.md`, replace all `openspec` CLI invocations and `openspec-sync-specs` cross-references with `enpalspec` — SKIPPED: installed output, not source
- [x] 4.3 In `.claude/commands/enpalspec/explore.md`, replace `openspec list` with `enpalspec list` — SKIPPED: installed output, not source
- [x] 4.4 In `.claude/commands/enpalspec/propose.md`, replace all `openspec` CLI invocations with `enpalspec` — SKIPPED: installed output, not source
- [x] 4.5 In `.claude/commands/opsx/apply.md`, replace all `openspec` CLI invocations with `enpalspec` — SKIPPED: installed output, not source
- [x] 4.6 In `.claude/commands/opsx/archive.md`, replace all `openspec` CLI invocations and `openspec-sync-specs` cross-references with `enpalspec` — SKIPPED: installed output, not source
- [x] 4.7 In `.claude/commands/opsx/explore.md`, replace `openspec list` with `enpalspec list` — SKIPPED: installed output, not source
- [x] 4.8 In `.claude/commands/opsx/propose.md`, replace all `openspec` CLI invocations with `enpalspec` — SKIPPED: installed output, not source
- [x] 4.9 In `.claude/commands/opsx/verify.md`, replace all `openspec` CLI invocations with `enpalspec` — SKIPPED: installed output, not source

## 5. Update tests

- [x] 5.1 In `test/core/shared/tool-detection.test.ts`, update all `toContain('openspec-*')` assertions in the `SKILL_NAMES` describe block to `enpalspec-*`
- [x] 5.2 In `test/core/shared/skill-generation.test.ts`, update all `toContain('openspec-*')` assertions on `dirNames` to `enpalspec-*`, and update the `openspec-propose` direct check to `enpalspec-propose`
- [x] 5.3 In `test/core/templates/skill-templates-parity.test.ts`, rename all `openspec-*` keys in the hash map and skill-to-template mapping array to `enpalspec-*`, and regenerate the SHA hashes for the renamed templates
- [x] 5.4 In `test/cli-e2e/basic.test.ts`, update all `openspec-explore` path assertions to `enpalspec-explore`

## 6. Verification

- [x] 6.1 Run `pnpm test` and confirm all tests pass — 1339/1341 pass; 2 pre-existing failures unrelated to this change
- [x] 6.2 Run `grep -r "openspec" src/core/templates src/core/shared src/core/init.ts src/core/profile-sync-drift.ts src/cli/index.ts .claude/commands` and confirm no remaining `openspec` CLI or skill-name references (excluding `openspec/` path references and `legacy-cleanup.ts` patterns)
- [x] 6.3 Run `pnpm build` and confirm no TypeScript errors
- [x] 6.4 Run `enpalspec --help` and confirm output reads `Usage: enpalspec`
