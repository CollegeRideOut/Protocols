import { isAllUpperCase, Result } from "../../utils";

const States = { initialized: 'initilized', done: 'done' } as const;

type EnumValueState = (typeof States)[keyof typeof States]


type request = {
  requestLine: requestLine;
  state: EnumValueState
}

type requestLine = {
  httpVersion: string;
  requestTarget: string;
  method: string;
}

function parse(data: string) {

}

function parseRequestLine(input: string): Result<[requestLine, number], Error> {

  if (!input.includes('\r\n')) {
    return { ok: true, value: [{ httpVersion: '', requestTarget: '', method: '' }, 0] }
  }
  const ninput = input.substring(0, input.indexOf('\r\n'));
  let requestLineElements = ninput.split(' ')
  if (requestLineElements.length !== 3) {
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
      ninput.length]
  }


}

export async function requestFromReader(
  reader: AsyncIterable<Buffer>
): Promise<Result<request, Error>> {

  let buffer = "";
  const request: request = { requestLine: { httpVersion: '', requestTarget: '', method: '' }, state: 'initilized' };

  let i = 0;
  for await (const chunk of reader) {
    buffer += chunk.toString();


    let newlineIndex = - 1
    while ((newlineIndex = buffer.indexOf('\r\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex + 1);
      buffer = buffer.slice(newlineIndex + 1);

      let result = parseRequestLine(line);
      if (!result.ok) {
        return result
      }

      //request.requestLine = result.value;

      break;
    }


  }


  return { ok: true, value: request }

  //throw new Error("Incomplete HTTP request");
}
