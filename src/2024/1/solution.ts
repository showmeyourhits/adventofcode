import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { solveInput } from "../../util/input.js";

const IS_DEBUG = false;
const 

const lists: {
  first: number[];
  second: number[];
} = {
  first: [],
  second: [],
};

solveInput({
  onInput(line) {
    const [first, second] = line.split(/\s+/).map(Number);

    lists.first.push(first);
    lists.second.push(second);
  },
  onEnd() {
    lists.first.sort((a, b) => a - b);
    lists.second.sort((a, b) => a - b);

    const result = lists.first.reduce((acc, first, index) => {
      const second = lists.second[index];
      const [a, b] = [first, second].sort((a, b) => a - b);

      return Math.abs(a - b) + acc;
    }, 0);

    console.log(result);
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    IS_DEBUG ? "input_example.txt" : "input.txt"
  ),
});
