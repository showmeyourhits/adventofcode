import path from "node:path";

import { solveInput } from "../../util/input.js";

const screen: string[][] = [];

solveInput({
  onInput(line) {
    const screenLine = line.trim().split("");

    if (screen.length !== 0 && screen[0].length !== screenLine.length) {
      throw new Error("Screen lines have different lengths");
    }

    screen.push(screenLine);
  },
  onEnd() {
    const { count } = countWords({ word: ["X", "M", "A", "S"], screen });
    console.log("Total: ", count);
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    process.env.USE_EXAMPLE === "true" ? "input_example.txt" : "input.txt"
  ),
});

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "upLeft"
  | "upRight"
  | "downLeft"
  | "downRight";

function countWords(params: { word: string[]; screen: string[][] }): {
  count: number;
} {
  const { word, screen } = params;
  let count = 0;

  for (let i = 0; i < screen.length; i++) {
    for (let j = 0; j < screen[i].length; j++) {
      if (screen[i][j] === word[0]) {
        const result = countWordsAtPosition({ word, screen, i, j });

        count += result;
      }
    }
  }

  return {
    count,
  };
}

const directions: Direction[] = [
  "up",
  "down",
  "left",
  "right",
  "upLeft",
  "upRight",
  "downLeft",
  "downRight",
];

const directionDeltas: Record<Direction, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
  upLeft: [-1, -1],
  upRight: [-1, 1],
  downLeft: [1, -1],
  downRight: [1, 1],
};

function countWordsAtPosition(params: {
  word: string[];
  screen: string[][];
  i: number;
  j: number;
}): number {
  const { word, screen, i, j } = params;

  return directions.reduce((count, direction) => {
    if (checkWordInDirection({ screen, direction, word, i, j })) {
      return count + 1;
    }
    return count;
  }, 0);
}

function checkWordInDirection(params: {
  screen: string[][];
  direction: Direction;
  word: string[];
  i: number;
  j: number;
}): boolean {
  const { screen, i, j, word, direction } = params;
  const [deltaI, deltaJ] = directionDeltas[direction];

  for (let k = 0; k < params.word.length; k++) {
    const newI = i + deltaI * k;
    const newJ = j + deltaJ * k;

    if (
      newI < 0 ||
      newI >= screen.length ||
      newJ < 0 ||
      newJ >= screen[newI].length ||
      screen[newI][newJ] !== word[k]
    ) {
      return false;
    }
  }

  return true;
}
