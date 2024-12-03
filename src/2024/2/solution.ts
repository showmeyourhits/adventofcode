import path from "node:path";

import { solveInput } from "../../util/input.js";

const IS_DEBUG = false;
// const IS_DEBUG = true;

let safeCount = 0;

solveInput({
  onInput(line) {
    const report = line.split(/\s+/).map(Number);

    if (isReportSafe(report, 0)) {
      safeCount++;
    } else {
      console.log(report.join(" "));
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
function isReportSafe(report: number[], errorsDampened = 0): boolean {
  if (errorsDampened > 1) {
    return false;
  }

  const MIN_DIFF = 1;
  const MAX_DIFF = 3;

  let sign: number = Number.NaN;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i] - report[i + 1];
    const newSign = Math.sign(diff);

    const isDiffValid =
      Math.abs(diff) >= MIN_DIFF && Math.abs(diff) <= MAX_DIFF;

    const isSignValid = sign === newSign || Number.isNaN(sign);

    if (isSignValid && isDiffValid) {
      sign = newSign;
      continue;
    }

    if (!isSignValid && i === 1) {
      const reportWithPrevSign = [...report];
      reportWithPrevSign.splice(i - 1, 1);

      const removeFirstAttempt = isReportSafe(
        reportWithPrevSign,
        errorsDampened + 1
      );

      if (removeFirstAttempt) {
        return true;
      }
    }

    const reportA = [...report];
    reportA.splice(i, 1);
    const reportB = [...report];
    reportB.splice(i + 1, 1);

    return (
      isReportSafe(reportA, errorsDampened + 1) ||
      isReportSafe(reportB, errorsDampened + 1)
    );
  }

  return true;
}
