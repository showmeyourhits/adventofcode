import path from "node:path";
import { solveInput } from "../../util/input.js";

type Grid = { visible: boolean; height: number }[][];
const grid: Grid = [];

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
  onInput(line) {
    grid.push(
      line.split("").map((h) => ({ visible: false, height: Number(h) }))
    );
  },
  onEnd() {
    console.log({
      visibleCount: lookAtGrid(grid),
      maxScenicScore: findMaxScenic(grid),
    });

    // print(grid);
  },
});

function lookAtGrid(grid: Grid): number {
  let visibleCount = 0;

  // from left
  visibleCount += countAndMarkVisible({
    grid,
    xStart: 0,
    xInc: (x) => x + 1,
    xCondition: (x) => x < grid.length,
    yStart: 0,
    yInc: (y) => y + 1,
    yCondition: (y) => y < grid[0].length,
    getter: (x, y, grid) => grid[x][y],
  });

  // from right
  visibleCount += countAndMarkVisible({
    grid,
    xStart: grid.length - 1,
    xInc: (x) => x - 1,
    xCondition: (x) => x >= 0,
    yStart: grid[0].length - 1,
    yInc: (y) => y - 1,
    yCondition: (y) => y >= 0,
    getter: (x, y, grid) => grid[x][y],
  });

  // from top
  visibleCount += countAndMarkVisible({
    grid,
    xStart: 0,
    xInc: (x) => x + 1,
    xCondition: (x) => x < grid.length,
    yStart: 0,
    yInc: (y) => y + 1,
    yCondition: (y) => y < grid[0].length,
    getter: (x, y, grid) => grid[y][x],
  });

  // from bottom
  visibleCount += countAndMarkVisible({
    grid,
    xStart: grid.length - 1,
    xInc: (x) => x - 1,
    xCondition: (x) => x >= 0,
    yStart: grid[0].length - 1,
    yInc: (y) => y - 1,
    yCondition: (y) => y >= 0,
    getter: (x, y, grid) => grid[y][x],
  });

  return visibleCount;
}

function countAndMarkVisible(params: {
  grid: Grid;
  xStart: number;
  xCondition: (x: number) => boolean;
  xInc: (x: number) => number;
  yStart: number;
  yCondition: (y: number) => boolean;
  yInc: (y: number) => number;
  getter: (x: number, y: number, grid: Grid) => Grid[number][number];
}) {
  const { xStart, xCondition, xInc, yStart, yCondition, yInc, getter } = params;
  let visibleCount = 0;

  for (let x = xStart; xCondition(x); x = xInc(x)) {
    let maxHeight = -1;

    for (let y = yStart; yCondition(y); y = yInc(y)) {
      const item = getter(x, y, grid);
      if (item.height > maxHeight) {
        if (!item.visible) {
          item.visible = true;
          visibleCount++;
        }
        maxHeight = item.height;
      }
    }
  }

  return visibleCount;
}

function scenicScore(x: number, y: number, grid: Grid): number {
  const tree = grid[x][y];

  const maxHeight = tree.height;

  let toRight = 0;
  for (let i = y + 1; i < grid[0].length; i++) {
    toRight += 1;

    if (grid[x][i].height >= maxHeight) {
      break;
    }
  }

  let toLeft = 0;
  for (let i = y - 1; i >= 0; i--) {
    toLeft += 1;

    if (grid[x][i].height >= maxHeight) {
      break;
    }
  }

  let toTop = 0;
  for (let i = x - 1; i >= 0; i--) {
    toTop += 1;

    if (grid[i][y].height >= maxHeight) {
      break;
    }
  }

  let toDown = 0;
  for (let i = x + 1; i < grid.length; i++) {
    toDown += 1;

    if (grid[i][y].height >= maxHeight) {
      break;
    }
  }

  return toDown * toLeft * toTop * toRight;
}

function findMaxScenic(grid: Grid) {
  let max = -Infinity;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const score = scenicScore(i, j, grid);

      if (score > max) {
        max = score;
      }
    }
  }

  return max;
}

function print(grid: Grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j].visible) {
        process.stdout.write(".");
      } else {
        process.stdout.write(grid[i][j].height.toString());
      }
    }
    process.stdout.write("\n");
  }
}
