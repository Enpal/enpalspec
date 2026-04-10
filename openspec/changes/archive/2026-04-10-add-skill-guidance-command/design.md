## Context

`config.yaml` currently injects project context and per-artifact rules into artifact instructions via `enpalspec instructions <id> --json`. The `generateInstructions()` function in `src/core/artifact-graph/instruction-loader.ts` reads `readProjectConfig()` and returns `context` and `rules` as separate fields. Seeded skills (explore, propose, apply, etc.) in `src/core/templates/workflows/*.ts` are static string templates — there is no equivalent runtime injection path.

Seeded skills are written once to `.claude/skills/enpalspec-*/skill.md` and `.claude/commands/enpalspec/*.md` at `enpalspec init` time. They don't call the CLI at startup beyond `enpalspec list --json`. Any project-specific guidance must either be baked in at seed time (stale on config change) or fetched at runtime by the skill itself.

## Goals / Non-Goals

**Goals:**
- New `enpalspec guidance <skill-name> [--json]` command that reads `config.yaml` and returns `{ skill, context, instructions }`
- New `skills:` key in `ProjectConfigSchema` — a `Record<string, string>` map of skill name → instruction string, all keys pass through without validation
- Seeded skills (all of them) call `enpalspec guidance <skill-name> --json` as their very first step, gracefully ignoring failures or empty responses
- Seeded `config.yaml` template gains a commented-out `skills:` section

**Non-Goals:**
- Skill behaviour refinements (separate exploration)
- Improvements to the default `config.yaml` content seeded at init (separate exploration)
- Validation of skill names against a known allowlist

## Decisions

**Command name: `enpalspec guidance <skill-name>`**
"instructions" was too ambiguous against `enpalspec instructions <artifact-id>`. "guidance" is distinct and reads naturally: "get guidance for explore".

**Return shape mirrors artifact instructions**
`{ skill: string, context?: string, instructions?: string }` — `context` is the shared `config.yaml` `context:` field (same field already used by artifact instructions); `instructions` is the value of `skills.<skill-name>` if present. Both are optional — the command always returns 200 with an empty-fields object if nothing is configured.

Alternative considered: return only the skill-specific `instructions` field, omitting `context`. Rejected — the skill already uses context to understand the project; having it in one call is more convenient and mirrors the artifact instructions pattern exactly.

**`skills:` key is a flat string map, no validation**
`skills: Record<string, string>` — any skill name is accepted. Unknown keys are silently ignored (passthrough). Consistent with `GlobalConfigSchema.passthrough()` philosophy.

Alternative considered: validate against a known allowlist with warnings (mirrors `rules` validating against artifact IDs). Rejected — the allowlist would need to be maintained as new skills are added, and the consequence of a typo (silently no-ops) is low-risk.

**Skills call guidance as their very first step**
Before any other action — including `enpalspec list --json`. This ensures project context is available when the skill sets up its session.

If the command fails (CLI not installed in PATH, config missing, network issue), the skill continues without error. This is the same graceful degradation pattern used throughout.

**Resilient `skills:` parsing in `readProjectConfig()`**
Each skill entry parsed independently as a string. Non-string values log a warning and are skipped. Consistent with how `rules` is parsed today.

## Risks / Trade-offs

**Skills become stale after `enpalspec init --refresh` if we don't update templates**
Each time a skill is refreshed, it gets the new template. If we ship the guidance call in the template and a project runs refresh, they get the new behavior. If they don't refresh, they don't get it. → Mitigation: document this in the change notes; no forced migration needed since the feature is purely additive.

**CLI not installed / not in PATH**
If the project uses enpalspec but the CLI isn't in PATH (unusual but possible in some CI environments), the skill fails silently and continues. No regression. → Accepted trade-off.

**`context` returned twice**
Projects that already pass `context:` in config.yaml for artifact instructions will now also receive it via the guidance command in skill executions. This is intentional — the skill should have the same project background as artifact instructions do. No duplication risk in practice since the skill uses it as background, not output.

## Migration Plan

1. Update `ProjectConfigSchema` in `src/core/project-config.ts` — add `skills` field
2. Update `readProjectConfig()` — parse `skills` with resilient field-by-field approach
3. Add `src/commands/guidance.ts` — new command implementation
4. Wire `guidance` into CLI entry point (`src/cli/index.ts`)
5. Update all skill templates in `src/core/templates/workflows/*.ts` — add guidance call as first step
6. Update `src/core/init.ts` — seeded `config.yaml` template gains commented `skills:` section
7. Add spec: `openspec/specs/skill-guidance-command/spec.md`
8. Update specs: `config-loading`, `explore-skill-workflow`, `propose-skill-workflow`

No data migration. Existing `config.yaml` files without a `skills:` key continue to work — the field is optional.

## Open Questions

- What do the commented-out `skills:` examples in the seeded config.yaml look like? (deferred to init defaults exploration)
- Should `enpalspec guidance` warn if `openspec/config.yaml` exists but has no `skills:` key? (likely silent — graceful no-op)
