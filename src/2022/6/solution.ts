import path from "node:path";
import { solveInput } from "../util/input.js";

function findSymbolIndex(markerLength: number, line: string): number {
  for (let i = markerLength - 1; i < line.length; i++) {
    const marker = line.slice(i - markerLength, i);

    if (new Set(marker).size === markerLength) {
      return i;
    }
  }

  return -1;
}

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
  onInput(line) {
    console.log({
      howManyCharactersTillStart: findSymbolIndex(4, line),
      howManyCharactersTillMessage: findSymbolIndex(14, line),
    });
  },
  onEnd() {},
});
