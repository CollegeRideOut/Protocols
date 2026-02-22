import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('chapter 1 - L3', () => {
  const cliPath = path.resolve(__dirname, './l3.ts');


  const result = spawnSync(
    "npx",            // command
    ["tsx", cliPath], // args
    { encoding: "utf8" } // options
  );

  assert.strictEqual(result.status, 0);
  const input = readFileSync(path.resolve(__dirname, '../../../messages.txt'));
  let expected = '';
  for (let i = 0; i < input.length; i += 8) {
    const chunk = input.subarray(i, i + 8);
    expected += `read: ${chunk.toString()}\n`;
  }
  assert.strictEqual(result.stdout, expected);
});
