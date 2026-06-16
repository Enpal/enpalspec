/**
 * Shared Q&A checkbox format for exploration documents.
 * Used by both the explore skill and the explore command template.
 */

export const EXPLORATION_QUESTION_EXAMPLE = `\`\`\`markdown
### QN.M — <Question title>

<1-sentence question or context>

- [x] Recommended option ← recommended: reason
- [ ] Alternative option
- [ ] Another alternative

> **Your answer / freetext:**
>
\`\`\``;

export const EXPLORATION_QA_CHECKBOX_RULES = `### Checkbox options (mandatory for every question)

Every question under \`## Rounds\` MUST use markdown checkbox options. This is non-negotiable.

**Required for each \`### QN.M\` question:**
- 2–4 concrete options as markdown checkboxes (\`- [ ]\` / \`- [x]\`)
- Exactly ONE option pre-selected: \`- [x]\` on the recommended option
- The recommended line MUST include \`← recommended: <reason>\` on the same line
- All other options MUST be \`- [ ]\` (unchecked)
- A freetext block: \`> **Your answer / freetext:**\` followed by a blank \`>\` line

**Never do this:**
- Prose-only options ("Option A", "Approach B", bullet lists without checkboxes)
- ASCII option diagrams without checkbox lines underneath
- Putting \`← recommended:\` on an unchecked \`[ ]\` line
- Pre-selecting a non-recommended option with \`[x]\`
- Asking decision questions in chat instead of writing them to the file
- Skipping checkboxes because there are "only two choices"

**Default UX:** the user can accept your recommendation by leaving the pre-selected \`[x]\` unchanged and saying "next". Only change checkboxes if they disagree.

Before appending any round, verify each question has checkbox lines and exactly one \`[x]\` on the recommended option.`;
