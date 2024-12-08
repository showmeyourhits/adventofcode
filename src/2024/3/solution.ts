import path from "node:path";

import { solveInput } from "../../util/input.js";

let totalResult = 0;
let isEnabled = true;

solveInput({
  onInput(line) {
    const result = calculateMultiplies({
      line,
      isEnabled,
    });

    totalResult += result.result;
    isEnabled = result.isEnabled;
  },
  onEnd() {
    console.log("Total: ", totalResult);
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    process.env.USE_EXAMPLE === "true" ? "input_example.txt" : "input.txt"
  ),
});

// xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))

function calculateMultiplies(params: { line: string; isEnabled: boolean }): {
  result: number;
  isEnabled: boolean;
} {
  let isEnabled = params.isEnabled;
  const line = params.line;

  const regexp = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

  let result = 0;

  let match: RegExpExecArray | null;

  while ((match = regexp.exec(line)) !== null) {
    const [matchValue, a, b] = match;

    if (matchValue === "do()") {
      isEnabled = true;
      continue;
    } else if (matchValue === "don't()") {
      isEnabled = false;
      continue;
    } else if (isEnabled) {
      result += Number(a) * Number(b);
    } else {
      // console.log("Skipping", matchValue);
    }
  }

  return {
    result,
    isEnabled,
  };
}
