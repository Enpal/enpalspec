import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests for searchable-multi-select keybinding behavior.
 *
 * We mock @inquirer/core to intercept the prompt's render function and
 * keypress handler, then simulate key events to verify:
 *   - Space toggles selection (add/remove)
 *   - Enter confirms and submits
 *   - Tab does NOT confirm (removed)
 *   - Hint text is updated
 */

// State store for the mock hook system
const state: Record<number, unknown> = {};
let stateIndex = 0;
let keypressHandler: ((key: Record<string, unknown>) => void) | null = null;
let renderOutput = '';

function resetState() {
  for (const k of Object.keys(state)) delete state[k as unknown as number];
  stateIndex = 0;
  keypressHandler = null;
  renderOutput = '';
  currentRenderFn = null;
  currentConfig = null;
  currentDone = null;
}

// Re-render: reset hook index, re-invoke the render function
let currentRenderFn: ((config: Record<string, unknown>, done: (v: string[]) => void) => string) | null = null;
let currentConfig: Record<string, unknown> | null = null;
let currentDone: ((v: string[]) => void) | null = null;

function rerender() {
  if (!currentRenderFn || !currentConfig || !currentDone) return;
  stateIndex = 0;
  renderOutput = currentRenderFn(currentConfig, currentDone);
}

vi.mock('@inquirer/core', () => {
  return {
    createPrompt: (fn: (config: Record<string, unknown>, done: (v: string[]) => void) => string) => {
      currentRenderFn = fn;
      return (config: Record<string, unknown>) => {
        return new Promise<string[]>((resolve) => {
          currentConfig = config;
          currentDone = resolve;
          stateIndex = 0;
          renderOutput = fn(config, resolve);
        });
      };
    },
    useState: (initial: unknown) => {
      const idx = stateIndex++;
      if (!(idx in state)) {
        state[idx] = typeof initial === 'function' ? (initial as () => unknown)() : initial;
      }
      const setter = (value: unknown) => {
        state[idx] = value;
        // Re-render after state change
        rerender();
      };
      return [state[idx], setter];
    },
    useKeypress: (handler: (key: Record<string, unknown>) => void) => {
      keypressHandler = handler;
    },
    useMemo: (fn: () => unknown, _deps: unknown[]) => fn(),
    usePrefix: () => '?',
    isEnterKey: (key: Record<string, unknown>) => key.name === 'return' || key.name === 'enter',
    isBackspaceKey: (key: Record<string, unknown>) => key.name === 'backspace',
    isUpKey: (key: Record<string, unknown>) => key.name === 'up',
    isDownKey: (key: Record<string, unknown>) => key.name === 'down',
  };
});

function pressKey(name: string) {
  if (!keypressHandler) throw new Error('No keypress handler registered');
  keypressHandler({ name, ctrl: false });
}

function getSelectedValues(): string[] {
  return (state[1] as string[]) ?? [];
}

function getStatus(): string {
  return (state[3] as string) ?? 'idle';
}

function getError(): string | null {
  return (state[4] as string | null) ?? null;
}

const testChoices = [
  { name: 'Tool A', value: 'tool-a' },
  { name: 'Tool B', value: 'tool-b' },
  { name: 'Tool C', value: 'tool-c' },
];

async function setup(choices = testChoices, validate?: (selected: string[]) => boolean | string) {
  resetState();

  const mod = await import('../../src/prompts/searchable-multi-select.js');

  // Fire and forget - the promise resolves only when done() is called via Enter
  // We just need the side effect of registering the keypress handler
  mod.searchableMultiSelect({
    message: 'Select tools',
    choices,
    validate,
  });

  // The async chain in searchableMultiSelect involves:
  //   1. await createSearchableMultiSelect() -> await import('@inquirer/core')
  //   2. prompt(config) which registers the keypress handler synchronously
  // Flush enough microtask ticks for the full chain to settle.
  await vi.waitFor(() => {
    if (!keypressHandler) throw new Error('Keypress handler not yet registered');
  }, { timeout: 500 });
}

