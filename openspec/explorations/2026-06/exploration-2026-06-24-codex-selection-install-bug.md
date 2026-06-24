# Exploration: Codex selection / install bug

**Date:** 2026-06-24
**Linked change:** none

## Context

When a user tries to select **Codex** in the interactive tool-selection prompt during
`enpalspec init`, one of two things happens: (a) on a fresh project it ends with the
validation error "Select at least one tool", or (b) if Claude Code is already configured,
Codex is silently not installed and only the existing Claude Code setup gets refreshed.
We want to understand the root cause and decide the fix before proposing a change.

## Observations

### Selection → generation flow (`enpalspec init`)

```
InitCommand.execute()                                  src/core/init.ts:110
  ├─ getToolStates(projectPath)            → which tools already configured (skill files on disk)
  ├─ getAvailableTools(projectPath)        → which tools "detected" (project skillsDir exists)
  ├─ getSelectedTools(...)                 init.ts:~280  ── the interactive prompt lives here
  │    └─ searchableMultiSelect({          init.ts:356
  │         choices: sortedChoices,        preSelected = configured || (firstTimeSetup && detected)
  │         validate: sel => sel.length>0 || 'Select at least one tool'   ← init.ts:360
  │       })
  ├─ validateTools(selectedToolIds)        init.ts:433  (drops tools without skillsDir)
  └─ generateSkillsAndCommands(...)        init.ts:510
        per tool: write .{tool}/skills/**  +  commands via adapter
        wasConfigured ? refreshedTools[] : createdTools[]   ← "refresh" vs "install"
```

Both reported symptoms reduce to the **same** underlying fact: **Codex never makes it into
the returned `selectedTools` array.**

- Fresh project → nothing pre-selected → if Codex toggle doesn't stick, the array is empty →
  `validate` fires **"Select at least one tool"** (`init.ts:360`).
- Claude already configured → Claude is `preSelected` (`init.ts:325`), so the array is `[claude]`
  even when Codex toggle doesn't stick → Claude has `wasConfigured: true` → lands in
  `refreshedTools` → "just refreshes the Claude Code installation" (`init.ts:589-592`).

### The prompt: toggle vs. confirm (`searchable-multi-select.ts`)

```
↑↓ navigate   •   Space toggle   •   Backspace remove   •   Enter confirm
```

- `Space` toggles `filteredChoices[cursor]` in/out of `selectedValues`  (lines 87-97)
- `Enter` runs `validate` then submits the **current** `selectedValues`  (lines 73-84)
- Initial `selectedValues` = choices where `preSelected` is true            (line 44)

So to add Codex a user must **Space then Enter**. If they press **Enter alone** on the
highlighted Codex row, nothing is added — exactly reproducing both symptoms.

### Why Codex specifically surfaces this

- Codex is **almost never pre-selected**. Pre-selection requires either a prior EnpalSpec
  config (`configured`) or, on first-time setup, a detected project `.codex/` directory
  (`getAvailableTools`, `available-tools.ts:19`). But Codex's actual artifacts go to a
  **global** home dir, not the project — see below — so the project `.codex/` dir typically
  doesn't exist and Codex is never auto-checked.
- Claude/Cursor users rarely hit the toggle path because their tool is pre-selected, masking
  the issue. Codex, requiring a manual toggle, is the first tool that exposes it.

### Codex is split-brained: global commands, project skills

```
codexAdapter.commandPath → ~/.codex/prompts/openspec-*.md   (GLOBAL home dir)
                            src/core/command-generation/adapters/codex.ts:33
generateSkillsAndCommands → <project>/.codex/skills/**       (project dir)  init.ts:548
getToolSkillStatus("codex") checks <project>/.codex/skills/  → "configured?"
getAvailableTools         checks <project>/.codex/           → "detected?"
```

This split means detection/pre-selection for Codex looks at the project dir while commands
are written globally — a likely contributor to "it didn't install" perceptions and to Codex
never being pre-selected.

### What the code/tests already tell us

- Real Node `readline` **does** emit `{ name: 'space' }` for the spacebar (verified), and the
  unit tests (`test/prompts/searchable-multi-select.test.ts`) confirm Space toggles and Enter
  confirms with mocked keys. So in isolation the toggle logic works — pointing at either a
  **UX/discoverability** cause (Enter-instead-of-Space) or a **terminal/environment-specific**
  keypress cause rather than a plain logic bug.

### Leading hypotheses

1. **UX**: users press Enter on the highlighted Codex row expecting single-select behavior;
   Space-to-toggle is missed. Fits both symptoms exactly, no code bug required.
2. **Environment**: in the user's terminal the Space keypress isn't delivered as
   `name === 'space'` (theme/terminal/OS-specific), so the toggle never registers.
3. **Pre-selection/detection gap**: Codex's global-vs-project split keeps it from ever being
   pre-selected, amplifying the toggle dependency.

## Rounds

## Round 1 — Pin down the bug

### Q1.1 — How do you reproduce "select codex"?

When you hit this, what keys are you pressing to select Codex?

- [ ] Navigate to Codex with ↑↓, then press **Enter** (no Space)
- [ ] Navigate to Codex, press **Space**, then **Enter** — and Space appears to do nothing
- [ ] Type to search "codex", then Space, then Enter
- [ ] Not sure / mixed

> **Your answer / freetext:**
>

### Q1.2 — Environment

Where is this happening?

- [ ] macOS terminal (specify which: iTerm2 / Terminal.app / VS Code / other)
- [ ] Linux terminal
- [ ] Windows (PowerShell / cmd / Windows Terminal / WSL)
- [ ] Multiple / reported by others

> **Your answer / freetext:**
>

