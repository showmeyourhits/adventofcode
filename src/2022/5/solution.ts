import path from "node:path";
import { solveInput } from "../../util/input.js";

class Stack {
  private stacks: string[][];

  constructor() {
    this.stacks = [];
  }

  fill(initial: string[]) {
    const [numbers, ...stackLines] = [...initial].reverse();

    const numberOfStacks = +numbers[numbers.length - 2];

    for (let i = 0; i < numberOfStacks; i++) {
      this.stacks.push([]);
    }
    stackLines.forEach((line) => {
      for (let i = 0; i < numberOfStacks; i++) {
        const item = line[4 * i + 1];
        if (item !== " ") {
          this.stacks[i].push(item);
        }
      }
    });
  }

  move(command: string): void {
    const [count, from, to] = this.parseCommand(command);

    for (let i = 0; i < count; i++) {
      const crate = this.stacks[from - 1].pop();

      if (!crate) return;

      // console.log(this.stacks);

      this.stacks[to - 1].push(crate);
    }
  }

  move9001(command: string): void {
    const [count, from, to] = this.parseCommand(command);

    const fromStack = this.stacks[from - 1];
    const toStack = this.stacks[to - 1];

    const items = fromStack.splice(fromStack.length - count, count);

    toStack.push(...items);

    console.log(this.stacks);
  }

  getTopState(): string {
    return this.stacks.map((stack) => stack[stack.length - 1]).join("");
  }

  private parseCommand(command: string): [number, number, number] {
    const [, ...values] = command.match(
      /move (\d+) from (\d+) to (\d+)/
    ) as RegExpMatchArray;

    return values.map(Number) as [number, number, number];
  }
}

const stack = new Stack();

let parsedStack = false;
const stackLines: string[] = [];

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
  onInput(line) {
    if (line === "") {
      parsedStack = true;
      stack.fill(stackLines);

      return;
    }
    if (parsedStack) {
      stack.move9001(line);
    } else {
      stackLines.push(line);
    }
  },
  onEnd() {
    console.log({ top: stack.getTopState() });
  },
});
