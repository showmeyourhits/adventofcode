import path from "node:path";

import { solveInput } from "../../util/input.js";

const IS_DEBUG = false;
// const IS_DEBUG = true;

let safeCount = 0;

solveInput({
  onInput(line) {
    const report = line.split(/\s+/).map(Number);

    if (isReportSafe(report)) {
      safeCount++;
    }
  },
  onEnd() {
    console.log({ safeCount });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    IS_DEBUG ? "input_example.txt" : "input.txt"
  ),
});

/**
 * Report counts as safe if:
 * - it is increasing or decreasing only
 * - the difference between each number is at most MAX_DIFF (inclusive) and at least MIN_DIFF
 */
function isReportSafe(report: number[]): boolean {
  const MIN_DIFF = 1;
  const MAX_DIFF = 3;

  let sign: number = Number.NaN;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i] - report[i + 1];
    const newSign = Math.sign(diff);

    const isDiffValid =
      Math.abs(diff) >= MIN_DIFF && Math.abs(diff) <= MAX_DIFF;

    if ((sign === newSign || Number.isNaN(sign)) && isDiffValid) {
      sign = newSign;
      continue;
    }

    return false;
  }

  return true;
}
