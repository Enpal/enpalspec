## MODIFIED Requirements

### Requirement: Propose skill fetches guidance before any other action
The seeded propose skill (both `enpalspec-propose` skill and `enpalspec:propose` command) SHALL call `enpalspec guidance propose --json` as Step 1 in its numbered Steps sequence, before parsing flags, scanning for exploration docs, or any other action. If the command returns a non-null `context`, the skill SHALL treat it as binding project constraints (tech stack, platform requirements, conventions) and apply them throughout the session without including them in any generated output. If the command returns non-null `instructions`, the skill SHALL treat them as workflow-specific overrides that modify or extend the default behaviour of this skill for the session. If the command fails or returns null fields, the skill SHALL continue normally without error.

#### Scenario: Guidance returns context and instructions
- **WHEN** user invokes the propose skill
- **AND** `enpalspec guidance propose --json` returns `{ context: "TypeScript monorepo", instructions: "Proposals must include a rollback plan" }`
- **THEN** the skill treats `context` as binding constraints and applies them throughout artifact creation
- **AND** the skill applies `instructions` as session-level overrides to its default behaviour
- **AND** does NOT include this guidance verbatim in any generated artifact

#### Scenario: Guidance returns nothing
- **WHEN** user invokes the propose skill
- **AND** `enpalspec guidance propose --json` returns `{ context: null, instructions: null }`
- **THEN** the skill continues as normal with no change in behaviour

#### Scenario: Guidance command fails
- **WHEN** user invokes the propose skill
- **AND** `enpalspec guidance propose --json` exits with a non-zero code or is not found in PATH
- **THEN** the skill continues as normal without surfacing the error to the user

#### Scenario: Guidance step appears as Step 1 in the numbered sequence
- **WHEN** the propose skill template is rendered
- **THEN** the guidance fetch is Step 1 in the `**Steps**` block
- **AND** the `--exploration` flag parsing step is Step 2 or later
- **AND** no guidance step appears before the `**Steps**` heading as a floating preamble
