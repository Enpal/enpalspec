# skill-guidance-command Specification

## Purpose
Define the `enpalspec guidance <skill-name>` command that returns project context and skill-specific instructions from `openspec/config.yaml`.

## Requirements

### Requirement: Guidance command returns project context and skill-specific instructions
The system SHALL provide an `enpalspec guidance <skill-name>` command that reads `openspec/config.yaml` and returns the shared project `context` field and the skill-specific instruction string from the `skills.<skill-name>` key.

#### Scenario: Config has both context and skill-specific instructions
- **WHEN** user runs `enpalspec guidance explore --json`
- **AND** `openspec/config.yaml` contains `context: "Tech stack: TypeScript"` and `skills: { explore: "Always consider our microservices arch" }`
- **THEN** the command outputs `{ "skill": "explore", "context": "Tech stack: TypeScript", "instructions": "Always consider our microservices arch" }`

#### Scenario: Config has context but no skill entry
- **WHEN** user runs `enpalspec guidance propose --json`
- **AND** `openspec/config.yaml` has `context:` but no `skills.propose` key
- **THEN** the command outputs `{ "skill": "propose", "context": "...", "instructions": null }`

#### Scenario: Config has skill entry but no shared context
- **WHEN** user runs `enpalspec guidance apply --json`
- **AND** `openspec/config.yaml` has `skills: { apply: "..." }` but no `context:` field
- **THEN** the command outputs `{ "skill": "apply", "context": null, "instructions": "..." }`

#### Scenario: Config has no skills key at all
- **WHEN** user runs `enpalspec guidance explore --json`
- **AND** `openspec/config.yaml` has no `skills:` key
- **THEN** the command outputs `{ "skill": "explore", "context": null, "instructions": null }` without error

#### Scenario: No config file exists
- **WHEN** user runs `enpalspec guidance explore --json`
- **AND** no `openspec/config.yaml` or `openspec/config.yml` exists
- **THEN** the command outputs `{ "skill": "explore", "context": null, "instructions": null }` without error

#### Scenario: Human-readable output (no --json flag)
- **WHEN** user runs `enpalspec guidance explore` without `--json`
- **THEN** the command prints context and instructions as labelled sections to stdout
- **AND** omits any section whose value is null

### Requirement: Guidance command accepts any skill name without validation
The system SHALL accept any string as the skill name argument and return results without validating the name against a known allowlist.

#### Scenario: Unknown skill name
- **WHEN** user runs `enpalspec guidance unknown-skill --json`
- **THEN** the command looks up `skills.unknown-skill` in config and returns the result
- **AND** does NOT emit a warning or error about the unknown skill name

#### Scenario: Skill name not present in skills map
- **WHEN** user runs `enpalspec guidance archive --json`
- **AND** `skills:` map exists but has no `archive` key
- **THEN** `instructions` is null in the response

### Requirement: Guidance command fails gracefully when config is unreadable
The system SHALL return empty fields rather than exit with an error when config cannot be read.

#### Scenario: Config file has invalid YAML
- **WHEN** user runs `enpalspec guidance explore --json`
- **AND** `openspec/config.yaml` contains malformed YAML
- **THEN** the command outputs `{ "skill": "explore", "context": null, "instructions": null }` and exits with code 0
