import test from 'node:test';
import assert from 'node:assert';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync, createWriteStream } from 'node:fs';
import net from 'node:net'
import { createSever } from './l1';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let server: net.Server | undefined = undefined
test.beforeEach(async () => {

  // let newServer = createSever()
  // server = newServer
  //
  // await new Promise<void>((resolve) => {
  //   newServer.listen(42069, () => {
  //     console.log("Listening on port 42069");
  //     resolve()
  //   })
  // });
  //
  // console.log("whats up");
})

test.afterEach(async () => {
  // await new Promise<void>((resolve) => {
  //   server!.close(() => resolve())
  // })
})

test('chapter 2 - L1', async () => {
  // const client = net.createConnection({ port: 42069 });
  // let expected = 'hello\nbye'
  // client.write(expected)
  // let actual = ''
  //
  // client.on('data', (chunk) => {
  //   actual += chunk.toString()
  // })
  // await new Promise((resolve) => {
  //   client.on('end', resolve)
  // })
  //
  // client.end()
  //
  //
  // server?.close();
  // assert.strictEqual(actual, expected)



});
