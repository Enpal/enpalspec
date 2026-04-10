## ADDED Requirements

### Requirement: Seed file flag

`enpalspec init` SHALL accept a `--config <file>` flag that reads a YAML seed file and uses its values to populate `openspec/config.yaml` at init time.

#### Scenario: Seeding context from file

- **WHEN** `enpalspec init --config ./enpalspec-seed.yaml` is run
- **AND** the seed file contains a `context` field
- **THEN** the generated `config.yaml` SHALL contain the `context` value as live YAML (not a comment)

#### Scenario: Seeding rules from file

- **WHEN** `enpalspec init --config ./enpalspec-seed.yaml` is run
- **AND** the seed file contains a `rules` field
- **THEN** the generated `config.yaml` SHALL contain the `rules` value as live YAML (not a comment)

#### Scenario: Seeding skills from file

- **WHEN** `enpalspec init --config ./enpalspec-seed.yaml` is run
- **AND** the seed file contains a `skills` field
- **THEN** the generated `config.yaml` SHALL contain the `skills` value as live YAML (not a comment)

#### Scenario: Partial seed file

- **WHEN** the seed file contains only some fields (e.g., only `context`)
- **THEN** the generated `config.yaml` SHALL contain live YAML for the fields present
- **AND** comment blocks SHALL remain for absent fields

#### Scenario: Seed file schema field is ignored

- **WHEN** the seed file contains a `schema` field
- **THEN** `enpalspec init` SHALL ignore it
- **AND** the generated `config.yaml` SHALL use `DEFAULT_SCHEMA` (`enpal-spec-driven`)

#### Scenario: Seed file cannot be read

- **WHEN** `--config <file>` is passed but the file does not exist or cannot be parsed
- **THEN** emit a warning
- **AND** continue init with comment-only config.yaml (graceful degradation)

#### Scenario: Seed file on Windows paths

- **WHEN** `--config` is provided with a Windows-style path (e.g., `.\seed.yaml`)
- **THEN** resolve the path using `path.resolve()` before reading
- **AND** produce the same result as on Unix

### Requirement: Config already exists warning

When a seed file is provided but `config.yaml` already exists, `enpalspec init` SHALL warn the caller and skip seeding.

#### Scenario: Skipping seed when config exists

- **WHEN** `enpalspec init --config ./seed.yaml` is run
- **AND** `openspec/config.yaml` already exists
- **THEN** display a visible warning that config seeding was skipped (yellow text)
- **AND** leave the existing `config.yaml` unchanged
- **AND** continue init successfully (exit code 0)

### Requirement: Interactive context prompt

In interactive mode, `enpalspec init` SHALL prompt the user for optional project context before writing `config.yaml`.

#### Scenario: User provides context interactively

- **WHEN** `enpalspec init` runs interactively (stdin is a TTY and `--tools` is not set)
- **AND** `config.yaml` does not yet exist
- **THEN** display a one-line input prompt: "Project context (optional, press Enter to skip):"
- **AND** if the user enters text, write it as the `context` field in `config.yaml`

#### Scenario: User skips interactive context

- **WHEN** the user presses Enter without typing anything at the context prompt
- **THEN** no `context` field is written to `config.yaml`
- **AND** the comment block for `context` remains in the file

#### Scenario: Interactive prompt suppressed in non-interactive mode

- **WHEN** stdin is not a TTY or `--tools` flag is set
- **THEN** the context prompt SHALL NOT be displayed
- **AND** init proceeds without asking for context
