## Why

enpalspec is a fork of openspec. The inherited telemetry module sends usage data to openspec's PostHog pipeline via `edge.openspec.dev` — infrastructure we don't own. enpalspec users should not be tracked by a third-party service without their knowledge.

## What Changes

- Remove `src/telemetry/index.ts` and `src/telemetry/config.ts`
- Remove `test/telemetry/index.test.ts` and `test/telemetry/config.test.ts`
- Remove the three telemetry call sites from `src/cli/index.ts` (`maybeShowTelemetryNotice`, `trackCommand`, `shutdown`)
- Remove the `posthog-node` dependency from `package.json`

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `telemetry`: All telemetry requirements are removed. The capability no longer exists in enpalspec.

## Impact

- `src/cli/index.ts` — remove telemetry import and three call sites
- `src/telemetry/` — directory deleted entirely
- `test/telemetry/` — directory deleted entirely
- `package.json` — `posthog-node` removed from dependencies
- `openspec/specs/telemetry/spec.md` — spec deleted (capability no longer exists)
- No user-facing changes; the first-run notice disappears and CLI startup is slightly faster
