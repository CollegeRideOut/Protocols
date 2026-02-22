import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const filePath = path.join(__dirname, "../../../messages.txt");

export const normalize = (str: string) =>
  str.replace(/\r\n/g, '\n');


export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function safe<T>(fn: () => T): Result<T, unknown> {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    return { ok: false, error: err };
  }
}
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<Result<T, unknown>> {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (err) {
    return { ok: false, error: err };
  }
}


export function stringToAsyncIterable(input: string, perByte?: number): AsyncIterable<Buffer> {
  return (async function* () {
    if (!perByte) {
      yield Buffer.from(input);
    } else {
      for (let i = 0; i < input.length; i += perByte) {
        yield Buffer.from(input.slice(i, (i + perByte)))
      }

    }
  })();
}

export function isAllUpperCase(str: string) {
  return str === str.toUpperCase();
}
