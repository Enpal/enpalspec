## MODIFIED Requirements

### Requirement: Explore skill fetches guidance before any other action
The seeded explore skill (both `enpalspec-explore` skill and `enpalspec:explore` command) SHALL call `enpalspec guidance explore --json` as Step 1 in its numbered Steps sequence, before creating the exploration document or any other action. If the command returns a non-null `context`, the skill SHALL treat it as binding project constraints (tech stack, platform requirements, conventions) and apply them throughout the session without including them in the exploration document. If the command returns non-null `instructions`, the skill SHALL treat them as workflow-specific overrides that modify or extend the default behaviour of this skill for the session. If the command fails or returns null fields, the skill SHALL continue normally without error.

#### Scenario: Guidance returns context and instructions
- **WHEN** user invokes the explore skill
- **AND** `enpalspec guidance explore --json` returns `{ context: "TypeScript monorepo", instructions: "Always consider the SDK-first principle" }`
- **THEN** the skill treats `context` as binding constraints and applies them throughout the session
- **AND** the skill applies `instructions` as session-level overrides to its default behaviour
- **AND** does NOT include this guidance verbatim in the exploration document

#### Scenario: Guidance returns nothing
- **WHEN** user invokes the explore skill
- **AND** `enpalspec guidance explore --json` returns `{ context: null, instructions: null }`
- **THEN** the skill continues as normal with no change in behaviour

#### Scenario: Guidance command fails
- **WHEN** user invokes the explore skill
- **AND** `enpalspec guidance explore --json` exits with a non-zero code or is not found in PATH
- **THEN** the skill continues as normal without surfacing the error to the user

#### Scenario: Guidance step appears as Step 1 in the numbered sequence
- **WHEN** the explore skill template is rendered
- **THEN** the guidance fetch is Step 1 in a top-level `**Steps**` block
- **AND** topic derivation and document creation steps follow as Steps 2 and beyond
- **AND** no guidance step appears before the `**Steps**` heading as a floating preamble
