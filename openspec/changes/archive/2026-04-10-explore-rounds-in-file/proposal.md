## Why

The explore workflow had a Phase 1 (free-form chat) and Phase 2 (structured Q&A in file) distinction that created an artificial inflection point and kept early exploration ephemeral. This change removes that distinction entirely: the document is the primary medium from the very start of every session, making the exploration file the complete, persistent record of the session rather than a log assembled after the fact.

## What Changes

- **Seeded explore skill** (`getExploreSkillTemplate`): No Phase 1/2 distinction. On invocation, the assistant writes `## Observations` (codebase research, diagrams, framing) and `## Round 1` questions to the file in one shot, then posts a full findings digest in chat. User answers in the file, says "next" in chat. Chat posts a decision summary after each answered round before writing the next. If the topic is too vague to investigate, the assistant asks clarifying questions in chat (one at a time, biggest blast radius first) before writing to the document.
- **Seeded explore command** (`getOpsxExploreCommandTemplate`): Same changes — both templates updated in sync.
- **Exploration doc template**: Replaces `## Notes` with `## Observations` (written upfront, not at a transition point). Removes the `## Open Questions` section entirely — if questions remain, they are asked as a round instead.
- **Question format**: Unchanged from `explore-rounds-in-file` — `### QN.M` headings, `[x]` recommended checkboxes with `← recommended: reason`, freetext field.
- **EnpalSpec meta command** (`.claude/commands/enpalspec/explore.md`): Not changed.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `explore-skill-workflow`: Session model redesigned — document-first from start, no phase distinction, Observations section written upfront, chat acts as rich companion (findings digest + decision summaries), vague topics handled via chat clarification before document write.
- `exploration-docs`: Doc structure updated — `## Notes` replaced by `## Observations`, `## Open Questions` section removed.

## Impact

- `src/core/templates/workflows/explore.ts`: Both `getExploreSkillTemplate()` and `getOpsxExploreCommandTemplate()` updated
- `openspec/specs/explore-skill-workflow/spec.md`: Updated to reflect new session model
- `openspec/specs/exploration-docs/spec.md`: Updated to reflect new doc structure
- No CLI commands, APIs, or dependencies affected
