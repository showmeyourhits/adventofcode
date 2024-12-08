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
    const { count } = countCrosswords({ word: ["M", "A", "S"], screen });

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

function countCrosswords(params: { word: string[]; screen: string[][] }): {
  count: number;
} {
  const { word, screen } = params;
  let count = 0;

  for (let i = 0; i < screen.length; i++) {
    for (let j = 0; j < screen[i].length; j++) {
      const result = hasCrosswordAtPosition({ word, screen, i, j });

      count += result ? 1 : 0;
    }
  }

  return {
    count,
  };
}

function hasCrosswordAtPosition(params: {
  word: string[];
  screen: string[][];
  i: number;
  j: number;
}): boolean {
  const { word, screen, i, j } = params;

  const wordLength = word.length;
  const wordHalfLength = Math.floor(wordLength / 2);

  // Middle letter doesn't match
  if (screen[i][j] !== word[wordHalfLength]) {
    return false;
  }

  // Get diagonals on this position
  const firstDiagonal = getWordInDirection({
    screen,
    i: i + wordHalfLength * directionDeltas.upLeft[0],
    j: j + wordHalfLength * directionDeltas.upLeft[1],
    direction: "downRight",
    wordLength,
  });

  const secondDiagonal = getWordInDirection({
    screen,
    i: i + wordHalfLength * directionDeltas.upRight[0],
    j: j + wordHalfLength * directionDeltas.upRight[1],
    direction: "downLeft",
    wordLength,
  });

  if (
    firstDiagonal &&
    secondDiagonal &&
    areEqualInAnyOfBothWays(firstDiagonal, word) &&
    areEqualInAnyOfBothWays(secondDiagonal, word)
  ) {
    return true;
  }

  return false;
}

function getWordInDirection(params: {
  screen: string[][];
  i: number;
  j: number;
  direction: Direction;
  wordLength: number;
}): string[] | null {
  const { screen, i, j, direction, wordLength } = params;
  const [deltaI, deltaJ] = directionDeltas[direction];

  const word: string[] = [];

  for (let k = 0; k < wordLength; k++) {
    const newI = i + k * deltaI;
    const newJ = j + k * deltaJ;

    if (screen[newI]?.[newJ] === undefined) {
      return null;
    }

    word.push(screen[newI][newJ]);
  }

  return word;
}

function areEqualInAnyOfBothWays(wordA: string[], wordB: string[]) {
  if (wordA.length !== wordB.length) {
    return false;
  }

  if (wordA.join("") === wordB.join("")) {
    return true;
  }

  if (wordA.reverse().join("") === wordB.join("")) {
    return true;
  }

  return false;
}
