
import test from 'node:test';
import assert from 'node:assert';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';


import { readFileSync, createWriteStream } from 'node:fs';
import net from 'node:net'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.beforeEach

test('chapter 4 - L6', async () => {
  // const cliPath = path.resolve(__dirname, './main.ts');
  // let str = 'Do you have what it takes to be an engineer at TheStartup™?\r\n'
  // const outputFile = "/tmp/tcp.txt";
  // //assert.strictEqual(cliPath, 'idk')
  // const server = spawn("npx", ["tsx", cliPath, "."], { stdio: ["ignore", "pipe", "pipe"] });
  //
  // server.stdout.on("data", (data) => {
  //   if (!data.toString().includes("Listening on port")) {
  //     assert.strictEqual(data.toString(), str)
  //   }
  // });
  // server.stderr.on("data", (data) => process.stderr.write("[SERVER-ERR] " + data.toString()));
  //
  // await new Promise<void>((resolve) => {
  //
  //   server.stdout.on("data", async (data) => {
  //     if (data.toString().includes("Listening on port")) {
  //
  //     }
  //   });
  // });
  //
  //
  // // const client = spawn("curl", ["tsx"], { stdio: ["ignore", "pipe", "pipe"] });
  // // await new Promise((r) => setTimeout(r, 100));
  // // client.kill()
  //
  // await new Promise((r) => setTimeout(r, 10000));
  // server.kill();

});
