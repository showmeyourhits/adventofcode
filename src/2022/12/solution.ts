import path from "node:path";
import { solveInput } from "../../util/input.js";

type Node = {
  elevation: string;
  distance: number;
  visited: boolean;
  pos: Position;
  move?: string;
};
type Position = { x: number; y: number };

const lines: string[] = [];

solveInput({
  onInput(line) {
    lines.push(line);
  },
  onEnd() {
    console.log({
      destinationDistance: findShortedPathFromStart(lines).distance,
      shortestHikingPath: findShortedHikingPath(lines).distance,
    });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
});

function createHeightMap(lines: string[]): {
  map: Node[][];
  sourcePos: Position;
  destinationPos: Position;
} {
  let destination = { x: 0, y: 0 };
  let source = { x: 0, y: 0 };

  const map = lines.map((line, y) =>
    line.split("").map((elevation, x) => {
      const MAP = {
        [elevation]: elevation,
        S: "a",
        E: "z",
      };

      if (elevation === "S") {
        source = { x, y };
      }

      if (elevation === "E") {
        destination = { x, y };
      }

      return {
        elevation: MAP[elevation],
        distance: Infinity,
        visited: false,
        pos: { y, x },
      };
    })
  );

  return {
    map,
    destinationPos: destination,
    sourcePos: source,
  };
}

function findShortedPathFromStart(lines: string[]): Node {
  const { destinationPos, sourcePos, map } = createHeightMap(lines);

  const source = map[sourcePos.y][sourcePos.x];
  const destination = map[destinationPos.y][destinationPos.x];

  source.distance = 0;

  const queue: Set<Node> = new Set([source]);

  while (queue.size) {
    const node = queue[Symbol.iterator]().next().value;
    queue.delete(node);

    const neighbors = getUnvisitedNodeNeighbors(node, map, false);

    node.visited = true;

    neighbors.forEach((neighbor) => {
      neighbor.distance = Math.min(neighbor.distance, node.distance + 1);

      queue.add(neighbor);
    });
  }

  return destination;
}

function findShortedHikingPath(lines: string[]): Node {
  const { destinationPos, map } = createHeightMap(lines);

  const source = map[destinationPos.y][destinationPos.x];

  source.distance = 0;

  const lowestPoints: Set<Node> = new Set();

  const queue: Set<Node> = new Set([source]);

  while (queue.size) {
    const node: Node = queue[Symbol.iterator]().next().value;
    queue.delete(node);

    const neighbors = getUnvisitedNodeNeighbors(node, map, true);

    node.visited = true;

    if (node.elevation === "a") {
      lowestPoints.add(node);
    }

    neighbors.forEach((neighbor) => {
      neighbor.distance = Math.min(neighbor.distance, node.distance + 1);

      queue.add(neighbor);
    });
  }

  return Array.from(lowestPoints).reduce((curr, node) =>
    node.distance < curr.distance ? node : curr
  );
}

function getNeighbors(node: Node, map: Node[][]): Node[] {
  const { pos } = node;
  const top = pos.y - 1 >= 0 ? map[pos.y - 1][pos.x] : null;
  const down = pos.y + 1 <= map.length - 1 ? map[pos.y + 1][pos.x] : null;
  const left = pos.x - 1 >= 0 ? map[pos.y][pos.x - 1] : null;
  const right =
    pos.x + 1 <= map[pos.y].length - 1 ? map[pos.y][pos.x + 1] : null;

  return [top, down, left, right].filter((n) => !!n) as Node[];
}

function getUnvisitedNodeNeighbors(
  node: Node,
  map: Node[][],
  isGoingDown: boolean
): Node[] {
  return getNeighbors(node, map).filter(
    (neighbor) =>
      neighbor && canMove(node, neighbor, isGoingDown) && !neighbor.visited
  ) as Node[];
}

function canMove(s: Node, d: Node, isGoingDown: boolean): boolean {
  if (isGoingDown) {
    return s.elevation.charCodeAt(0) - d.elevation.charCodeAt(0) <= 1;
  }

  return d.elevation.charCodeAt(0) - s.elevation.charCodeAt(0) <= 1;
}

function illistratePath(map: Node[][]) {
  map.forEach((line) => {
    line.forEach((node) => {
      process.stdout.write(node.visited ? "#" : ".");
    });
    process.stdout.write("\n");
  });
}
