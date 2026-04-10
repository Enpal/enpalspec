## Why

Scripts and other tools that call `enpalspec init` have no way to seed real content into `config.yaml` — the generated file contains only commented-out examples. Teams adopting EnpalSpec through automated onboarding or repo templates need a way to pre-populate context, rules, and skill guidance at init time.

## What Changes

- New `--config <file>` flag on `enpalspec init`: reads a YAML seed file (`context`, `rules`, `skills`) and writes real values into the generated `config.yaml`
- New optional interactive prompt during init: asks for project context (one-line, Enter to skip), only shown in interactive mode
- `serializeConfig()` updated to emit real YAML values for any fields provided, keeping comment blocks only for absent fields
- If `config.yaml` already exists and `--config` was passed, seeding is skipped with a visible warning (existing config always wins)

## Capabilities

### New Capabilities

- `init-config-seeding`: Ability to seed `context`, `rules`, and `skills` into `config.yaml` at init time via a `--config <file>` flag or interactive prompt

### Modified Capabilities

- `cli-init`: New `--config <file>` option added to the init command; new optional interactive context prompt

## Impact

- `src/cli/index.ts`: add `--config <file>` option to init command
- `src/core/init.ts`: read and parse seed file, add interactive context prompt, pass seed data through to `createConfig()`
- `src/core/config-prompts.ts`: `serializeConfig()` writes real YAML when values provided
- `openspec/specs/cli-init/spec.md`: delta — new `--config` flag behaviour and interactive prompt behaviour
