import { FileHandle, open } from 'node:fs/promises';
import path from 'node:path';
import { __dirname, safeAsync, safe } from '../../utils'

async function* getLinesGenerator(stream: FileHandle): AsyncGenerator<string> {
    try {
        const CHUNK_SIZE = 8;
        const buffer = Buffer.alloc(CHUNK_SIZE);

        let line = '';
        while (true) {
            const safeRead = await safeAsync(() => stream.read(buffer, 0, buffer.length))
            if (!safeRead.ok) {
                console.log('Error reading file', safeRead.error)
                break;
            }
            const { bytesRead } = safeRead.value
            if (bytesRead === 0) {
                //EOF
                break;
            }

            const chunkString = buffer.subarray(0, bytesRead).toString();
            for (let char of chunkString) {
                line += char
                if (char === '\n') {
                    yield line
                    line = ''
                }
            }
        }
        if (line.length > 0) {
            yield line
        }
    } finally {
        const safeClose = await safeAsync(() => stream.close())
        if (!safeClose.ok) {
            console.log('Error closing file', safeClose.error)
        }
    }
}

async function run() {
    const filePath = path.join(__dirname, "../messages.txt");
    const safeFile = await safeAsync(() => open(filePath))

    if (!safeFile.ok) {
        console.log('Error opening file', safeFile.error)
        return;
    }

    const file = safeFile.value;
    for await (const line of getLinesGenerator(file)) {
        process.stdout.write(`read: ${line}`)
    }
}

run();
