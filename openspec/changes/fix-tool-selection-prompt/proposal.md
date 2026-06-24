## Why

Users who try to add **Codex** (or any not-pre-selected tool) navigate to it with the arrow
keys and press **Enter**, but the tool is never configured: on a fresh project the run ends
with "Select at least one tool", and when Claude Code is already configured only Claude gets
refreshed. The active-row highlight reads as a selection, and Enter confirms only the
already-toggled set. The `cli-init` "Interactive Mode" requirement already specifies that Enter
on a highlighted, unselected tool should add it before review — the current
`searchable-multi-select` prompt dropped that behavior, so this is implementation drift from an
existing spec.

## What Changes

- Restore **smart-Enter** in the `searchable-multi-select` prompt: when Enter is pressed and the
  highlighted row is a selectable, not-yet-toggled tool, add it to the selection before
  confirming (so arrow-to-tool + Enter configures that tool).
- Clarify the inline prompt instructions so it is obvious that **Space toggles** and **Enter
  selects the highlighted tool** before review.
- Make **Codex detection** account for its global home (`~/.codex/`, honoring `CODEX_HOME`):
  Codex commands are written to `~/.codex/prompts/`, but "configured"/"detected" state was only
  checked in the project `.codex/` dir, so Codex was never pre-selected for existing users.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `cli-init`: The Interactive Mode requirement is realigned to the current searchable
  multi-select prompt and re-affirms smart-Enter (Enter adds the highlighted unselected tool
  before review) plus instruction copy clarifying Space-toggle vs. Enter-select.
- `ai-tool-paths`: Codex configured/detected state is determined from its global home
  (`~/.codex/`, respecting `CODEX_HOME`) rather than only the project directory, so Codex is
  pre-selected/refreshed correctly.

## Impact

- `src/prompts/searchable-multi-select.ts` — Enter handler gains smart-add of the highlighted
  selectable row; instruction line updated.
- `src/core/available-tools.ts` and/or `src/core/shared/tool-detection.ts` — Codex detection
  reads the global Codex home.
- Tests: `test/prompts/searchable-multi-select.test.ts` (new smart-Enter cases) and Codex
  detection tests; all paths via `path.join()` for cross-platform correctness.
- No breaking changes; behavior for already-toggled selections and other tools is unchanged.
