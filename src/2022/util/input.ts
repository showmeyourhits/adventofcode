import fs from "node:fs";
import readline from "node:readline";

export function solveInput(options: {
  pathToInputFile: string;
  onInput(line: string): unknown;
  onEnd(): unknown;
}) {
  const rl = readline.createInterface(
    fs.createReadStream(options.pathToInputFile)
  );

  rl.on("line", options.onInput);
  rl.on("close", options.onEnd);
}