### Q1.3 — When Codex is highlighted and you press Space, what do you see?

The row indicator is `◉` (selected) vs `○` (unselected), with a "Selected:" chip line at top.

- [ ] The `○` never flips to `◉` and no chip appears (toggle truly not registering)
- [ ] It flips to `◉` but Codex still isn't installed after Enter
- [ ] I never tried Space — I pressed Enter
- [ ] Don't recall

> **Your answer / freetext:**
>

### Q1.4 — What does "doesn't install codex" look like on disk?

After the run, did anything Codex-related appear? (Codex commands go to the **global**
`~/.codex/prompts/`, skills to `<project>/.codex/skills/`.)

- [ ] Nothing anywhere — no `~/.codex/prompts/openspec-*` and no `<project>/.codex/`
- [ ] Global `~/.codex/prompts/` got files but it still felt like "nothing happened"
- [ ] Haven't checked the global `~/.codex/` location
- [ ] Project `.codex/` appeared but not what I expected

> **Your answer / freetext:**
>

### Q1.5 — Which direction should the fix lean?

Assuming we confirm the cause, where do you want the emphasis? (We'll refine in later rounds.)

- [x] Make the prompt foolproof (clearer Space-vs-Enter affordance, or Enter selects the highlighted row when nothing is checked) ← recommended: kills the most common failure regardless of terminal
- [ ] Fix/guard the keybinding for the affected terminal
- [ ] Rethink Codex detection/pre-selection (global vs project split) so it pre-selects sensibly
- [ ] All of the above — treat as a small bundle

> **Your answer / freetext:**
>

### Round 1 — Captured answers (answered in chat)

- **Q1.1 / Q1.2:** macOS terminal; navigates with arrow keys, then presses **Enter** (no Space).
- **Q1.3:** Sees the **Codex** row as "selected" at confirmation (the cyan active-row highlight
  read as selection — it was never Space-toggled).
- **Q1.4:** On disk afterwards only **Claude Code** changed — i.e., Claude was pre-selected, Enter
  confirmed `[claude]`, Codex never entered the selection.
- **Q1.5:** Go with the recommended option (foolproof prompt) for the remaining direction.

**Diagnosis:** confirmed **UX/affordance** root cause. The active-row highlight is mistaken for a
selection; Enter confirms only the pre-selected set (Claude); Space — the real toggle — is missed.
Not a keybinding bug (real `readline` emits `name:'space'`) and not a generation bug.

## Round 2 — Pick the fix

### Q2.1 — How should the prompt prevent "Enter without toggling"?

The recommended direction is "make the prompt foolproof" — but that has distinct implementations.

- [x] **Enter selects the highlighted row when nothing extra is toggled** — if the user never pressed Space, Enter adds the current cursor row before confirming ← recommended: directly fixes the exact failure (arrow + Enter), zero new keys to learn
- [ ] **Stronger visual affordance only** — dim unselected rows, make the `Space to toggle` hint prominent, show "0 selected" warning state; keep Enter strictly confirm
- [ ] **Replace with `@inquirer/checkbox`** — adopt the standard checkbox prompt with well-known toggle affordances (loses the custom search box unless re-added)
- [ ] **Both: smart-Enter + stronger affordance**

> **Your answer / freetext:**
>

### Q2.2 — Should we also fix Codex's detect/pre-select split in this work?

Codex commands write to global `~/.codex/prompts/` but detection/pre-selection only checks the
project `.codex/` dir, so Codex is never auto-detected/pre-selected.

- [x] Yes — detect Codex from the global `~/.codex/` location so it pre-selects sensibly ← recommended: removes the dependency on the toggle for existing Codex users
- [ ] No — keep this exploration scoped to the prompt UX only; file Codex detection separately
- [ ] Only document it as a known follow-up

> **Your answer / freetext:**
>

### Q2.3 — Scope of the resulting change

- [x] One change covering the prompt fix (+ Codex detection if Q2.2 = yes) ← recommended: small, cohesive
- [ ] Split into two changes (prompt UX vs. Codex detection)

> **Your answer / freetext:**
>

### Round 2 — Captured answers

Q2.1 / Q2.2 / Q2.3 — user deferred to the recommended options.

## Insights & Decisions

_Decision:_ Root cause is a **UX/affordance** problem in `searchable-multi-select`, not a keybinding
or generation bug — _Reason:_ user navigated with arrows and pressed Enter without Space; the cyan
active-row highlight read as "selected"; Enter confirmed only the pre-selected set (`[claude]`), so
Codex was never toggled in. Real `readline` emits `name:'space'` and unit tests confirm the toggle
logic works in isolation.

_Decision:_ Both symptoms ("Select at least one tool" on a fresh project, and "only Claude refreshed"
when Claude is configured) are the **same** failure — Codex never enters `selectedTools` — _Reason:_
on a fresh project the empty array trips the `validate` message; with Claude pre-selected the array is
`[claude]`, which has `wasConfigured: true` and lands in `refreshedTools`.

_Decision:_ Fix the prompt so **Enter selects the highlighted row when nothing extra was toggled**
(smart-Enter) — _Reason:_ directly fixes the exact failure path (arrow + Enter) with no new keys for
users to learn; lowest-friction way to make the prompt foolproof across terminals.

_Decision:_ Also fix Codex's **detect/pre-select split** by detecting Codex from the global
`~/.codex/` location — _Reason:_ Codex commands write globally while detection only checks the project
`.codex/` dir, so Codex is never auto-pre-selected; existing Codex users should not have to rely on the
toggle at all.

_Decision:_ Deliver as **one cohesive change** (prompt smart-Enter + Codex global detection) —
_Reason:_ small, related surface; splitting adds overhead without benefit.
