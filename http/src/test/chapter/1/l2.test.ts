import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('chapter 1 - L2', () => {
    const cliPath = path.resolve(__dirname, '../../../chapter/1/l2.ts');

    const result = spawnSync(
        "npx",            // command
        ["tsx", cliPath], // args
        { encoding: "utf8" } // options
    );

    assert.strictEqual(result.status, 0);
    assert.strictEqual(result.stdout.trim(), 'I hope I get the job!');
});
