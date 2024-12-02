import path from "node:path";
import { solveInput } from "../../util/input.js";
const isExample = false;

type Grid = boolean[][][];

let totalSurface = 0;
const grid = createGrid(25);

solveInput({
  onInput(line) {
    const freesides = 6;
    const [x, y, z] = line.split(",").map((n) => Number(n) + 1);

    addCube(grid, x, y, z);

    const connectedCubesCount = countConnectedCubes(grid, x, y, z);

    totalSurface += freesides - connectedCubesCount * 2;
  },
  onEnd() {
    console.log({ totalSurface, totalOuterSurface: calculateSurface(grid) });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    isExample ? "input_example.txt" : "input.txt"
  ),
});

function createGrid(size: number): Grid {
  return Array.from({ length: size }, () => {
    return Array.from({ length: size }, () => {
      return Array.from({ length: size }, () => false);
    });
  });
}

function countConnectedCubes(grid: Grid, x: number, y: number, z: number) {
  let count = 0;

  // top
  count += grid[z + 1]?.[y]?.[x] ? 1 : 0;
  // bottom
  count += grid[z - 1]?.[y]?.[x] ? 1 : 0;
  // left
  count += grid[z]?.[y]?.[x - 1] ? 1 : 0;
  // right
  count += grid[z]?.[y]?.[x + 1] ? 1 : 0;
  // front
  count += grid[z]?.[y - 1]?.[x] ? 1 : 0;
  // back
  count += grid[z]?.[y + 1]?.[x] ? 1 : 0;

  return count;
}

function addCube(grid: Grid, x: number, y: number, z: number) {
  grid[z][y][x] = true;
}

function calculateSurface(grid: Grid) {
  const gridSize = grid.length;
  const queue = [{ x: 0, y: 0, z: 0 }];
  const visited = new Set<string>();
  let surface = 0;

  while (queue.length) {
    const { x, y, z } = queue.pop()!;
    const key = `${x},${y},${z}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    // top
    if (z + 1 < gridSize) {
      if (!grid[z + 1][y][x]) {
        queue.push({ x, y, z: z + 1 });
      } else {
        surface++;
      }
    }

    // bottom
    if (z - 1 >= 0) {
      if (!grid[z - 1][y][x]) {
        queue.push({ x, y, z: z - 1 });
      } else {
        surface++;
      }
    }

    // left
    if (x - 1 >= 0) {
      if (!grid[z][y][x - 1]) {
        queue.push({ x: x - 1, y, z });
      } else {
        surface++;
      }
    }

    // right
    if (x + 1 < gridSize) {
      if (!grid[z][y][x + 1]) {
        queue.push({ x: x + 1, y, z });
      } else {
        surface++;
      }
    }

    // front
    if (y - 1 >= 0) {
      if (!grid[z][y - 1][x]) {
        queue.push({ x, y: y - 1, z });
      } else {
        surface++;
      }
    }

    // back
    if (y + 1 < gridSize) {
      if (!grid[z][y + 1][x]) {
        queue.push({ x, y: y + 1, z });
      } else {
        surface++;
      }
    }
  }

  return surface;
}
