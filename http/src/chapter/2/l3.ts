import dgram from 'node:dgram'
import readline from 'node:readline'
import { __dirname, safeAsync, safe } from '../../utils'

async function* loopQuestions(query: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    for (; ;) {
      yield new Promise<string>((resolve) => rl.question(query, (answer) => resolve(answer)))
    }
  } finally {
    rl.close();
  }
}

async function run() {
  const socket = dgram.createSocket('udp4');

  for await (const answer of loopQuestions("> ")) {
    socket.send(`${answer}\n`, 42069, 'localhost', (error) => {
      if (error) {
        console.error(error)
      }
    })
    //if (answer == "done") break;
  }
}

run();
