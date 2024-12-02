import path from "node:path";
import { solveInput } from "../../util/input.js";

type PacketItem = number | number[] | PacketItem[];
type Packet = PacketItem[];

const validPairIndices: number[] = [];

const pair: Packet[] = [];
const packets: Packet[] = [];

let index = 1;

const dividers: Packet[] = [[[2]], [[6]]];

solveInput({
  onInput(line) {
    if (line === "") {
      if (validatePair(pair[0], pair[1]) === true) {
        // console.log(`${index}:`);
        // console.log(JSON.stringify(pair[0]));
        // console.log(JSON.stringify(pair[1]));
        // console.log(`end`);
        validPairIndices.push(index);
      }
      index++;
      pair.length = 0;
    } else {
      pair.push(JSON.parse(line) as Packet);
      packets.push(JSON.parse(line) as Packet);
    }
  },
  onEnd() {
    packets.push(...dividers);
    packets.sort((a, b) => (validatePair(a, b) ? -1 : 1));

    // console.log(packets);

    console.log({
      sum: validPairIndices.reduce((sum, i) => sum + i),
      decoderKey: dividers
        .map((divider) => packets.findIndex((p) => p === divider))
        .reduce((curr, i) => curr * (i + 1), 1),
    });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
});

function validatePair(packet1: Packet, packet2: Packet): boolean | undefined {
  const res = compareItems(packet1, packet2);

  return res;
}

function compareItems(
  left: PacketItem | undefined,
  right: PacketItem | undefined
): boolean | undefined {
  if (typeof left === "number" && typeof right === "number") {
    if (left === right) {
      return undefined;
    }

    return left < right;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      const checkResult = compareItems(left[i], right[i]);

      if (checkResult === undefined) continue;

      return checkResult;
    }

    return undefined;
  }

  if (right === undefined) {
    return left === undefined;
  }

  if (left === undefined) {
    return right !== undefined;
  }

  if (typeof left === "number" && Array.isArray(right)) {
    return compareItems([left], right);
  }

  if (typeof right === "number" && Array.isArray(left)) {
    return compareItems(left, [right]);
  }

  return undefined;
}
