## ADDED Requirements

### Requirement: --config flag option

The `enpalspec init` command SHALL expose a `--config <file>` option in its CLI interface.

#### Scenario: Flag appears in help output

- **WHEN** user runs `enpalspec init --help`
- **THEN** `--config <file>` SHALL appear in the options list
- **AND** the description SHALL explain it accepts a YAML seed file path

## MODIFIED Requirements

### Requirement: Config File Generation

The command SHALL create an OpenSpec config file with schema settings, optionally seeded with values from a `--config` seed file or an interactive context prompt.

#### Scenario: Creating config.yaml

- **WHEN** initialization completes
- **AND** config.yaml does not exist
- **THEN** create `openspec/config.yaml` with default schema setting
- **AND** display config location in output

#### Scenario: Preserving existing config.yaml

- **WHEN** initialization runs in extend mode
- **AND** `openspec/config.yaml` already exists
- **THEN** preserve the existing config file
- **AND** display "(exists)" indicator in output

#### Scenario: Creating config.yaml with seed file content

- **WHEN** initialization completes
- **AND** config.yaml does not exist
- **AND** `--config <file>` was passed with a valid seed file
- **THEN** create `openspec/config.yaml` containing both the default schema and any seeded fields as live YAML

#### Scenario: Skipping seed when config exists

- **WHEN** `--config <file>` was passed
- **AND** `openspec/config.yaml` already exists
- **THEN** display a yellow warning that seeding was skipped
- **AND** leave the existing `config.yaml` unchanged
