import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runCLI } from '../helpers/run-cli.js';

describe('enpalspec guidance CLI', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'enpalspec-guidance-cli-'));
    await fs.mkdir(path.join(tempDir, 'openspec'), { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should return JSON with context and instructions', async () => {
    await fs.writeFile(
      path.join(tempDir, 'openspec', 'config.yaml'),
      `schema: spec-driven
context: "TypeScript monorepo"
skills:
  explore: "Always consider SDK-first"
`
    );

    const result = await runCLI(['guidance', 'explore', '--json'], { cwd: tempDir });

    expect(result.exitCode).toBe(0);
    const json = JSON.parse(result.stdout);
    expect(json).toEqual({
      skill: 'explore',
      context: 'TypeScript monorepo',
      instructions: 'Always consider SDK-first',
    });
  }, 30000);

  it('should return null fields when no config exists', async () => {
    const result = await runCLI(['guidance', 'explore', '--json'], { cwd: tempDir });

    expect(result.exitCode).toBe(0);
    const json = JSON.parse(result.stdout);
    expect(json).toEqual({
      skill: 'explore',
      context: null,
      instructions: null,
    });
  }, 30000);
});
