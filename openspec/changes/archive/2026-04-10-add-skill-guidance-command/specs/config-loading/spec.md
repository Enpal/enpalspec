## ADDED Requirements

### Requirement: Parse skills field as a string map
The system SHALL parse the `skills` field in `openspec/config.yaml` as a `Record<string, string>` — a map of skill name to instruction string. Each entry SHALL be parsed independently. Non-string values for individual entries SHALL be skipped with a warning without discarding the rest of the map.

#### Scenario: Valid skills field with multiple entries
- **WHEN** config contains `skills: { explore: "Consider our arch", propose: "Include rollback" }`
- **THEN** both entries are included in the returned config's `skills` map

#### Scenario: Skills field is missing
- **WHEN** config has no `skills:` key
- **THEN** `skills` is undefined in returned config without warning

#### Scenario: Skills field is an empty object
- **WHEN** config contains `skills: {}`
- **THEN** `skills` is undefined or omitted in returned config (no valid entries)

#### Scenario: Individual skill entry has non-string value
- **WHEN** config contains `skills: { explore: 123, propose: "Valid instruction" }`
- **THEN** warning is logged for `explore` entry, but `propose` is included in returned config

#### Scenario: Skills field is not an object
- **WHEN** config contains `skills: "not an object"`
- **THEN** warning is logged and `skills` field is not included in returned config

#### Scenario: Skill name is an arbitrary string
- **WHEN** config contains `skills: { "my-custom-skill": "..." }`
- **THEN** the entry is included in returned config without validation of the key name
