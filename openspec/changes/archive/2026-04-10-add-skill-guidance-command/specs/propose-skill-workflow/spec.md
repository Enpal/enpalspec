## ADDED Requirements

### Requirement: Propose skill fetches guidance before any other action
The seeded propose skill (both `enpalspec-propose` skill and `enpalspec:propose` command) SHALL call `enpalspec guidance propose --json` as its absolute first step, before parsing flags, scanning for exploration docs, or any other action. If the command returns a non-null `context`, the skill SHALL treat it as project background throughout the session. If the command returns non-null `instructions`, the skill SHALL treat them as additional guidance for the session. If the command fails or returns null fields, the skill SHALL continue normally without error.

#### Scenario: Guidance returns context and instructions
- **WHEN** user invokes the propose skill
- **AND** `enpalspec guidance propose --json` returns `{ context: "TypeScript monorepo", instructions: "Proposals must include a rollback plan" }`
- **THEN** the skill uses both as background context throughout artifact creation
- **AND** does NOT include this guidance verbatim in any generated artifact

#### Scenario: Guidance returns nothing
- **WHEN** user invokes the propose skill
- **AND** `enpalspec guidance propose --json` returns `{ context: null, instructions: null }`
- **THEN** the skill continues as normal with no change in behaviour

#### Scenario: Guidance command fails
- **WHEN** user invokes the propose skill
- **AND** `enpalspec guidance propose --json` exits with a non-zero code or is not found in PATH
- **THEN** the skill continues as normal without surfacing the error to the user
