# Exploration: explore-skill-questions-in-file

**Date:** 2026-04-10
**Status:** In progress

## Context

The explore skill (and the seeded explore command in projects) currently conducts Q&A rounds in the chat. The goal is to move question-answering into the exploration file itself — users edit the file directly to answer, and the assistant reads it back each round.

Key distinction: there are two different "specs" in play:
- The EnpalSpec system specs in `openspec/` (what governs this tool itself)
- The specs seeded into user projects (the `explore`, `propose`, `apply`, etc. commands planted in `.claude/commands/`, which lie in the `/specs` folder)

This change targets the **seeded explore command** (what projects get), not necessarily the EnpalSpec meta-system — though both may need updating.

## Open Threads

- How does the current seeded explore command work vs. the EnpalSpec-native one?
- Where exactly is the seeded explore command defined?
- What does the round structure look like in the file vs. chat?

---

## Round 1 — Scope & Mechanics

### Q1.1 — Which explore command is being changed?

This change could target the explore command seeded into projects, the EnpalSpec meta-explore command, or both.

- [ ] Both — the seeded command and the EnpalSpec meta-explore should behave the same ← recommended: consistency avoids two diverging UX patterns
- [x] Seeded command only — leave EnpalSpec meta-explore as-is
- [ ] EnpalSpec meta-explore only

> **Your answer / freetext:**
>

---

### Q1.2 — Where do questions live in the file?

Currently questions are asked in chat. The new model writes them into the exploration file. Where in the file should each round's questions appear?

- [x] Appended at the bottom of the file after each round of exploration ← recommended: append-only is safe and auditable
- [ ] In a dedicated `## Q&A Rounds` section at the top, before free-form notes
- [ ] Interleaved with the exploration prose wherever relevant

> **Your answer / freetext:**
>

---

### Q1.3 — How does the user signal they've answered?

After the assistant writes a round of questions to the file, the user edits the file with their answers. How do they signal they're ready for the next round?

- [x] Say something in chat ("replied", "answered", "done", "next") ← recommended: simple and low-friction
- [ ] A specific slash command like `/next-round`
- [ ] Assistant polls the file automatically on a timer

> **Your answer / freetext:**
>

---

### Q1.4 — What happens to chat during Q&A?

When questions are in the file, what should the assistant say in chat while waiting?

- [x] Brief prompt: "I've added Round N to the file. Answer there, then say 'next' when ready." ← recommended: keeps chat clean, orients the user
- [ ] Nothing — silence until user responds
- [ ] Paste the questions in chat too (duplicate display)

> **Your answer / freetext:**
>

---

---

## Round 2 — File Template & Phase Boundary

The new mechanic writes questions into the file. That means the exploration doc template and the Phase 1/2 boundary both need revisiting.

### Q2.1 — Does Phase 1 (free-form exploration) stay in chat?

Phase 2 Q&A moves to the file. But Phase 1 is open-ended dialogue — no structured questions, just thinking together. Should Phase 1 stay in chat or also move to the file?

- [ ] Phase 1 stays in chat; only Phase 2 Q&A rounds move to the file ← recommended: Phase 1 is conversational and benefits from back-and-forth; the file is for structured decisions
- [ ] Both phases fully move to the file — all exploration happens there
- [x] Keep current behavior for Phase 1 but add a running "notes" section to the file. Make sure Phase 1 doesn't overwhelm the user with too many questions.

> **Your answer / freetext:**
>

---

### Q2.2 — Does the seeded skill (enpalspec-explore) also change, or only the command?

Looking at `src/core/templates/workflows/explore.ts`, there are two templates:
- `getOpsxExploreCommandTemplate()` → `.claude/commands/enpalspec/explore.md` (the slash command seeded into projects)
- `getExploreSkillTemplate()` → the skill file seeded into projects

Both currently have identical Q&A behavior. Should both be updated?

```
Seeded into customer repos:
  .claude/commands/enpalspec/explore.md   ← from getOpsxExploreCommandTemplate()
  .claude/skills/enpalspec-explore/       ← from getExploreSkillTemplate()
```

- [x] Update both — they should stay in sync ← recommended: diverging behavior between the command and skill would be confusing
- [ ] Command only — the skill is rarely invoked directly
- [ ] Skill only — the command is the primary entry point

> **Your answer / freetext:**
>

