import { describe, expect, it } from 'vitest';

import {
  getExploreSkillTemplate,
  getOpsxExploreCommandTemplate,
} from '../../../src/core/templates/skill-templates.js';
import {
  EXPLORATION_QA_CHECKBOX_RULES,
  EXPLORATION_QUESTION_EXAMPLE,
} from '../../../src/core/templates/workflows/explore-qa-format.js';

const REQUIRED_PHRASES = [
  'Checkbox options (mandatory for every question)',
  'Exactly ONE option pre-selected',
  '← recommended: <reason>',
  'Prose-only options',
  'accept your recommendation',
  'verify each question has checkbox lines',
];

describe('explore Q&A checkbox format', () => {
  it('exports a question example with pre-selected recommended option', () => {
    expect(EXPLORATION_QUESTION_EXAMPLE).toContain('- [x] Recommended option ← recommended: reason');
    expect(EXPLORATION_QUESTION_EXAMPLE).toContain('- [ ] Alternative option');
    expect(EXPLORATION_QUESTION_EXAMPLE).toContain('> **Your answer / freetext:**');
  });

  it('exports mandatory checkbox rules', () => {
    for (const phrase of REQUIRED_PHRASES) {
      expect(EXPLORATION_QA_CHECKBOX_RULES).toContain(phrase);
    }
  });

  it('includes checkbox rules in the explore skill template', () => {
    const instructions = getExploreSkillTemplate().instructions;

    expect(instructions).toContain('Checkbox options (mandatory for every question)');
    expect(instructions).toContain('Checkbox options always');
    expect(instructions).toContain('Every question in Round 1 MUST follow the checkbox format');
  });

  it('includes checkbox rules in the explore command template', () => {
    const content = getOpsxExploreCommandTemplate().content;

    expect(content).toContain('Checkbox options (mandatory for every question)');
    expect(content).toContain('Checkbox options always');
    expect(content).toContain('Every question in Round 1 MUST follow the checkbox format');
  });
});
