## MODIFIED Requirements

### Requirement: Exploration doc structure
The exploration document SHALL contain the following sections in order: a top-level heading with the topic, metadata (date, linked change if any), a Context section written at session start, an Observations section written by the assistant before any Q&A rounds, a Rounds section where Q&A questions are appended before the user answers them, and an Insights & Decisions section written at the end. There is no Open Questions section.

#### Scenario: Document created at session start
- **WHEN** an explore session begins
- **THEN** the document is created immediately with the heading, metadata, and Context section filled in
- **AND** the Observations section is present with a `<!-- Written by assistant before Round 1 -->` placeholder
- **AND** the Rounds section is present with a placeholder comment
- **AND** there is NO `## Open Questions` section in the template

#### Scenario: Observations section written before Round 1
- **WHEN** the skill writes to the document for the first time
- **THEN** the `## Observations` section is filled with codebase findings, diagrams, and framing
- **AND** `## Round 1` questions are appended immediately after in the same operation
- **AND** this all happens before the user has answered anything

#### Scenario: Q&A round appended before user answers
- **WHEN** a Q&A round begins
- **THEN** the round's questions are appended to the `## Rounds` section with the user's answer fields left blank
- **AND** the document is NOT rewritten from scratch — only appended to
- **AND** the user fills in the answers by editing the file directly

#### Scenario: Session ends with Insights & Decisions only
- **WHEN** the explore session concludes
- **THEN** the `## Insights & Decisions` section is written summarising all decisions made
- **AND** no `## Open Questions` section is written — unresolved questions are asked as a final round instead

## REMOVED Requirements

### Requirement: Exploration doc Notes section
**Reason:** Replaced by `## Observations`. The Notes section was written at the Phase 1 → Phase 2 transition, which no longer exists. Observations is written upfront before any Q&A.
**Migration:** No migration needed for existing docs — format change is forward-only.
