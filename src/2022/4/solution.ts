import path from "node:path";
import { solveInput } from "../util/input.js";

let pairsCount = 0;
let overlapPairsCount = 0;

type Pair = {
  first: [number, number];
  second: [number, number];
};

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
  onInput(pair) {
    pairsCount += doesPairsInludeItself(parsePair(pair)) ? 1 : 0;
    overlapPairsCount += doesPairsOverlap(parsePair(pair)) ? 1 : 0;
  },
  onEnd() {
    console.log({ pairsCount, overlapPairsCount });
  },
});

function parsePair(pair: string): Pair {
  const [first, second] = pair.split(",");
  const parseInterval = (int: string) =>
    int.split("-").map(Number) as [number, number];

  return {
    first: parseInterval(first),
    second: parseInterval(second),
  };
}

function doesPairsInludeItself(pair: Pair): boolean {
  return (
    (pair.first[0] <= pair.second[0] && pair.first[1] >= pair.second[1]) ||
    (pair.first[0] >= pair.second[0] && pair.first[1] <= pair.second[1])
  );
}

function doesPairsOverlap(pair: Pair): boolean {
  return (
    (pair.first[0] <= pair.second[0] && pair.first[1] >= pair.second[0]) ||
    (pair.second[0] <= pair.first[0] && pair.second[1] >= pair.first[0])
  );
}
