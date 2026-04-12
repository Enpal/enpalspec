## 1. Delete telemetry source files

- [x] 1.1 Delete `src/telemetry/index.ts`
- [x] 1.2 Delete `src/telemetry/config.ts`

## 2. Delete telemetry tests

- [x] 2.1 Delete `test/telemetry/index.test.ts`
- [x] 2.2 Delete `test/telemetry/config.test.ts`

## 3. Remove call sites from CLI entry point

- [x] 3.1 Remove `import { maybeShowTelemetryNotice, trackCommand, shutdown }` from `src/cli/index.ts`
- [x] 3.2 Remove `await maybeShowTelemetryNotice()` call
- [x] 3.3 Remove `await trackCommand(commandPath, version)` call
- [x] 3.4 Remove the post-command `shutdown()` hook

## 4. Remove dependency

- [x] 4.1 Run `pnpm remove posthog-node` to uninstall the package

## 5. Verify

- [x] 5.1 Run `pnpm build` — no TypeScript errors
- [x] 5.2 Run `pnpm test` — no failing tests, no remaining telemetry test references
- [x] 5.3 Grep for `posthog`, `telemetry`, `OPENSPEC_TELEMETRY`, `DO_NOT_TRACK` in `src/` to confirm no remaining references
