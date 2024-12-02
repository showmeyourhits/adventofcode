import path from "node:path";
import { solveInput } from "../../util/input.js";
const isExample = false;

type Distances = Record<string, Record<string, number>>;

class Valve {
  id: string;
  rate = -1;
  connected: Valve[] = [];
  constructor(id: string) {
    this.id = id;
  }
  toString() {
    return `Valve: ${this.id}, r=${this.rate}, conn=${this.connected
      .map((v) => v.id)
      .join(",")}`;
  }
}

const valves = new Map<string, Valve>();

solveInput({
  onInput(line) {
    const match = line.match(
      /^Valve (?<valveId>[A-Z]{2}) has flow rate=(?<rate>\d+); tunnel[s]? lead[s]? to valve[s]? (?<connectedStr>[\w,\s]+)$/
    ) as RegExpMatchArray;
    const { valveId, rate, connectedStr } = match.groups as Record<
      string,
      string
    >;
    const connected = connectedStr.split(", ");

    const valve = valves.get(valveId) ?? new Valve(valveId);
    valve.rate = Number(rate);

    connected.forEach((id) => {
      if (valves.has(id)) {
        valve.connected.push(valves.get(id) as Valve);
      } else {
        const connectedValve = new Valve(id);
        valve.connected.push(connectedValve);
        valves.set(id, connectedValve);
      }
    });

    if (!valves.has(valveId)) {
      valves.set(valveId, valve);
    }
  },
  onEnd() {
    const startValve = valves.get("AA") as Valve;
    const distances = findDistances(valves);
    const unvisitedValves = Array.from(valves.keys()).filter(
      (v) => valves.get(v)?.rate
    );
    const maxFlowRate = getMaxFlow({
      currentValve: startValve,
      timeLeft: 30,
      distances,
      unvisitedValves,
    });

    const maxFlowRateWithElephant = getMaxFlowWithElephantHelp({
      startValve,
      timeLeft: 26,
      distances,
      valves: unvisitedValves,
    });

    console.log({ maxFlowRate, maxFlowRateWithElephant });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    isExample ? "input_example.txt" : "input.txt"
  ),
});

function findDistances(valves: Map<string, Valve>): Distances {
  const distances: Distances = {};

  for (const [valveId, valve] of valves.entries()) {
    distances[valveId] = {};
    valve.connected.forEach((conn) => {
      distances[valveId][conn.id] = 1;
    });
  }

  for (const start of valves.keys()) {
    for (const end of valves.keys()) {
      for (const middle of valves.keys()) {
        const startMiddlePathLen = distances[start][middle] ?? Infinity;
        const middleEndPathLen = distances[middle][end] ?? Infinity;
        const newDistance = Math.min(
          distances[start][end] ?? Infinity,
          startMiddlePathLen + middleEndPathLen
        );

        distances[start][end] = distances[end][start] = newDistance;
      }
    }
  }

  return distances;
}

function getMaxFlow({
  unvisitedValves,
  distances,
  currentValve,
  timeLeft,
}: {
  unvisitedValves: string[];
  distances: Distances;
  timeLeft: number;
  currentValve: Valve;
}): number {
  const valveFlowAddage = currentValve.rate * timeLeft;

  let maxFlowFromOther = 0;
  for (const end of unvisitedValves) {
    const distance = distances[currentValve.id][end];

    if (timeLeft - 1 >= distance) {
      // const newUnvisited = ;

      maxFlowFromOther = Math.max(
        maxFlowFromOther,
        getMaxFlow({
          currentValve: valves.get(end) as Valve,
          distances,
          timeLeft: timeLeft - (distance + 1),
          unvisitedValves: unvisitedValves.filter((v) => v !== end),
        })
      );
    }
  }
  return maxFlowFromOther + valveFlowAddage;
}

function getMaxFlowWithElephantHelp({
  startValve,
  distances,
  valves,
  timeLeft,
}: {
  startValve: Valve;
  distances: Distances;
  timeLeft: number;
  valves: string[];
}): number {
  let max = 0;

  for (const { elephantValves, humanValves } of generatePermutations(valves)) {
    const flow =
      getMaxFlow({
        unvisitedValves: humanValves,
        currentValve: startValve,
        distances,
        timeLeft,
      }) +
      getMaxFlow({
        unvisitedValves: elephantValves,
        currentValve: startValve,
        distances,
        timeLeft,
      });

    max = Math.max(flow, max);
  }

  return max;
}

function* generatePermutations(valves: string[]) {
  const maxMaskValue = 1 << valves.length;

  for (let mask = 0; mask < maxMaskValue; mask++) {
    const humanValves: string[] = [];
    const elephantValves: string[] = [];
    const splitScheme = mask.toString(2).padStart(valves.length, "0");

    splitScheme.split("").forEach((v, index) => {
      if (v === "0") {
        humanValves.push(valves[index]);
      } else {
        elephantValves.push(valves[index]);
      }
    });

    yield { humanValves, elephantValves };
  }
}
