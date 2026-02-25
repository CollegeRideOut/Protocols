import assert from "node:assert"
import test from "node:test"
import { newHeader } from "./l1"
import { stringToAsyncIterable } from "../../utils"

test('Chapter 5 - L1 - Request', async (t) => {
  t.test('Valid single Header', async () => {

    const header = newHeader()

    const result = header.parse(Buffer.from("Host: localhost:42069\r\n\r\n"))
    if (!result.ok) {
      assert(result.ok, result.error.message)
    }

    assert.strictEqual(header.value.get('Host'), 'localhost:42069')
    assert.strictEqual(result.value.n, 23)
  })

  t.test('Valid single Header with exta whitsspace', async () => {

    const header = newHeader()

    const result = header.parse(Buffer.from("Host:         localhost:42069\r\n\r\n"))
    if (!result.ok) {
      assert(result.ok, result.error.message)
    }

    assert.strictEqual(header.value.get('Host'), 'localhost:42069')
  })

  t.test('Valid single Header with exta whitsspace', async () => {

    const header = newHeader()
    let buffer = Buffer.from("Host:         localhost:42069\r\nAuth: Bearer 123\r\n\r\n")

    let result = header.parse(buffer);
    if (!result.ok) {
      assert(result.ok, result.error.message)
    }

    let bytesConsumed = result.value.n;
    let newBuffer = buffer.subarray(bytesConsumed);

    result = header.parse(newBuffer);
    if (!result.ok) {
      assert(result.ok, result.error.message)
    }


    assert.strictEqual(header.value.get('Host'), 'localhost:42069')
    assert.strictEqual(header.value.get('Auth'), 'Bearer 123')
  })

  t.test('Valid done', async () => {

    const header = newHeader()

    const result = header.parse(Buffer.from("\r\n"))
    if (!result.ok) {
      assert(result.ok, result.error.message)
    }

    assert.strictEqual(result.value.done, true)
  })

  t.test('Invalid Valid single Header', async () => {
    const header = newHeader()

    const result = header.parse(Buffer.from("       Host : localhost:42069       \r\n\r\n"))
    if (result.ok) {
      assert(!result.ok, 'expected an error')
    }

    const error = result.error;
  })




})




