import type { ProjectConfig } from './project-config.js';

/**
 * Serialize config to YAML string with helpful comments.
 *
 * Fields present in `config` are written as live YAML.
 * Fields absent are written as commented-out examples.
 *
 * @param config - Partial config object (schema required, context/rules/skills optional)
 * @returns YAML string ready to write to file
 */
export function serializeConfig(config: Partial<ProjectConfig>): string {
  const lines: string[] = [];

  // Schema (required)
  lines.push(`schema: ${config.schema}`);
  lines.push('');

  // Context section
  if (config.context) {
    lines.push('# Project context (shown to AI when creating artifacts)');
    lines.push('context: |');
    for (const line of config.context.split('\n')) {
      lines.push(`  ${line}`);
    }
    // Remove trailing empty indented lines
    while (lines[lines.length - 1] === '  ') {
      lines.pop();
    }
    lines.push('');
  } else {
    lines.push('# Project context (optional)');
    lines.push('# This is shown to AI when creating artifacts.');
    lines.push('# Add your tech stack, conventions, style guides, domain knowledge, etc.');
    lines.push('# Example:');
    lines.push('#   context: |');
    lines.push('#     Tech stack: TypeScript, React, Node.js');
    lines.push('#     We use conventional commits');
    lines.push('#     Domain: e-commerce platform');
    lines.push('');
  }

  // Rules section
  if (config.rules && Object.keys(config.rules).length > 0) {
    lines.push('# Per-artifact rules (additive to schema guidance)');
    lines.push('rules:');
    for (const [artifactId, ruleList] of Object.entries(config.rules)) {
      lines.push(`  ${artifactId}:`);
      for (const rule of ruleList) {
        lines.push(`    - ${rule}`);
      }
    }
    lines.push('');
  } else {
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
  }

  // Skills section
  if (config.skills && Object.keys(config.skills).length > 0) {
    lines.push('# Per-skill instructions (read by skills at the start of each session)');
    lines.push('skills:');
    for (const [skillName, instruction] of Object.entries(config.skills)) {
      lines.push(`  ${skillName}: |`);
      for (const line of instruction.split('\n')) {
        lines.push(`    ${line}`);
      }
      // Remove trailing empty indented lines
      while (lines[lines.length - 1] === '    ') {
        lines.pop();
      }
    }
  } else {
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
  }

  return lines.join('\n') + '\n';
}
