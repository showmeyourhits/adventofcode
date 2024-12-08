import path from "node:path";

import { solveInput } from "../../util/input.js";

let totalResult = 0;

solveInput({
  onInput(line) {
    totalResult += calculateMultiplies(line);
  },
  onEnd() {
    console.log("Total: ", totalResult);
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    process.env.USE_EXAMPLE === "true" ? "input_example.txt" : "input.txt"
  ),
});

// example: xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))

function calculateMultiplies(line: string): number {
  const regexp = /mul\((\d+),(\d+)\)/g;

  let result = 0;

  let match: RegExpExecArray | null;

  while ((match = regexp.exec(line)) !== null) {
    const [matchValue, a, b] = match;
    console.log({ matchValue });

    result += Number(a) * Number(b);
  }

  return result;
}
