import path from "node:path";
import { solveInput } from "../../util/input.js";

type Command = "noop" | "addx";

const iteration = 40;

let nextCycleToCheck = 20;
let registerX = 1;
let tick = 1;
const signalStrengts: Record<number, number> = {};
const crt = createCRT(iteration, 6);

const COMMAND_TICKS: Record<Command, number> = {
  addx: 2,
  noop: 1,
};

solveInput({
  onInput(line) {
    const [command, value] = parseCommand(line);

    if (command === "noop") {
      draw();
      tick++;

      if (tick === nextCycleToCheck) {
        signalStrengts[tick] = tick * registerX;
        nextCycleToCheck += iteration;
      }

      return;
    }

    if (command === "addx") {
      for (let _ = 0; _ < COMMAND_TICKS[command]; _++) {
        draw();
        tick++;

        if (_ === 1) {
          registerX += value;
        }

        if (tick === nextCycleToCheck) {
          signalStrengts[tick] = tick * registerX;
          nextCycleToCheck += iteration;
        }
      }
    }
  },
  onEnd() {
    console.log({
      sum: getSumOfSignalStrength(signalStrengts),
      signalStrengts,
      tick,
    });

    printCRT(crt);
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
});

function parseCommand(line: string): [Command, number] {
  const [, command, value] = line.match(/(\w+)\s?(-?\d*)?/) as RegExpMatchArray;

  return [command as Command, Number(value)];
}

function getSumOfSignalStrength(signalStrengts: Record<number, number>) {
  return Object.values(signalStrengts).reduce(
    (memo, stregth) => memo + stregth,
    0
  );
}

function createCRT(x: number, y: number): string[][] {
  const grid = Array.from(new Array(y), () => {
    return Array.from(new Array(x), () => ".");
  });

  return grid;
}
function printCRT(crt: string[][]) {
  for (let i = 0; i < crt.length; i++) {
    for (let j = 0; j < crt[i].length; j++) {
      process.stdout.write(crt[i][j]);
    }
    process.stdout.write("\n");
  }
}

function draw() {
  const tickX = (tick % iteration) - 1;
  const tickY = Math.floor(tick / iteration);

  console.log({
    tickX,
    tickY,
    tick,
    registerX,
    draw: [tickX, tickX - 1, tickX + 1].includes(registerX),
  });

  if ([tickX, tickX - 1, tickX + 1].includes(registerX)) {
    crt[tickY][tickX - 1] = "#";
  }
}
