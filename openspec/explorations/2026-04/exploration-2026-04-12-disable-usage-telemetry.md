---
topic: disable-usage-telemetry
date: 2026-04-12
status: exploring
---

# Exploration: Disable Usage Telemetry

## Context

Exploring whether and how to turn off the telemetry that tracks CLI usage patterns.
The current implementation uses PostHog to capture anonymous command execution events.

## What Exists Today

### The telemetry stack

- **Provider**: PostHog via `posthog-node`
- **Reverse proxy**: `https://edge.openspec.dev` (to avoid ad blockers)
- **Events captured**: `command_executed` — command name + version + surface (`cli`)
- **Anonymous ID**: random UUID stored in `~/.config/openspec/config.json`
- **First-run notice**: shown once, then `noticeSeen: true` persisted

### Existing opt-out mechanisms (already implemented)

```
OPENSPEC_TELEMETRY=0   — explicit opt-out
DO_NOT_TRACK=1         — respects the DNT standard
CI=true                — auto-disabled in CI environments
```

### Code locations

- `src/telemetry/index.ts` — PostHog client, `isTelemetryEnabled()`, `trackCommand()`, `maybeShowTelemetryNotice()`, `shutdown()`
- `src/telemetry/config.ts` — reads/writes `~/.config/openspec/config.json`
- `src/cli/index.ts:68–86` — hooks telemetry into every command

## Rounds

<!-- Q&A rounds appended here -->

## Insights & Decisions

- **Decision**: Remove telemetry entirely. enpalspec is a fork of openspec and must not send usage data to openspec's PostHog pipeline.
- **Approach**: Delete `src/telemetry/` and both test files, strip the 3 call sites in `src/cli/index.ts`, remove `posthog-node` from `package.json`.
- **No opt-in path**: Telemetry should not be preserved in any disabled/configurable form — it's gone.

## Open Questions

- None. Decision is clear.
