## MODIFIED Requirements

### Requirement: Interactive Mode
The command SHALL provide an interactive searchable multi-select for AI tool selection with clear navigation instructions, and SHALL configure the highlighted tool when Enter is pressed on a selectable tool that is not already selected.

#### Scenario: Displaying interactive menu
- **WHEN** run in fresh or extend mode
- **THEN** present a searchable multi-select that lets users filter by typing, toggle tools with Space, and confirm with Enter
- **AND** display inline instructions clarifying that Space toggles tools and Enter selects the highlighted tool before confirming
- **AND** mark already-configured tools as pre-selected so Enter refreshes them

#### Scenario: Enter on a highlighted unselected tool adds it before confirming
- **WHEN** the user moves the cursor to a selectable tool that is not currently toggled and presses Enter
- **THEN** automatically add that highlighted tool to the selection before validating and confirming
- **AND** include the highlighted tool in the configured set so it is set up
- **AND** apply this even when other tools (for example an already-configured tool) are already selected

#### Scenario: Enter does not re-add an already-selected highlighted tool
- **WHEN** the highlighted tool is already in the selection and the user presses Enter
- **THEN** confirm the current selection without duplicating the highlighted tool

#### Scenario: Enter ignores non-selectable highlighted rows
- **WHEN** the highlighted row is not a selectable tool
- **THEN** Enter SHALL NOT add it to the selection
