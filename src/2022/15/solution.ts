import path from "node:path";
import { solveInput } from "../util/input.js";

type Position = { x: number; y: number };
type Bounds = [number, number];

const isExample = false;

// const xBounds: Bounds = [Infinity, -Infinity];
const lineBounds: Bounds[] = [];
const Y_POS = isExample ? 20 : 2000000;
const MAX_POS = isExample ? 20 : 4000000;
const beacons: Position[] = [];
const pairs: {
  beacon: Position;
  sensor: Position;
}[] = [];

solveInput({
  onInput(line) {
    const res = line.match(
      /Sensor at x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/
    ) as RegExpMatchArray;
    const { sensorX, sensorY, beaconX, beaconY } = res.groups as Record<
      string,
      string
    >;

    const beacon = {
      x: Number(beaconX),
      y: Number(beaconY),
    };
    const sensor = {
      x: Number(sensorX),
      y: Number(sensorY),
    };

    pairs.push({
      beacon,
      sensor,
    });

    beacons.push(beacon);

    // const widthBounds = getLineBounds(sensor, beacon, sensor.y) as Bounds;

    // xBounds[0] = Math.min(xBounds[0], widthBounds[0]);
    // xBounds[1] = Math.max(xBounds[1], widthBounds[1]);

    const lineCoverage = getLineBounds(sensor, beacon, Y_POS);
    lineCoverage ? lineBounds.push(lineCoverage) : null;
  },
  onEnd() {
    let beaconY = -1;
    let beaconX = -1;

    for (let i = 0; i < MAX_POS; i++) {
      const coverage: Bounds[] = [];
      pairs.forEach(({ sensor, beacon }) => {
        const lineCoverage = getLineBounds(sensor, beacon, i);
        lineCoverage ? coverage.push(lineCoverage) : null;
      });

      const { uncoveredX } = calcCoveredPoints(
        coverage,
        [0, MAX_POS],
        beacons,
        i
      );

      if (uncoveredX !== null) {
        beaconX = uncoveredX;
        beaconY = i;
        break;
      }
    }

    console.log({
      // xBounds,
      distress: {
        x: beaconX,
        y: beaconY,
      },
      tuningFrequency: beaconX * MAX_POS + beaconY,
      // width: xBounds[1] - xBounds[0],
      // uncovered: calcCoveredPoints(lineBounds, xBounds, beacons, Y_POS),
    });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    isExample ? "input_example.txt" : "input.txt"
  ),
});

function getManhattanDistance(sensor: Position, beacon: Position): number {
  return Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
}

function getLineBounds(
  sensor: Position,
  beacon: Position,
  yPos: number
): Bounds | null {
  const distance = getManhattanDistance(sensor, beacon);

  const distanceToLine = Math.abs(sensor.y - yPos);
  const xDistance = distance - distanceToLine;

  if (xDistance < 0) return null;

  return [sensor.x - xDistance, sensor.x + xDistance + 1];
}

function calcCoveredPoints(
  lineBounds: Bounds[],
  xBounds: Bounds,
  beacons: Position[],
  yPos: number
): {
  coveredCount: number;
  uncoveredX: number | null;
} {
  const mergedCoverage = uniteTheBounds(lineBounds).map((bound) => {
    if (bound[0] < xBounds[0]) {
      bound[0] = xBounds[0];
    }
    if (bound[1] > xBounds[1]) {
      bound[1] = xBounds[1];
    }
    return bound;
  });
  const mergedCoverageLength = mergedCoverage.reduce(
    (length, cov) => length + cov[1] - cov[0],
    0
  );

  const diff = Math.abs(mergedCoverageLength - (xBounds[1] - xBounds[0]));

  if (diff > 0) {
    if (diff > 1) {
      throw new Error(`Diff is ${diff} for yPos=${yPos}.`);
    }
    if (mergedCoverage.length > 1) {
      return {
        coveredCount: 0,
        uncoveredX: mergedCoverage[0][1],
      };
    } else if (mergedCoverage[0][0] !== xBounds[0]) {
      return {
        coveredCount: 0,
        uncoveredX: xBounds[0],
      };
    } else if (mergedCoverage[0][1] !== xBounds[1]) {
      return {
        coveredCount: 0,
        uncoveredX: xBounds[1],
      };
    }
  }

  const coveredCount = 0;
  const uncoveredX = null;

  return {
    coveredCount,
    uncoveredX,
  };
}

function uniteTheBounds(bounds: Bounds[]): Bounds[] {
  bounds.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

  const stack: Bounds[] = [];
  stack.push(bounds[0]);

  for (let i = 1; i < bounds.length; i++) {
    const top = stack[stack.length - 1];
    const curr = bounds[i];

    if (curr[0] > top[1]) {
      stack.push(curr);
      continue;
    }

    top[1] = Math.max(curr[1], top[1]);
  }

  return stack;
}

function printCoverageLine(
  lineBounds: Bounds[],
  xBounds: Bounds,
  beacons: Position[],
  yPos: number
) {
  const line: (boolean | null)[] = Array.from(
    new Array(xBounds[1] - xBounds[0]),
    () => false
  );
  lineBounds.forEach((coverage) => {
    const width = coverage[1] - coverage[0];
    for (let i = 0; i < width; i++) {
      line[coverage[0] - xBounds[0] + i] = true;
    }
  });
  beacons.forEach(({ x, y }) => {
    if (yPos === y) line[x - xBounds[0]] = null;
  });
  console.log(
    line
      .map((isCovered) =>
        isCovered === true ? "#" : isCovered === null ? "B" : "."
      )
      .join("")
  );
}
