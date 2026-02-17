import { FileHandle, open } from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net'
import { __dirname, safeAsync, safe } from '../../utils'

async function* getLinesGenerator(socket: net.Socket): AsyncGenerator<string> {
    const CHUNK_SIZE = 8;
    socket.setEncoding('utf8');
    let buffer = '';

    for await (const chunk of socket) {
        buffer += chunk;
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, newlineIndex + 1);
            yield line;
            buffer = buffer.slice(newlineIndex + 1);
        }
    }

    if (buffer.length > 0) yield buffer;
}

async function accept(socket: net.Socket) {
    //console.log("Connection accepted");
    try {
        for await (const line of getLinesGenerator(socket)) {
            process.stdout.write(line);
        }
    } catch (err) {
        //console.log("Connection error:", err);
    } finally {
        //console.log("Connection closed");
    }

}

async function run() {
    const server = net.createServer(accept)
    server.listen(42069, () => {
        console.log("Listening on port 42069");
    });

    process.on("SIGINT", () => {
        //console.log("\nShutting down server...");
        server.close(() => {
            process.exit(0);
        });
    });
}

run();
