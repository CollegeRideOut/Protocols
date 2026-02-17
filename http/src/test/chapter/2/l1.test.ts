import test from 'node:test';
import assert from 'node:assert';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync, createWriteStream } from 'node:fs';
import net from 'node:net'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('chapter 2 - L1', async () => {
    const cliPath = path.resolve(__dirname, '../../../chapter/2/l1.ts');
    let str = 'Do you have what it takes to be an engineer at TheStartup™?\r\n'
    const outputFile = "/tmp/tcp.txt";

    const server = spawn("npx", ["tsx", cliPath, "."], { stdio: ["ignore", "pipe", "pipe"] });
    server.stdout.on("data", (data) => {
        if (!data.toString().includes("Listening on port")) {
            assert.strictEqual(data.toString(), str)
        }
    }
    );
    server.stderr.on("data", (data) => process.stderr.write("[SERVER-ERR] " + data.toString()));

    // 3️⃣ Wait for server to be ready
    await new Promise<void>((resolve) => {
        server.stdout.on("data", (data) => {
            if (data.toString().includes("Listening on port")) {
                resolve();
            }
        });
    });
    // 4️⃣ Connect a TCP client and send test message
    await new Promise<void>((resolve) => {
        const client = net.createConnection({ port: 42069 }, () => {
            const msg = "Do you have what it takes to be an engineer at TheStartup™?\r\n";
            client.write(msg);
            client.end();
        });

        client.on("end", () => resolve());
    });

    // 5️⃣ Give the server a moment to process and then kill it
    await new Promise((r) => setTimeout(r, 100));
    server.kill();

});
