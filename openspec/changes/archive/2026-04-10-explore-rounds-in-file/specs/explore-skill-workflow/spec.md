## MODIFIED Requirements

### Requirement: Explore skill creates exploration doc at session start
The explore skill SHALL create the exploration document at the correct path at the start of every session. If the topic is clear, the skill SHALL immediately write `## Observations` and `## Round 1` to the document and post a findings digest in chat. If the topic is too vague to investigate meaningfully, the skill SHALL first ask clarifying questions in chat (one at a time, biggest blast radius first) until sufficient context exists.

#### Scenario: Doc created and populated on clear invocation
- **WHEN** user invokes `/enpalspec:explore auth-redesign` with a sufficiently clear topic
- **THEN** the skill creates `openspec/explorations/<yyyy-mm>/exploration-<date>-auth-redesign.md`
- **AND** fills in the heading, date metadata, and a Context section summarising the topic
- **AND** researches the codebase and writes `## Observations` (findings, diagrams, framing)
- **AND** writes `## Round 1` questions to the file
- **AND** posts a full findings digest in chat and tells the user to open the doc

#### Scenario: Clarification before doc population for vague topics
- **WHEN** user invokes `/enpalspec:explore` with a topic too vague to investigate meaningfully
- **THEN** the skill creates the exploration doc (with Context only)
- **AND** asks the single most important clarifying question in chat
- **AND** continues asking clarifying questions (biggest blast radius first) until sufficient context exists
- **AND** only then writes `## Observations` and `## Round 1` to the document

#### Scenario: Doc created when no argument provided
- **WHEN** user invokes `/enpalspec:explore` without arguments
- **THEN** the skill uses the AskUserQuestion tool to ask what the user wants to explore
- **AND** derives a kebab-case topic from their response
- **AND** creates the exploration doc before proceeding

### Requirement: Document-first session model
The explore skill SHALL use the exploration document as the primary medium from session start. There is no Phase 1 / Phase 2 distinction. The assistant writes observations and questions to the document; the user answers in the document; chat serves as a rich companion posting findings summaries and decision digests.

#### Scenario: Observations and first round written in one shot
- **WHEN** the skill has sufficient context to begin
- **THEN** the skill writes `## Observations` and `## Round 1` to the document in a single operation before handing off to the user
- **AND** does NOT present a Phase 1 free-form dialogue in chat before writing to the document

#### Scenario: Chat posts findings digest after first write
- **WHEN** the skill finishes writing Observations and Round 1 to the document
- **THEN** the skill posts a full findings digest in chat (3–5 bullets summarising what was found and framed)
- **AND** tells the user to open the document and answer Round 1, then say "next"
- **AND** does NOT repeat the questions themselves in chat

#### Scenario: Chat posts decision summary after each answered round
- **WHEN** the user signals readiness after answering a round ("next", "done", etc.)
- **THEN** the skill reads the exploration file and absorbs the answers
- **AND** posts a brief decision summary in chat (what was decided in that round)
- **AND** writes the next round to the document (if more themes remain) or proceeds to wrap-up

#### Scenario: Skill supports as many rounds as needed
- **WHEN** the user answers a round and significant ambiguity remains
- **THEN** the skill identifies the next theme, appends the next round to the file, posts a decision summary and navigation prompt in chat
- **AND** continues until all significant design decisions are captured
- **AND** does NOT artificially limit to 2 or 3 rounds

### Requirement: Explore skill ends with Insights & Decisions and propose offer
The explore skill SHALL end the session by writing the `## Insights & Decisions` section to the exploration doc and offering to transition to the propose workflow. If questions remain unresolved, they SHALL be asked as a final round rather than listed as open questions.

#### Scenario: End-of-session wrap-up
- **WHEN** all Q&A rounds are complete and the user signals they are done
- **THEN** the skill writes the `## Insights & Decisions` section summarising all decisions made
- **AND** offers: "Ready to propose? Run `/enpalspec:propose`"

#### Scenario: Remaining questions asked as a round, not listed
- **WHEN** questions remain unresolved before wrap-up
- **THEN** the skill asks them as a final Q&A round in the document
- **AND** does NOT write a `## Open Questions` section to the document

## REMOVED Requirements

### Requirement: Phase 1 — open-ended exploration
**Reason:** Replaced by the document-first session model. The assistant's observations and framing are now written to the `## Observations` section upfront, not conducted as free-form chat dialogue.
**Migration:** No migration needed — this is a prompt-level change to seeded templates.

### Requirement: Phase 1 to Phase 2 transition
**Reason:** The Phase 1 / Phase 2 distinction is removed. There is no transition — the document is the medium from the start.
**Migration:** No migration needed.

### Requirement: Phase 1 question discipline
**Reason:** Phase 1 no longer exists. Vague topic clarification is handled by the new clarification flow (ask in chat before writing to doc).
**Migration:** No migration needed.
