## 1. Smart-Enter in searchable multi-select

- [x] 1.1 In `src/prompts/searchable-multi-select.ts`, add a `disabled?` (or selectable) notion to `Choice` and treat existing choices as selectable by default
- [x] 1.2 Update the Enter handler: if `filteredChoices[cursor]` exists, is selectable, and is not in `selectedValues`, add it before running `validate`/`done`; validate and submit the augmented set
- [x] 1.3 Ensure no duplicate is added when the highlighted row is already selected
- [x] 1.4 Update the inline instruction line to state that Enter selects the highlighted tool before confirming (keep Space/Backspace hints)

## 2. Tests for smart-Enter

- [x] 2.1 Add case: arrow to an unselected tool + Enter adds it to the result (empty initial selection)
- [x] 2.2 Add case: with a pre-selected tool present, arrow to a different unselected tool + Enter includes both (covers the Codex-while-Claude-configured bug)
- [x] 2.3 Add case: Enter on an already-selected highlighted tool does not duplicate it
- [x] 2.4 Add case: Enter on a non-selectable/disabled row does not add it
- [x] 2.5 Confirm the hint-text test reflects the updated copy

## 3. Codex global-home detection

- [x] 3.1 Factor Codex home resolution (`CODEX_HOME` else `<homedir>/.codex`) into a shared helper reused by `src/core/command-generation/adapters/codex.ts`, using `path.resolve`/`path.join`
- [x] 3.2 Update Codex detection in `src/core/shared/tool-detection.ts` (`getToolSkillStatus`) and/or `src/core/available-tools.ts` to also check `<codexHome>/prompts/<COMMAND_NAMESPACE>-<commandId>.md` for tracked command IDs
- [x] 3.3 Keep the existing project `.codex/skills/<skill>/SKILL.md` check so skills-only delivery still reports Codex as configured
- [x] 3.4 Report Codex as configured/detected if either the global commands or project skills exist; ensure this feeds pre-selection in `getSelectedTools`
- [x] 3.5 Use explicit name/namespace lookups (no globbing) and wrap filesystem reads in try/catch

## 4. Tests for Codex detection

- [x] 4.1 Codex reported configured when global `<codexHome>/prompts/enpalspec-*.md` files exist
- [x] 4.2 Codex reported configured when only project `.codex/skills/**/SKILL.md` exist
- [x] 4.3 `CODEX_HOME` override is honored for detection
- [x] 4.4 Codex not configured when the home exists but holds no EnpalSpec artifacts
- [x] 4.5 Use `path.join()` for all expected paths in tests (no hardcoded separators)

## 5. Verification

- [x] 5.1 Run `pnpm test` (or project equivalent) — all unit tests pass (1360 passed)
- [x] 5.2 Verified smart-Enter via keystroke-simulation tests (arrow-to-tool + Enter on empty selection, and arrow-to-other + Enter with a pre-selected tool — the Codex-while-Claude-configured case) plus a non-interactive `init --tools codex` end-to-end smoke (project skills + global `~/.codex/prompts` created, detection reports configured). NOTE: a human TTY sanity check is still worthwhile pre-merge.
- [x] 5.3 New code uses `path.join`/`path.resolve` only (no hardcoded separators in source or tests); `getCodexHome` resolves home cross-platform. Windows verification runs in CI.
- [x] 5.4 Ran `enpalspec validate fix-tool-selection-prompt` — change is valid
