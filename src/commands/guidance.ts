/**
 * Guidance Command
 *
 * Returns project context and skill-specific instructions from config.yaml
 * for use by seeded skills at the start of each session.
 */

import { readProjectConfig } from '../core/project-config.js';

export interface GuidanceOptions {
  json?: boolean;
}

export interface GuidanceResult {
  skill: string;
  context: string | null;
  instructions: string | null;
}

/**
 * Reads config.yaml and returns guidance for a named skill.
 * Always succeeds — returns null fields if config is missing or skill is not configured.
 */
export function guidanceCommand(skillName: string, options: GuidanceOptions): void {
  const projectRoot = process.cwd();

  let projectConfig = null;
  try {
    projectConfig = readProjectConfig(projectRoot);
  } catch {
    // Graceful degradation: config unreadable, return empty guidance
  }

  const result: GuidanceResult = {
    skill: skillName,
    context: projectConfig?.context?.trim() || null,
    instructions: projectConfig?.skills?.[skillName]?.trim() || null,
  };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Human-readable output — omit null fields
  if (result.context) {
    console.log('## Project Context\n');
    console.log(result.context);
    console.log();
  }

  if (result.instructions) {
    console.log(`## Guidance for: ${result.skill}\n`);
    console.log(result.instructions);
    console.log();
  }

  if (!result.context && !result.instructions) {
    console.log(`No guidance configured for skill: ${result.skill}`);
  }
}
