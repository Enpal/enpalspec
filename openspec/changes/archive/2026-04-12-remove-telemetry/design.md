## Context

enpalspec inherits telemetry from openspec. The `src/telemetry/` module sends `command_executed` events to PostHog via `edge.openspec.dev` — a reverse proxy owned by openspec, not enpalspec. Every `enpalspec` command silently phones home to a third-party pipeline.

The telemetry module is two files (~160 lines each) with three call sites in `src/cli/index.ts` and one dependency (`posthog-node`). This is a pure deletion change.

## Goals / Non-Goals

**Goals:**
- Stop all outbound usage data from enpalspec binaries
- Remove dead code so it cannot be accidentally re-enabled
- Remove the `posthog-node` dependency (reduces install size and attack surface)

**Non-Goals:**
- Adding a replacement analytics system
- Preserving the global config file (`~/.config/openspec/config.json`) — it stays on disk but nothing reads it after this change
- Providing a user-facing opt-in mechanism

## Decisions

**Decision: Full deletion, not a permanent disable**

Option considered: Set `isTelemetryEnabled()` to always return `false`.

Chosen: Delete the module entirely.

Rationale: Dead code creates confusion ("why is this here?"), carries a live dependency, and could be re-enabled accidentally. Deletion is unambiguous.

**Decision: Do not clean up existing `~/.config/openspec/config.json` files**

The config file may contain an `anonymousId` written by a previous version. Cleaning it up would require a migration command and knowledge of the path at runtime — not worth the complexity. The file is harmless without a reader.

**Decision: Delete `openspec/specs/telemetry/spec.md`**

The capability no longer exists. Keeping the spec would imply the system should implement it. The delta spec in this change marks all requirements as REMOVED; archive will delete the file.

## Risks / Trade-offs

- `~/.config/openspec/config.json` remains on existing users' machines — harmless but not cleaned up → Acceptable; no sensitive data, just a stale UUID

## Migration Plan

1. Delete `src/telemetry/index.ts` and `src/telemetry/config.ts`
2. Delete `test/telemetry/index.test.ts` and `test/telemetry/config.test.ts`
3. Remove the three telemetry call sites and import from `src/cli/index.ts`
4. Run `pnpm remove posthog-node`
5. Run tests to confirm no remaining references

No rollback needed — this change can simply be reverted if required.

## Open Questions

_None._
