## Context

`enpalspec init` creates `openspec/config.yaml` via `serializeConfig({ schema: DEFAULT_SCHEMA })`. The function already accepts `Partial<ProjectConfig>` (which includes `context`, `rules`, and `skills`), but the call site only ever passes `schema`. Everything is comments in the output file.

Callers that want real content seeded today have no option — they must post-edit `config.yaml` themselves after init. This change adds a `--config <file>` flag and an interactive context prompt to close that gap.

## Goals / Non-Goals

**Goals:**
- `--config <file>` flag reads a YAML seed file and seeds `context`, `rules`, and `skills` into the generated `config.yaml`
- Interactive mode prompts for project context (one-line, skippable) when no seed file is provided
- `serializeConfig()` emits real YAML values for any fields present, comment blocks only for absent fields
- Warn (but continue) when `--config` is passed and `config.yaml` already exists

**Non-Goals:**
- `--config` does not overwrite an existing `config.yaml` (no merge, no force)
- `--context` as a direct inline string flag (use seed file or interactive prompt instead)
- Interactive prompts for `rules` or `skills` (too structured for a one-liner)
- Validation of seed file field values beyond what `readProjectConfig` already does

## Decisions

**D1: Seed file format mirrors config.yaml (minus `schema`)**

The seed file uses the same YAML keys as `config.yaml`: `context`, `rules`, `skills`. No new format, no new schema. `schema` is ignored if present (init always sets it from `DEFAULT_SCHEMA`).

_Alternative considered_: A separate seed-specific format. Rejected — extra learning burden for no benefit.

**D2: Parse seed file using existing `readProjectConfig` infrastructure**

Rather than writing a new YAML parser, read the seed file by temporarily pointing `readProjectConfig` at the seed path, or by extracting the field-parsing logic into a shared helper. Both avoid duplicating the resilient field-by-field validation logic.

_Preferred approach_: Extract the inner parsing logic into a `parseConfigFields(raw: unknown): Partial<ProjectConfig>` helper that both `readProjectConfig` and the seed file reader call. This keeps the resilient validation in one place.

**D3: Interactive prompt gated on `canPromptInteractively()`**

The context prompt only appears when the session is already interactive (same gate used for tool selection). If `--tools` is passed or stdin is not a TTY, no prompt — callers use `--config` instead.

The prompt is a single `@inquirer/prompts` `input()` call. Empty answer → no context seeded.

**D4: Warning on skip, not error**

When `--config` is passed but `config.yaml` already exists, emit a `chalk.yellow` warning line and continue. This keeps `init --force` re-runs predictable and non-destructive.

**D5: `serializeConfig()` writes real values when present, comments when absent**

For each of `context`, `rules`, `skills`: if the value is present in the input, write it as live YAML; if absent, write the existing comment block. This means partial seeds work correctly (e.g., seed only `context`, still get comment examples for `rules` and `skills`).

## Risks / Trade-offs

- **Seed file parsing errors** → Mitigation: reuse existing resilient parsing; unknown or invalid fields are silently ignored, valid fields are written. A completely unparseable file emits a warning and falls back to comment-only output.
- **`schema` key in seed file** → Mitigation: ignore it; `DEFAULT_SCHEMA` always wins. Document in help text.
- **Interactive prompt adds a new step to interactive init** → Mitigation: it's the last step before success output, and Enter skips it immediately. Existing users see one extra prompt.
- **`--config` flag name conflicts with `enpalspec config` subcommand** → Not a conflict; `--config` is a flag on `init`, not a positional. Commander.js handles this correctly.

## Migration Plan

No migration needed. The change is purely additive:
- `--config` flag is optional; existing callers unaffected
- Interactive prompt is skippable; existing interactive users see one new optional step
- `serializeConfig()` is backwards-compatible; callers passing only `schema` get identical output

## Open Questions

- Should the interactive context prompt appear before or after tool selection? (Suggested: after — tool selection is the primary decision; context is secondary config enrichment.)
