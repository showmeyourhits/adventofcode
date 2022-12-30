import path from "node:path";
import { solveInput } from "../util/input.js";

type Coords = [number, number];
type Grid = string[][];

let minX = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

const formations: Coords[][] = [];

solveInput({
  onInput(line) {
    const coords = line
      .split(" -> ")
      .map((str) => str.split(",").map(Number) as Coords);

    coords.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });

    formations.push(coords);
  },
  onEnd() {
    // const grid = createGrid({ formations, maxX, minX, maxY });
    const grid = createGridWithFloor({
      formations,
      maxX,
      minX,
      maxY,
      width: 100000,
    });

    // printGrid(grid);
    const grainCount = pourSand(grid);
    // printGrid(grid);

    console.log({ grainCount });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
});

function createGrid(params: {
  formations: Coords[][];
  minX: number;
  maxX: number;
  maxY: number;
}): Grid {
  const { formations, maxX, maxY, minX } = params;
  const grid: Grid = Array.from(new Array(maxY + 1), () => {
    return Array.from(new Array(maxX - minX + 1), () => ".");
  });

  formations.forEach((formation) => {
    for (let f = 0; f < formation.length - 1; f++) {
      const start = formation[f];
      const end = formation[f + 1];

      const axis = start[0] === end[0] ? 1 : 0;
      const diff = start[axis] - end[axis];
      const coef = diff > 0 ? -1 : 1;

      for (let i = 0; i <= Math.abs(diff); i++) {
        const x = start[0] - minX + (axis === 0 ? i * coef : 0);
        const y = start[1] + (axis === 1 ? i * coef : 0);

        grid[y][x] = "#";
      }
    }
  });

  grid[0][500 - minX] = "+";

  return grid;
}

function createGridWithFloor(params: {
  formations: Coords[][];
  minX: number;
  maxX: number;
  maxY: number;
  width: number;
}): Grid {
  const { formations, maxY, minX, width } = params;
  const grid: Grid = Array.from(new Array(maxY + 3), () => {
    return Array.from(new Array(width), () => ".");
  });

  const shift = width / 2 - Math.floor((maxX - minX) / 2);

  formations.forEach((formation) => {
    for (let f = 0; f < formation.length - 1; f++) {
      const start = formation[f];
      const end = formation[f + 1];

      const axis = start[0] === end[0] ? 1 : 0;
      const diff = start[axis] - end[axis];
      const coef = diff > 0 ? -1 : 1;

      for (let i = 0; i <= Math.abs(diff); i++) {
        const x = start[0] + shift - minX + (axis === 0 ? i * coef : 0);
        const y = start[1] + (axis === 1 ? i * coef : 0);

        grid[y][x] = "#";
      }
    }
  });

  grid[0][500 + shift - minX] = "+";
  grid[grid.length - 1] = grid[grid.length - 1].map(() => "#");

  return grid;
}

function printGrid(grid: Grid) {
  console.log("GRID:");
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      process.stdout.write(grid[i][j]);
    }
    process.stdout.write("\n");
  }
}

function pourSand(grid: Grid): number {
  const sandIndex = grid[0].findIndex((v) => v === "+");

  const grainPos = {
    x: sandIndex,
    y: 0,
  };
  let grainCount = 0;

  while (true) {
    if (willFallOutOfBounds()) return grainCount;

    let isMoved = false;

    if (grid[grainPos.y + 1][grainPos.x] === ".") {
      grid[grainPos.y][grainPos.x] = ".";
      grainPos.y += 1;
      isMoved = true;
    } else if (grid[grainPos.y + 1][grainPos.x - 1] === ".") {
      grid[grainPos.y][grainPos.x] = ".";
      isMoved = true;
      grainPos.y += 1;
      grainPos.x -= 1;
    } else if (grid[grainPos.y + 1][grainPos.x + 1] === ".") {
      grid[grainPos.y][grainPos.x] = ".";
      isMoved = true;
      grainPos.y += 1;
      grainPos.x += 1;
    }
    if (isMoved) {
      grid[grainPos.y][grainPos.x] = "o";
    } else {
      grainCount++;

      if (grainPos.x === sandIndex && grainPos.y === 0) {
        grid[grainPos.y][grainPos.x] = "o";
        return grainCount;
      }
      grainPos.x = sandIndex;
      grainPos.y = 0;
    }
  }

  return grainCount;

  function willFallOutOfBounds() {
    return (
      // out of bounds down
      grainPos.y + 1 >= grid.length ||
      // out of bounds left
      grainPos.x - 1 < 0 ||
      // out of bounds right
      grainPos.x + 1 >= grid[0].length
    );
  }
}
