## MODIFIED Requirements

### Requirement: enpalspec binary entry

The package SHALL declare `enpalspec` as its bin entry in `package.json`, pointing to the existing CLI entry point. The `openspec` bin entry SHALL be removed. The CLI program registered with Commander SHALL be named `enpalspec`, so that `--help` and error output displays `Usage: enpalspec` rather than `Usage: openspec`.

#### Scenario: CLI resolves as enpalspec

- **WHEN** the package is installed globally
- **THEN** `enpalspec --version` outputs the current version
- **AND** `openspec --version` is not provided by this package

#### Scenario: No dual-binary confusion

- **WHEN** only enpalspec is installed
- **THEN** running `openspec` produces a "command not found" error (not resolved by this package)

#### Scenario: Help output uses enpalspec name

- **WHEN** the user runs `enpalspec --help`
- **THEN** the usage line reads `Usage: enpalspec [options] [command]`
- **AND** no line in the help output references `openspec`
