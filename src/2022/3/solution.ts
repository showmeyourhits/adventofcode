import path from "node:path";
import { solveInput } from "../../util/input.js";

let score = 0;
let replacePriorities = 0;

function findMissplacedItem(rucksack: string): string {
  const size = rucksack.length / 2;
  const leftPart = rucksack.slice(0, size);
  const rightPart = rucksack.slice(size, rucksack.length);

  return leftPart.split("").find((item) => rightPart.includes(item)) as string;
}

function getPriority(item: string): number {
  const charCode = item.charCodeAt(0);

  if (charCode >= 97) {
    return charCode - 96;
  }

  return charCode - 65 + 27;
}

function findCommonItem(rucksacks: string[]): string {
  return rucksacks[0].split("").find((item) => {
    return rucksacks.slice(1).every((rucksack) => rucksack.includes(item));
  }) as string;
}

const gatherRucksackGroup = (() => {
  let group: string[] = [];

  return (groupSize: number, rucksack: string): string[] | null => {
    if (group.length === groupSize) {
      group = [];
    }

    group.push(rucksack);

    if (group.length === groupSize) {
      return group;
    }

    return null;
  };
})();

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "input_example.txt"
    // "input.txt"
  ),
  onInput(rucksack) {
    const item = findMissplacedItem(rucksack);

    const group = gatherRucksackGroup(3, rucksack);

    if (group) {
      const item = findCommonItem(group);

      replacePriorities += getPriority(item);
    }

    score += getPriority(item);
  },
  onEnd() {
    console.log({ score, replacePriorities });
  },
});
