import { isAllUpperCase, Result } from "../../utils";

const RegisterdNurse = '\r\n'
const States = { initialized: 'initilized', done: 'done' } as const;

type EnumValueState = (typeof States)[keyof typeof States]


type request = {
  requestLine: requestLine;
  state: EnumValueState
  parse: ((data: Buffer<ArrayBuffer>) => Result<number, Error>)
}

type requestLine = {
  httpVersion: string;
  requestTarget: string;
  method: string;
}

type headers = {
  value: Map<string, string>
  parse: ((data: Buffer<ArrayBuffer>) => Result<{ n: number, done: boolean }, Error>)
}


export function newHeader(): headers {
  return {
    value: new Map(),
    parse: function (data: Buffer<ArrayBuffer>) {

      if (!data.includes(RegisterdNurse)) {
        return { ok: true, value: { n: 0, done: false } };
      }
      const registerNurseIndex = data.indexOf(RegisterdNurse)
      if (registerNurseIndex === 0) {
        return { ok: true, value: { n: 2, done: true } }
      }

      const bytesConsumed = data.subarray(0, registerNurseIndex)
      const ninput = bytesConsumed.toString('ascii');
      let colonIndex = ninput.indexOf(":");
      if (colonIndex < 0) {

      }

      let fieldName = ninput.substring(0, colonIndex);

      if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(fieldName)) {
        return { ok: false, error: new Error("Invalid header field-name") };
      }
      let fieldVaue = ninput.substring(colonIndex + 1).trim();

      this.value.set(fieldName, fieldVaue)
      return { ok: true, value: { n: bytesConsumed.length + RegisterdNurse.length, done: false } }
    }
  }
}


function newRequest(): request {
  return {
    requestLine: { httpVersion: '', requestTarget: '', method: '' },
    state: 'initilized',
    parse: function (data: Buffer<ArrayBuffer>) {


      if (this.state === 'done') {
        return { ok: false, error: new Error('tyring to read data in a done state') }
      }
      if (this.state !== 'initilized') {
        return { ok: false, error: new Error('unknown state') }
      }

      let result = parseRequestLine(data);
      if (!result.ok) { return result; }

      let [requestLine, bytesConsumed] = result.value

      if (bytesConsumed === 0) { return { ok: true, value: 0 }; }

      this.requestLine = requestLine;
      this.state = 'done';
      return { ok: true, value: bytesConsumed };
    }
  }
}


function parseRequestLine(data: Buffer<ArrayBuffer>): Result<[requestLine, number], Error> {

  if (!data.includes('\r\n')) {
    return { ok: true, value: [{ httpVersion: '', requestTarget: '', method: '' }, 0] }
  }
  const bytesConsumed = data.subarray(0, data.indexOf(RegisterdNurse))
  const ninput = bytesConsumed.toString('ascii');

  let requestLineElements = ninput.split(' ')
  if (requestLineElements.length !== 3) {

    console.log('theinput here her hre', ninput);
    return {
      ok: false,
      error: new Error('invalid number of paths')
    }
  }

  const [method, requestTarget, http] = requestLineElements;
  const [_, httpVersion] = http.split('HTTP/')

  if (!['GET', 'POST'].includes(method) || !isAllUpperCase(method)) {
    return {
      ok: false,
      error: new Error('invalid method or out of order')
    }
  }


  if (httpVersion === undefined) {
    return {
      ok: false,
      error: new Error('invalid version')
    }
  }
  if (httpVersion !== '1.1') {
    return {
      ok: false,
      error: new Error('invalid version')
    }
  }

  return {
    ok: true,
    value: [
      {
        httpVersion,
        requestTarget,
        method
      },
      bytesConsumed.length + Buffer.from(RegisterdNurse).length
    ]
  }


}

export async function requestFromReader(
  reader: AsyncIterable<Buffer>
): Promise<Result<request, Error>> {

  const request = newRequest();
  let buffer = Buffer.alloc(8);
  let bytesInBuffer = 0;
  const iterator = reader[Symbol.asyncIterator]()

  let bytesRead = [];
  while (true) {
    let result = request.parse(buffer.subarray(0, bytesInBuffer))
    if (!result.ok) { return result; }
    const bytesConsumed = result.value;

    buffer.copy(buffer, 0, bytesConsumed, bytesInBuffer)
    bytesInBuffer -= bytesConsumed;

    if (request.state === 'done') { return { ok: true, value: request } }

    // if it wasnt done we need more data
    const { value: chunk, done } = await iterator.next();
    if (done) { return { ok: false, error: new Error('incomplete http request') } }

    while ((bytesInBuffer + chunk.length) > buffer.length) {
      const newBuffer = Buffer.alloc(buffer.length * 2);
      buffer.copy(newBuffer, 0, 0, bytesInBuffer)
      buffer = newBuffer;
    }

    chunk.copy(buffer, bytesInBuffer)
    bytesInBuffer += chunk.length;

  }
}
