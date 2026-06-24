import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { beforeEach, afterEach } from 'vitest';

/**
 * Codex stores its slash commands in a global home (`~/.codex` by default), so
 * both command generation and tool detection touch a location outside any test
 * project directory. Point CODEX_HOME at a fresh temp directory before each test
 * so tests never read or write the developer's real `~/.codex`, and one test's
 * generated commands can't leak into a later test's detection.
 *
 * A per-test (not per-file) reset is required: a single test that initializes
 * Codex writes command files that would otherwise make Codex appear "configured"
 * for every subsequent test in the same file.
 */
let codexHome: string;

beforeEach(() => {
  codexHome = path.join(
    os.tmpdir(),
    `enpalspec-codex-home-${process.pid}-${randomUUID()}`
  );
  process.env.CODEX_HOME = codexHome;
});

afterEach(() => {
  try {
    rmSync(codexHome, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup; ignore if the directory was never created.
  }
});
