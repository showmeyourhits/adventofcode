import path from "node:path";
import { solveInput } from "../../util/input.js";

type Grid = boolean[][];
type Command = "U" | "D" | "R" | "L";
type Position = { x: number; y: number };

const size = 10000;

const initial = { x: size / 2, y: size / 2 };
const grid: Grid = createGrid(size, initial);

const rope = createRope(2, initial);

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
  onInput(line) {
    const [command, moves] = parseCommand(line);

    for (let _ = 0; _ < moves; _++) {
      for (let i = 0; i < rope.length - 1; i++) {
        const h = rope[i];
        const t = rope[i + 1];

        switch (command) {
          case "D": {
            h.x--;
            break;
          }
          case "U": {
            h.x++;
            break;
          }
          case "L": {
            h.y--;
            break;
          }
          case "R": {
            h.y++;
            break;
          }
        }

        if (shouldMoveTail(h, t)) {
          const k = (["x", "y"] as const).find(
            (k) => Math.abs(h[k] - t[k]) > 1
          ) as keyof Position;

          const diff = h[k] - t[k];

          t[k] = t[k] + (diff > 0 ? 1 : -1);

          const k2 = k === "x" ? "y" : "x";

          if (h[k2] !== t[k2]) {
            const diff2 = h[k2] - t[k2];

            t[k2] = t[k2] + (diff2 > 0 ? 1 : -1);
          }

          if (i === rope.length - 2) {
            grid[h.x][h.y] = true;
          }
        }
      }
    }
  },
  onEnd() {
    console.log({
      visited: countVisited(grid),
    });
    // printGrid(grid);
  },
});

function createGrid(size: number, initial: Position): Grid {
  const grid = Array.from(new Array(size), () => {
    return Array.from(new Array(size), () => false);
  });

  grid[initial.x][initial.y] = true;

  return grid;
}

function createRope(size: number, initial: Position): Position[] {
  return Array.from(new Array(size), () => ({ ...initial }));
}

function countVisited(grid: Grid): number {
  return grid.reduce((memo, line) => {
    return memo + line.reduce((memo, visited) => memo + (visited ? 1 : 0), 0);
  }, 0);
}

function parseCommand(command: string): [Command, number] {
  const [c, value] = command.split(" ") as [Command, string];

  return [c, Number(value)];
}

function shouldMoveTail(h: Position, t: Position) {
  const areOnSameX = h.x === t.x;
  const areOnSameY = h.y === t.y;
  if (areOnSameX && areOnSameY) {
    return false;
  }

  if (areOnSameX) {
    return Math.abs(h.y - t.y) > 1;
  }

  if (areOnSameY) {
    return Math.abs(h.x - t.x) > 1;
  }

  return Math.abs(h.x - t.x) > 1 || Math.abs(h.y - t.y) > 1;
}

function printGrid(grid: Grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (i === 0 && j === 0) {
        process.stdout.write("s");
      } else {
        process.stdout.write(grid[i][j] ? "#" : ".");
      }
    }
    process.stdout.write("\n");
  }
}
