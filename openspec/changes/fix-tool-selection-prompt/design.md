## Context

`enpalspec init` configures AI tools via an interactive prompt. The current prompt is the
custom `searchable-multi-select` (`src/prompts/searchable-multi-select.ts`): Space toggles a row,
Enter confirms the currently-toggled set, and a `validate` callback rejects an empty selection
with "Select at least one tool".

The `cli-init` "Interactive Mode" requirement already specifies smart-Enter — "when Enter is
pressed on a highlighted selectable tool that is not already selected, automatically add it to
the selection before moving to review". That requirement predates the searchable prompt (it
describes a "looping select menu"); the searchable prompt was introduced without carrying the
smart-Enter behavior, so the implementation drifted from the spec.

Separately, Codex is split-brained: its slash commands are written to a **global** home
(`~/.codex/prompts/`, via `getCodexHome()` in `src/core/command-generation/adapters/codex.ts`,
honoring `CODEX_HOME`), while its skills go to the project `.codex/skills/`. Tool detection
(`getAvailableTools`, `getToolSkillStatus`) only inspects the project directory, so Codex is
never pre-selected/refreshed for users who already have it configured globally.

## Goals / Non-Goals

**Goals:**
- Arrow-to-a-tool + Enter configures that tool, even when other tools are already (pre)selected.
- Bring `searchable-multi-select` back in line with the `cli-init` Interactive Mode requirement.
- Codex's configured/detected state reflects its real (partly global) install location.
- Cross-platform correct (`path.join`, home-dir resolution); covered by tests.

**Non-Goals:**
- Replacing the prompt with `@inquirer/checkbox` (custom search box would be lost).
- Changing toggle semantics (Space), pagination, search, or the validate message itself.
- Changing where Codex artifacts are written (only how they are detected).

## Decisions

### D1 — Smart-Enter adds the highlighted selectable, unselected row before confirming

In the Enter handler of `searchable-multi-select.ts`, before running `validate`/`done`: if the
highlighted row (`filteredChoices[cursor]`) exists, is selectable, and is **not** already in
`selectedValues`, add it, then validate and submit the augmented set.

- **Why always-add (not "only when selection is empty")**: the failing case is Claude already
  pre-selected + arrow to Codex + Enter. A "only when empty" guard would not fire there (Claude
  is selected) and Codex would still be dropped. Always-adding the highlighted unselected row
  fixes both the empty-selection and the pre-selected cases, and matches the existing spec text.
- **Alternative — visual affordance only** (dim unselected, louder hint): lower risk but does
  not fix the muscle-memory "arrow + Enter" path; rejected as the primary fix (we still improve
  the hint copy as a complement).
- **Alternative — swap to `@inquirer/checkbox`**: rejected; loses the search box and is a larger
  change than the drift warrants.

The current prompt has no concept of disabled rows (all `AI_TOOLS` choices passed in are
selectable), but the `agents` entry (`available: false`) is filtered out upstream; the handler
will still guard on a `disabled`/selectable flag so a future non-selectable row is not auto-added.

### D2 — Codex detection reads its global home, by explicit lookup

Add a Codex-aware detection path that resolves the Codex home the same way the adapter does
(`CODEX_HOME` else `~/.codex`) and checks for the **known** generated artifacts rather than a
glob:
- commands: `<codexHome>/prompts/<COMMAND_NAMESPACE>-<commandId>.md` for the known command IDs
  (`COMMAND_NAMESPACE = 'enpalspec'`);
- skills (when delivery is skills-only): the existing project `.codex/skills/<SKILL_NAMES>/SKILL.md`.

Codex is considered configured/detected if either location holds EnpalSpec artifacts. The home
resolution is factored into a shared helper (re-used by the adapter) so there is one source of
truth. All paths via `path.join` / `path.resolve`.

- **Why explicit lookup**: project rule — "if we generate it, we track it by name in a constant";
  detection uses the namespace + command/skill name constants, not pattern matching.
- **Alternative — only check `~/.codex/` directory existence**: rejected; the dir may exist for
  unrelated Codex use and would produce false "configured" state.

## Risks / Trade-offs

- [Smart-Enter could add an unwanted tool if the cursor rests on an unselected row that the user
  did not mean to add] → After toggling with Space the cursor sits on a now-selected row, so the
  common flows (toggle-then-Enter, arrow-then-Enter) do the right thing; only deliberately
  arrowing onto a different unselected row adds it, which is the documented "highlighted" intent.
  Updated hint copy makes the behavior explicit.
- [Codex global detection touches the user's home directory] → Read-only `statSync`/`existsSync`
  on specific known files; respects `CODEX_HOME`; no writes, wrapped in try/catch like existing
  detection.
- [Cross-platform home resolution] → Use `os.homedir()` + `path.join`; mirror the adapter's
  existing `getCodexHome()` logic; add a Windows path-handling scenario/test.
