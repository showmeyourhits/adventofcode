import path from "node:path";
import { solveInput } from "../util/input.js";

type Monkey = {
  items: number[];
  op: (old: number) => number;
  test: (level: number) => boolean;
  divisibleBy: number;
  next: {
    true: number;
    false: number;
  };
};

const monkeys: Monkey[] = [];
const monkeyLines: string[] = [];
const inspectedCount: number[] = [];

const rounds = 10000;

solveInput({
  onInput(line) {
    if (line === "") {
      inspectedCount.push(0);
      monkeys.push(createMonkey(monkeyLines));
      monkeyLines.length = 0;
    } else {
      monkeyLines.push(line);
    }
  },
  onEnd() {
    const modulo = monkeys.reduce((res, monkey) => res * monkey.divisibleBy, 1);

    for (let i = 0; i < rounds; i++) {
      monkeys.forEach((monkey, index) => {
        inspectedCount[index] += monkey.items.length;

        while (monkey.items.length) {
          const item = monkey.items.shift() as number;
          const newLevel = monkey.op(item) % modulo;

          monkeys[monkey.next[`${monkey.test(newLevel)}`]].items.push(newLevel);
        }
      });
    }

    const monkeyBusinessLevel = inspectedCount
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((m, l) => m * l, 1);

    console.log({ inspectedCount, monkeyBusinessLevel });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
});

function createMonkey(lines: string[]): Monkey {
  const [strId, strItems, strOp, strTest, strTrue, strFalse] = lines;

  const items = strItems.slice(18).split(", ").map(Number);
  const opBody = strOp.slice(19);
  const op = Function("old", `return ${opBody}`) as (old: number) => number;
  const divisibleBy = Number(strTest.slice(21));
  const trueMonkey = Number(strTrue.slice(29));
  const falseMonkey = Number(strFalse.slice(30));

  return {
    items,
    op,
    divisibleBy,
    test: (level) => !(level % divisibleBy),
    next: {
      true: trueMonkey,
      false: falseMonkey,
    },
  };
}
