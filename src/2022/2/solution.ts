import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const SCORES = {
  A: 1,
  B: 2,
  C: 3,
} as const;

const MOVE_MAP = {
  X: "A",
  Y: "B",
  Z: "C",
} as const;

const REAL_SCORE_MAP = {
  X: 0,
  Y: 3,
  Z: 6,
} as const;

function calculateTheRoundScore(round: string): number {
  const [opponentMove, yourOriginalMove] = round.split(" ") as [
    keyof typeof SCORES,
    keyof typeof MOVE_MAP
  ];
  const yourMove = MOVE_MAP[yourOriginalMove];
  let score = SCORES[yourMove];

  if (opponentMove === yourMove) {
    score += 3;
  } else if (
    (opponentMove === "A" && yourMove === "B") ||
    (opponentMove === "B" && yourMove === "C") ||
    (opponentMove === "C" && yourMove === "A")
  ) {
    score += 6;
  }

  return score;
}

function calculateTheRoundScoreReal(round: string): number {
  const [opponentMove, yourOriginalMove] = round.split(" ") as [
    keyof typeof SCORES,
    keyof typeof MOVE_MAP
  ];
  const score = REAL_SCORE_MAP[yourOriginalMove];

  switch (opponentMove) {
    case "A":
      switch (yourOriginalMove) {
        case "X":
          return score + 3;
        case "Y":
          return score + 1;
        case "Z":
          return score + 2;
      }
      break;
    case "B":
      switch (yourOriginalMove) {
        case "X":
          return score + 1;
        case "Y":
          return score + 2;
        case "Z":
          return score + 3;
      }
      break;
    case "C":
      switch (yourOriginalMove) {
        case "X":
          return score + 2;
        case "Y":
          return score + 3;
        case "Z":
          return score + 1;
      }
      break;
  }
}

function calculateTheScore(path: string) {
  const rl = readline.createInterface(fs.createReadStream(path));

  let score = 0;
  let realScore = 0;

  rl.addListener("line", (round) => {
    score += calculateTheRoundScore(round);
    realScore += calculateTheRoundScoreReal(round);
  });

  rl.addListener("close", () => {
    console.log({ score, realScore });
  });
}

calculateTheScore(
  path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "input_example.txt"
    // "input.txt"
  )
);
