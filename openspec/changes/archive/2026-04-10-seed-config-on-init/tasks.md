## 1. Refactor config field parsing

- [x] 1.1 Extract field-parsing logic from `readProjectConfig()` into a shared `parseConfigFields(raw: unknown): Partial<ProjectConfig>` helper in `src/core/project-config.ts`
- [x] 1.2 Update `readProjectConfig()` to call `parseConfigFields()` instead of inline parsing — behaviour unchanged

## 2. Update serializeConfig

- [x] 2.1 Update `serializeConfig()` in `src/core/config-prompts.ts` to accept full `Partial<ProjectConfig>` and write live YAML for `context` when present (block scalar `|` style)
- [x] 2.2 Update `serializeConfig()` to write live YAML for `rules` when present
- [x] 2.3 Update `serializeConfig()` to write live YAML for `skills` when present
- [x] 2.4 Ensure absent fields still render as comment-only blocks (no regression)

## 3. Add --config flag to CLI

- [x] 3.1 Add `.option('--config <file>', 'Path to a YAML seed file (context, rules, skills) to populate config.yaml')` to the `init` command in `src/cli/index.ts`
- [x] 3.2 Pass `configFile: options?.config` through to `InitCommand` constructor

## 4. Wire seed file into InitCommand

- [x] 4.1 Add `configFile?: string` to `InitCommandOptions` in `src/core/init.ts`
- [x] 4.2 Implement `readSeedFile(filePath: string): Partial<ProjectConfig>` private method — uses `path.resolve()` for cross-platform path handling, reads YAML, calls `parseConfigFields()`, ignores `schema` field
- [x] 4.3 Call `readSeedFile()` in `execute()` when `configFile` is set; store result as `seedData`
- [x] 4.4 Update `createConfig()` signature to accept `seedData: Partial<ProjectConfig>`
- [x] 4.5 In `createConfig()`: if config already exists and `seedData` is non-empty, emit `chalk.yellow` warning that seeding was skipped; return `'exists'` as before
- [x] 4.6 Pass `seedData` to `serializeConfig()` when writing the new config file

## 5. Add interactive context prompt

- [x] 5.1 In `execute()`, after tool selection and before `createConfig()`, call a new `promptForContext()` method when `canPromptInteractively()` is true and no seed file was provided
- [x] 5.2 Implement `promptForContext()` using `@inquirer/prompts` `input()` — message: `"Project context (optional, press Enter to skip):"`, returns trimmed string or `undefined` if empty
- [x] 5.3 Pass the collected context (if any) as part of `seedData` to `createConfig()`

## 6. Cross-platform verification

- [x] 6.1 Verify seed file path resolution uses `path.resolve()` (not string concat) — covers Windows `.\seed.yaml` style paths
- [x] 6.2 Add a Windows-path test case to the existing config-prompts or init unit tests if applicable
