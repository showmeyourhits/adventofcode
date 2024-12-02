import path from "node:path";

import { solveInput } from "../../util/input.js";

const IS_DEBUG = false;

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
    const result = lists.first.reduce((acc, first) => {
      const entriesCount = countEntries(lists.second, first);

      return acc + entriesCount * first;
    }, 0);

    console.log(result);
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    IS_DEBUG ? "input_example.txt" : "input.txt"
  ),
});

function countEntries(array: number[], value: number) {
  return array.reduce((acc, item) => (item === value ? acc + 1 : acc), 0);
}
