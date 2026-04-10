## Why

`config.yaml` can already inject project context and per-artifact rules into artifact instructions, but there is no equivalent mechanism for skill steps (explore, propose, apply, etc.). Teams cannot amend skill behaviour with project-specific conventions without modifying the seeded skill files directly, which get overwritten on the next `enpalspec init --refresh`.

## What Changes

- **New CLI command** `enpalspec guidance <skill-name> [--json]`: reads `config.yaml` and returns the shared project `context` plus any skill-specific `instructions` from a new `skills:` key.
- **New `skills:` key in `config.yaml`**: a free-form map of skill name → instruction string. All keys pass through without validation.
- **Updated seeded skills** (explore, propose, apply, archive, verify, onboard, continue): each skill calls `enpalspec guidance <skill-name> --json` as its very first step. If the command fails or returns empty fields, the skill continues normally.
- **Updated seeded `config.yaml` template**: the default scaffold gains a commented-out `skills:` section so the feature is discoverable on first init.

## Capabilities

### New Capabilities

- `skill-guidance-command`: The `enpalspec guidance <skill-name>` CLI command — reads `config.yaml` and returns `{ skill, context, instructions }`. `context` is the shared project context field; `instructions` is the value of `skills.<skill-name>` if present.

### Modified Capabilities

- `config-loading`: The `ProjectConfigSchema` and `readProjectConfig` gain a `skills` field — a `Record<string, string>` map of skill name to instruction string. Unknown keys are accepted (no validation).
- `explore-skill-workflow`: Seeded explore skill and command gain a guidance call as the first step.
- `propose-skill-workflow`: Seeded propose skill and command gain a guidance call as the first step.

## Impact

- `src/core/project-config.ts` — schema and parser updated for `skills:` field
- `src/commands/` — new `guidance.ts` command wired into CLI
- `src/core/templates/workflows/explore.ts` — skill and command templates updated
- `src/core/templates/workflows/propose.ts` — skill and command templates updated
- `src/core/templates/workflows/apply-change.ts`, `archive-change.ts`, `verify-change.ts`, `onboard.ts`, `continue-change.ts` — guidance call added
- `src/core/init.ts` — seeded `config.yaml` template updated with commented `skills:` section
- No breaking changes to existing config files; `skills:` is optional and additive