describe('searchable-multi-select keybindings', () => {
  beforeEach(() => {
    resetState();
    vi.resetModules();
  });

  describe('Space to toggle', () => {
    it('should select highlighted item when Space is pressed', async () => {
      await setup();
      pressKey('space');
      expect(getSelectedValues()).toContain('tool-a');
    });

    it('should deselect highlighted item when Space is pressed on already-selected item', async () => {
      await setup();
      pressKey('space');
      expect(getSelectedValues()).toContain('tool-a');

      pressKey('space');
      expect(getSelectedValues()).not.toContain('tool-a');
    });

    it('should toggle multiple items independently', async () => {
      await setup();

      // Select Tool A
      pressKey('space');
      expect(getSelectedValues()).toEqual(['tool-a']);

      // Move down to Tool B, select it
      pressKey('down');
      pressKey('space');
      expect(getSelectedValues()).toContain('tool-a');
      expect(getSelectedValues()).toContain('tool-b');

      // Move back up to Tool A, deselect it
      pressKey('up');
      pressKey('space');
      expect(getSelectedValues()).not.toContain('tool-a');
      expect(getSelectedValues()).toContain('tool-b');
    });
  });

  describe('Enter to confirm', () => {
    it('should set status to done when Enter is pressed', async () => {
      await setup();
      pressKey('space');
      pressKey('return');
      expect(getStatus()).toBe('done');
    });

    it('should confirm with empty selection', async () => {
      await setup();
      pressKey('return');
      expect(getStatus()).toBe('done');
    });

    it('should show validation error when nothing can be added and validation fails', async () => {
      // With smart-Enter, a highlighted selectable row is auto-added, so validation can only
      // fail when the highlighted row is non-selectable (disabled) and nothing else is selected.
      const choices = [{ name: 'Coming soon', value: 'agents', disabled: true }];
      const validate = (selected: string[]) =>
        selected.length > 0 ? true : 'Select at least one';
      await setup(choices, validate);

      pressKey('return');
      expect(getStatus()).toBe('idle');
      expect(getError()).toBe('Select at least one');
    });

    it('should confirm when validation passes', async () => {
      const validate = (selected: string[]) =>
        selected.length > 0 ? true : 'Select at least one';
      await setup(testChoices, validate);

      pressKey('space');
      pressKey('return');
      expect(getStatus()).toBe('done');
    });
  });

  describe('Smart-Enter selects the highlighted row', () => {
    it('should add the highlighted unselected tool on Enter (empty initial selection)', async () => {
      await setup();
      // Cursor starts on Tool A; move to Tool B without toggling, then Enter.
      pressKey('down');
      pressKey('return');
      expect(getStatus()).toBe('done');
      expect(getSelectedValues()).toEqual(['tool-b']);
    });

    it('should add the highlighted tool even when another tool is already selected', async () => {
      // Tool A is pre-selected (mirrors an already-configured tool like Claude).
      const choices = [
        { name: 'Tool A', value: 'tool-a', preSelected: true },
        { name: 'Tool B', value: 'tool-b' },
        { name: 'Tool C', value: 'tool-c' },
      ];
      await setup(choices);
      expect(getSelectedValues()).toEqual(['tool-a']);

      // Arrow to the unselected Tool C and press Enter (the Codex-while-Claude-configured case).
      pressKey('down');
      pressKey('down');
      pressKey('return');
      expect(getStatus()).toBe('done');
      expect(getSelectedValues()).toContain('tool-a');
      expect(getSelectedValues()).toContain('tool-c');
    });

    it('should not duplicate an already-selected highlighted tool on Enter', async () => {
      await setup();
      // Toggle Tool A on; cursor stays on Tool A.
      pressKey('space');
      expect(getSelectedValues()).toEqual(['tool-a']);
      pressKey('return');
      expect(getStatus()).toBe('done');
      expect(getSelectedValues()).toEqual(['tool-a']);
    });

    it('should not add a non-selectable (disabled) highlighted row on Enter', async () => {
      const choices = [
        { name: 'Tool A', value: 'tool-a' },
        { name: 'Coming soon', value: 'agents', disabled: true },
      ];
      await setup(choices);
      // Move to the disabled row and press Enter.
      pressKey('down');
      pressKey('return');
      expect(getSelectedValues()).not.toContain('agents');
    });
  });

  describe('Tab does not confirm', () => {
    it('should not change status when Tab is pressed', async () => {
      await setup();
      pressKey('space');
      pressKey('tab');
      expect(getStatus()).toBe('idle');
    });
  });

  describe('hint text', () => {
    it('should include Space toggle and Enter confirm in rendered output', async () => {
      await setup();
      expect(renderOutput).toContain('Space');
      expect(renderOutput).toContain('toggle');
      expect(renderOutput).toContain('Enter');
      expect(renderOutput).toContain('confirm');
      // Enter copy clarifies it selects the highlighted row before confirming.
      expect(renderOutput).toContain('highlighted');
      expect(renderOutput).not.toMatch(/Tab.*confirm/);
    });
  });
});