---

### Q2.3 — What does the file template look like for Q&A?

The current exploration doc template has a `## Rounds` section with a comment placeholder. The new mechanic writes questions there. Should the initial template change?

Current template:
```markdown
## Rounds
<!-- Q&A rounds will be appended here after each round -->
```

Options:
- [x] Keep `## Rounds` as-is; assistant appends each round as `## Round N — {Theme}` with Q&A questions inside ← recommended: minimal change, clear structure
- [ ] Rename to `## Q&A Rounds` to be explicit
- [ ] Remove the section entirely and let the assistant create it on first append

> **Your answer / freetext:**
>

---

---

## Round 3 — Notes Section & Transition

Q2.1 introduced a "running notes" section for Phase 1. This round nails down when and how it gets written, and what the Phase 1 → Phase 2 transition looks like.

### Q3.1 — When does the assistant write to the Notes section?

The notes section captures Phase 1 thinking in the file. When should the assistant populate it?

- [ ] After every assistant message during Phase 1 (continuous)
- [x] At the natural end of Phase 1, just before transitioning to Q&A rounds ← recommended: avoids constant file writes during open dialogue; one clean write captures the key insights
- [ ] On demand — only when the user asks ("save these notes")

> **Your answer / freetext:**
>

---

### Q3.2 — What goes into the Notes section?

When the assistant writes the notes, what should it capture?

- [x] Key insights, framing, diagrams, and any preliminary decisions surfaced during Phase 1 ← recommended: preserves the thinking, not the transcript
- [ ] A full transcript summary of the Phase 1 conversation
- [ ] Only explicit decisions, nothing exploratory

> **Your answer / freetext:**
>

---

### Q3.3 — How does the Phase 1 → Phase 2 transition announcement change?

Currently the skill says (in chat):
> "I'm seeing some concrete decisions here — let me capture them with a few focused questions."

Then immediately asks questions in chat. With the new mechanic, questions go to the file instead. What should the assistant say in chat at the transition?

- [x] Announce the transition + note save, then tell the user to open the file: "Writing notes and Round 1 to the exploration doc — open it and answer there, then say 'next'." ← recommended: one clear instruction, no ambiguity
- [ ] Just say "Switching to Q&A mode" with no file mention
- [ ] Keep the existing announcement verbatim, add a file mention as a postscript

> **Your answer / freetext:**
>

---

## Insights & Decisions

_Decision:_ Target is seeded templates only (`getExploreSkillTemplate` + `getOpsxExploreCommandTemplate` in `src/core/templates/workflows/explore.ts`). The EnpalSpec meta command (`.claude/commands/enpalspec/explore.md`) is not touched. — _Reason:_ The meta command governs this tool itself and can be updated separately; seeded projects are the immediate target.

_Decision:_ Phase 1 (free-form exploration) stays in chat, but the assistant writes a **Notes** section to the file at the end of Phase 1, just before transitioning to Q&A. — _Reason:_ Phase 1 is conversational; forcing it to the file would kill the back-and-forth. The notes capture the thinking without cluttering the dialogue.

_Decision:_ Phase 1 should not overwhelm the user with too many questions. — _Reason:_ User explicitly flagged this as a concern.

_Decision:_ Phase 2 Q&A rounds are written into the file (appended under `## Rounds`). The user edits the file to answer, then signals in chat ("next", "done", etc.). — _Reason:_ Keeps the structured decision record in one persistent place; chat stays clean.

_Decision:_ Chat during Phase 2 gets only a brief prompt: "Writing Round N to the exploration doc — answer there, then say 'next' when ready." No questions duplicated in chat. — _Reason:_ Avoids noise; the file is the source of truth.

_Decision:_ Phase 1 → Phase 2 transition announcement: write notes to file, write Round 1 Q&A to file, tell user: "Writing notes and Round 1 to the exploration doc — open it and answer there, then say 'next'." — _Reason:_ One clear instruction covers both the transition and the new mechanic.

_Decision:_ Question format in the file uses `### QN.M — {Title}` headings, checkbox options with one `[x]` recommended option, and a freetext `> **Your answer / freetext:**` field. — _Reason:_ User provided this format as part of the spec.

_Decision:_ `## Rounds` section in the initial exploration doc template stays unchanged. Rounds are appended there. — _Reason:_ Minimal change; works with existing template.
