import assert from "node:assert"
import test from "node:test"
import { requestFromReader } from "./l2"
import { stringToAsyncIterable } from "../../utils"

test('Chapter 4 - L2 - Request', async (t) => {
  t.test('Good GET request line', async () => {
    const result = await requestFromReader(stringToAsyncIterable("GET / HTTP/1.1\r\nHost: localhost:42069\r\nUser-Agent: curl/7.81.0\r\nAccept: */*\r\n\r\n"))
    if (!result.ok) {
      assert(result.ok, result.error.message)
    }

    const r = result.value;
    assert.strictEqual(r.requestLine.method, 'GET')
    assert.strictEqual(r.requestLine.requestTarget, '/')
    assert.strictEqual(r.requestLine.httpVersion, '1.1')
  })

  t.test('Good GET request line with PATH', async () => {
    const result = await requestFromReader(stringToAsyncIterable("GET /coffee HTTP/1.1\r\nHost: localhost:42069\r\nUser-Agent: curl/7.81.0\r\nAccept: */*\r\n\r\n"))

    if (!result.ok) {
      assert(result.ok, result.error.message)
    }

    const r = result.value;
    assert.strictEqual(r.requestLine.method, 'GET')
    assert.strictEqual(r.requestLine.requestTarget, '/coffee')
    assert.strictEqual(r.requestLine.httpVersion, '1.1')

  })

  t.test('Good POST request line with path', async () => {
    const result = await requestFromReader(stringToAsyncIterable("POST /coffee HTTP/1.1\r\nHost: localhost:42069\r\nUser-Agent: curl/7.81.0\r\nAccept: */*\r\n\r\n"))
    if (!result.ok) {
      assert(result.ok, 'Error gettign request')
    }

    const r = result.value;
    assert.strictEqual(r.requestLine.method, 'POST')
    assert.strictEqual(r.requestLine.requestTarget, '/coffee')
    assert.strictEqual(r.requestLine.httpVersion, '1.1')
  })

  t.test('Invalid Number of paths', async () => {
    const result = await requestFromReader(stringToAsyncIterable("/coffee HTTP/1.1\r\nHost: localhost:42069\r\nUser-Agent: curl/7.81.0\r\nAccept: */*\r\n\r\n"))
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.message, 'invalid number of paths')
  })

  t.test('Invalid method (out of order)', async () => {
    const result = await requestFromReader(stringToAsyncIterable("/coffee POST HTTP/1.1\r\nHost: localhost:42069\r\nUser-Agent: curl/7.81.0\r\nAccept: */*\r\n\r\n"))
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.message, 'invalid method or out of order')
  })

  t.test('Invalid version in request line', async () => {
    const result = await requestFromReader(stringToAsyncIterable("GET /coffee HTTP/1.2\r\nHost: localhost:42069\r\nUser-Agent: curl/7.81.0\r\nAccept: */*\r\n\r\n"))
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.message, 'invalid version')
  })




})



