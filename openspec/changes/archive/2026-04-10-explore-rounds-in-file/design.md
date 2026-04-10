## Context

The explore workflow previously had two phases:
- **Phase 1**: Free-form dialogue in chat (thinking partner mode)
- **Phase 2**: Structured Q&A rounds written to the exploration file

`explore-rounds-in-file` (first iteration) moved Phase 2 Q&A into the file but kept Phase 1 in chat, with a `## Notes` section written at the transition point. This second iteration removes the distinction entirely. The document is the primary medium from session start.

Two template functions in `src/core/templates/workflows/explore.ts` are the sole source of truth for the seeded workflow:
- `getExploreSkillTemplate()` — generates the skill installed in customer repos
- `getOpsxExploreCommandTemplate()` — generates the slash command installed in customer repos

Both functions return long instruction strings. This change is a prompt/text update to those strings plus an update to the initial exploration doc template embedded within them.

## Goals / Non-Goals

**Goals:**
- No Phase 1 / Phase 2 distinction in the seeded workflow
- On invocation, assistant writes `## Observations` + `## Round 1` to the file in one shot, then hands off
- Chat acts as a rich companion: full findings digest after first write, decision summaries after each answered round
- Vague topics: assistant asks clarifying questions in chat (one at a time, biggest blast radius first) before writing to the document
- Exploration doc template: `## Notes` → `## Observations`; `## Open Questions` section removed
- Both `getExploreSkillTemplate` and `getOpsxExploreCommandTemplate` stay in sync
- Specs updated to match

**Non-Goals:**
- Changing the EnpalSpec meta command (`.claude/commands/enpalspec/explore.md`)
- Changing any CLI commands, APIs, or dependencies

## Decisions

### Decision: Update both skill and command templates together

Both templates live in `src/core/templates/workflows/explore.ts`. They are updated in sync. Diverging behaviour between skill and command would be confusing.

### Decision: Observations section written upfront in one shot

On first invocation (after any clarification), the assistant:
1. Researches the codebase, writes `## Observations` (diagrams, findings, framing)
2. Writes `## Round 1` questions immediately after
3. Posts a full findings digest in chat, tells the user to open the doc

This gives the user a complete picture before they answer anything, with the fewest round-trips.

_Alternative considered:_ Write Observations first, pause, then write Round 1 after user reads. Rejected — one more unnecessary round-trip.

### Decision: Chat as rich companion

After writing to the doc, chat posts a genuine findings digest (3–5 bullets) not just a navigation prompt. After each answered round, chat summarises what was decided before writing the next round.

_Alternative considered:_ Navigation-only chat ("Round N added to doc"). Rejected — too terse; chat should remain a useful quick-read surface.

### Decision: `## Observations` replaces `## Notes`

The first iteration added `## Notes` to the exploration doc template, written at the Phase 1 → Phase 2 transition. With no transition, this becomes `## Observations` — written upfront, before any rounds.

_Alternative considered:_ Keep `## Notes`. Rejected — "Notes" implied something appended mid-session; "Observations" is accurate for upfront research.

### Decision: Remove `## Open Questions` from exploration doc

The `## Open Questions` section at end-of-session forced the appearance of unresolved issues. If questions remain before proposing, they are asked as a round instead — they get answers rather than just being listed.

### Decision: Vague topic clarification in chat

If the topic is too vague to meaningfully investigate, the assistant asks clarifying questions in chat (one at a time, biggest blast radius first) until sufficient context exists, then proceeds to write to the document.

_Alternative considered:_ Always make a best-guess interpretation and write to doc. Rejected — risks writing a useless Observations section on a misunderstood topic.

### Decision: Q&A question format unchanged

The checkbox format from the first iteration is kept: `### QN.M — {Title}`, `[x]` pre-marked recommended option with `← recommended: reason`, `> **Your answer / freetext:**` field.

## Risks / Trade-offs

- **User doesn't open the file**: Chat posts the findings digest and explicitly tells the user to open the doc. Low risk.
- **Observations may be wrong for vague topics**: Mitigated by the clarification flow — assistant asks first if topic is too ambiguous.
- **Longer exploration docs**: Observations section adds content upfront. Acceptable — the file is a persistent artifact.
- **Prompt-level guarantees only**: The session model is implemented as LLM instructions. Behaviour relies on the model following them correctly. No code enforces the flow.
