/**
 * Codex home resolution.
 *
 * Codex stores custom prompts globally rather than in the project. The home
 * directory is `CODEX_HOME` when set, otherwise `<homedir>/.codex`. This is the
 * single source of truth shared by the command adapter and tool detection.
 */

import os from 'os';
import path from 'path';

/**
 * Returns the absolute Codex home directory.
 * Respects the CODEX_HOME env var, defaulting to `<homedir>/.codex`.
 */
export function getCodexHome(): string {
  const envHome = process.env.CODEX_HOME?.trim();
  return path.resolve(envHome ? envHome : path.join(os.homedir(), '.codex'));
}
