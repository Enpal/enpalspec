## 1. Config Schema & Parsing

- [x] 1.1 Add `skills` field to `ProjectConfigSchema` in `src/core/project-config.ts` as `z.record(z.string(), z.string()).optional()`
- [x] 1.2 Add `skills` to `ProjectConfig` type
- [x] 1.3 Implement resilient `skills` field parsing in `readProjectConfig()` — iterate entries, parse each value as string, warn and skip non-string values
- [x] 1.4 Add unit tests for `skills` field parsing in config loading tests (valid map, missing key, non-string value, non-object value)

## 2. Guidance Command

- [x] 2.1 Create `src/commands/guidance.ts` with `guidanceCommand(skillName, options)` — reads project config, returns `{ skill, context, instructions }`
- [x] 2.2 Implement `--json` flag: output JSON to stdout; without flag, print labelled sections (omit null fields)
- [x] 2.3 Wire `enpalspec guidance <skill-name>` into CLI entry point `src/cli/index.ts`
- [x] 2.4 Add unit tests for guidance command: config with both fields, context only, instructions only, no config, invalid YAML
- [x] 2.5 Add CLI integration test for `enpalspec guidance explore --json`

## 3. Skill Template Updates

- [x] 3.1 Update `getExploreSkillTemplate()` in `src/core/templates/workflows/explore.ts` — add guidance call as first step with graceful fallback instructions
- [x] 3.2 Update `getOpsxExploreCommandTemplate()` in `src/core/templates/workflows/explore.ts` — same guidance call
- [x] 3.3 Update `getOpsxProposeSkillTemplate()` in `src/core/templates/workflows/propose.ts` — add guidance call as first step
- [x] 3.4 Update `getOpsxProposeCommandTemplate()` in `src/core/templates/workflows/propose.ts` — same guidance call
- [x] 3.5 Update `apply-change.ts` skill and command templates — add guidance call as first step
- [x] 3.6 Update `archive-change.ts` skill and command templates — add guidance call as first step
- [x] 3.7 Update `verify-change.ts` skill and command templates — add guidance call as first step
- [x] 3.8 Update `onboard.ts` skill and command templates — add guidance call as first step
- [x] 3.9 Update `continue-change.ts` skill and command templates — add guidance call as first step

## 4. Seeded Config Template

- [x] 4.1 Update `serializeConfig()` or equivalent in `src/core/init.ts` — seeded `config.yaml` gains a commented-out `skills:` section with placeholder examples

## 5. Spec Validation

- [x] 5.1 Run `enpalspec validate` to confirm all new and modified specs are structurally valid
- [x] 5.2 Verify `enpalspec guidance --help` output is correct
- [x] 5.3 Manual smoke test: add `skills.explore: "test instruction"` to config, invoke explore skill, confirm instructions are applied
