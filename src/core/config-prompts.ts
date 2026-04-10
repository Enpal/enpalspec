import type { ProjectConfig } from './project-config.js';

/**
 * Serialize config to YAML string with helpful comments.
 *
 * @param config - Partial config object (schema required, context/rules optional)
 * @returns YAML string ready to write to file
 */
export function serializeConfig(config: Partial<ProjectConfig>): string {
  const lines: string[] = [];

  // Schema (required)
  lines.push(`schema: ${config.schema}`);
  lines.push('');

  // Context section with comments
  lines.push('# Project context (optional)');
  lines.push('# This is shown to AI when creating artifacts.');
  lines.push('# Add your tech stack, conventions, style guides, domain knowledge, etc.');
  lines.push('# Example:');
  lines.push('#   context: |');
  lines.push('#     Tech stack: TypeScript, React, Node.js');
  lines.push('#     We use conventional commits');
  lines.push('#     Domain: e-commerce platform');
  lines.push('');

  // Rules section with comments
  lines.push('# Per-artifact rules (optional)');
  lines.push('# Add custom rules for specific artifacts.');
  lines.push('# Example:');
  lines.push('#   rules:');
  lines.push('#     proposal:');
  lines.push('#       - Keep proposals under 500 words');
  lines.push('#       - Always include a "Non-goals" section');
  lines.push('#     tasks:');
  lines.push('#       - Break tasks into chunks of max 2 hours');
  lines.push('');

  // Skills section with comments
  lines.push('# Per-skill instructions (optional)');
  lines.push('# Add project-specific guidance for each workflow skill.');
  lines.push('# The skill reads this at the start of each session.');
  lines.push('# Example:');
  lines.push('#   skills:');
  lines.push('#     explore: |');
  lines.push('#       Always consider our SDK-first architecture principle.');
  lines.push('#       Cross-subsystem operations belong in the orchestration layer.');
  lines.push('#     propose: |');
  lines.push('#       Proposals must include a rollback plan.');
  lines.push('#       Breaking changes require a migration path.');

  return lines.join('\n') + '\n';
}
