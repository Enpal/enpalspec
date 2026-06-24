## ADDED Requirements

### Requirement: Codex configured/detected state from its global home
The system SHALL determine Codex's configured/detected state from its global home directory in addition to the project directory, because Codex slash commands are written to a global location rather than the project. The Codex home SHALL be resolved as `CODEX_HOME` when set, otherwise `<homedir>/.codex`, using `path.join`/`path.resolve` and never hardcoded separators. Detection SHALL use explicit lookups of known generated artifacts (the `enpalspec` command namespace and tracked command IDs, and the tracked skill names) rather than pattern matching.

#### Scenario: Codex detected from global command prompts
- **WHEN** EnpalSpec command files (named `<COMMAND_NAMESPACE>-<commandId>.md` for tracked command IDs) exist under `<codexHome>/prompts/`
- **THEN** Codex SHALL be reported as configured/detected
- **AND** the interactive selection SHALL pre-select Codex so it can be refreshed

#### Scenario: Codex detected from project skills when delivery is skills-only
- **WHEN** no global command files exist but EnpalSpec skill files exist under the project `.codex/skills/<skill-name>/SKILL.md` for tracked skill names
- **THEN** Codex SHALL be reported as configured

#### Scenario: CODEX_HOME overrides the default location
- **WHEN** the `CODEX_HOME` environment variable is set
- **THEN** Codex detection SHALL look under `<CODEX_HOME>/prompts/` instead of `<homedir>/.codex/prompts/`

#### Scenario: Codex not configured when no EnpalSpec artifacts are present
- **WHEN** the Codex home directory exists but contains no EnpalSpec-generated command or skill files
- **THEN** Codex SHALL NOT be reported as configured

#### Scenario: Path construction on Windows
- **WHEN** resolving the Codex home and artifact paths on Windows
- **THEN** the system SHALL use `path.join()`/`path.resolve()` for all path construction
- **AND** SHALL NOT hardcode forward slashes
