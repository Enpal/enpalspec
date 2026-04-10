## ADDED Requirements

### Requirement: Explore skill fetches guidance before any other action
The seeded explore skill (both `enpalspec-explore` skill and `enpalspec:explore` command) SHALL call `enpalspec guidance explore --json` as its absolute first step, before creating the exploration document or any other action. If the command returns a non-null `context`, the skill SHALL treat it as project background throughout the session. If the command returns non-null `instructions`, the skill SHALL treat them as additional guidance for the session. If the command fails or returns null fields, the skill SHALL continue normally without error.

#### Scenario: Guidance returns context and instructions
- **WHEN** user invokes the explore skill
- **AND** `enpalspec guidance explore --json` returns `{ context: "TypeScript monorepo", instructions: "Always consider the SDK-first principle" }`
- **THEN** the skill uses both as background context for the rest of the session
- **AND** does NOT include this guidance verbatim in the exploration document

#### Scenario: Guidance returns nothing
- **WHEN** user invokes the explore skill
- **AND** `enpalspec guidance explore --json` returns `{ context: null, instructions: null }`
- **THEN** the skill continues as normal with no change in behaviour

#### Scenario: Guidance command fails
- **WHEN** user invokes the explore skill
- **AND** `enpalspec guidance explore --json` exits with a non-zero code or is not found in PATH
- **THEN** the skill continues as normal without surfacing the error to the user
