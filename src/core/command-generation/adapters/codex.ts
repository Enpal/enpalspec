/**
 * Codex Command Adapter
 *
 * Formats commands for Codex following its frontmatter specification.
 * Codex custom prompts live in the global home directory (~/.codex/prompts/)
 * and are not shared through the repository. The CODEX_HOME env var can
 * override the default ~/.codex location.
 */

import path from 'path';
import type { CommandContent, ToolCommandAdapter } from '../types.js';
import { COMMAND_NAMESPACE } from '../namespace.js';
import { getCodexHome } from '../codex-home.js';

/**
 * Codex adapter for command generation.
 * File path: <CODEX_HOME>/prompts/enpalspec-<id>.md (absolute, global)
 * Frontmatter: description, argument-hint
 */
export const codexAdapter: ToolCommandAdapter = {
  toolId: 'codex',

  getFilePath(commandId: string): string {
    return path.join(getCodexHome(), 'prompts', `${COMMAND_NAMESPACE}-${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    return `---
description: ${content.description}
argument-hint: command arguments
---

${content.body}
`;
  },
};
