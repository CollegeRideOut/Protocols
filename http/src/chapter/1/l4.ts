
import { open } from 'node:fs/promises';
import path from 'node:path';
import { __dirname, safeAsync, safe } from '../../utils'

async function run() {
    const filePath = path.join(__dirname, "../messages.txt");
    const safeFile = await safeAsync(() => open(filePath))
    if (!safeFile.ok) {
        safeAsync(() => file.close())
        console.log('Error opening file', safeFile.error)
        return;
    }
    const file = safeFile.value;
    const CHUNK_SIZE = 8;
    const buffer = Buffer.alloc(CHUNK_SIZE);
    let position = 0;

    let line = '';
    while (true) {
        const safeRead = await safeAsync(() => file.read(buffer, 0, buffer.length, position))
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
                process.stdout.write(`read: ${line}`)
                line = ''
            }
        }

        position += bytesRead
    }

    const safeClose = await safeAsync(() => file.close())
    if (!safeClose.ok) {
        console.log('Error closing file', safeClose.error)
    }

}

run();
