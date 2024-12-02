import path from "node:path";
import { solveInput } from "../../util/input.js";

const folders: Record<string, number> = {};
const foldersStack: string[] = [];

const TOTAL_SIZE = 70000000;
const UPDATE_SIZE = 30000000;

const getFolderName = (() => {
  const cache: Record<string, number> = {};

  return (folder: string) => {
    if (typeof cache[folder] === "number") {
      cache[folder]++;
    } else {
      cache[folder] = 0;
    }

    return `${folder}${cache[folder] ? `__${cache[folder]}` : ""}`;
  };
})();

solveInput({
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    // "input_example.txt"
    "input.txt"
  ),
  onInput(line) {
    if (line[0] === "$") {
      const [, command, folder] = line.match(
        /\$ (cd|ls)\s?([/.\w]*)?/
      ) as RegExpMatchArray;

      if (command === "cd") {
        if (folder === "..") {
          // folder out
          const lookedAtFolder = foldersStack.pop() as string;
          folders[foldersStack[foldersStack.length - 1]] +=
            folders[lookedAtFolder];
        } else {
          const folderName = getFolderName(folder);
          foldersStack.push(folderName);
          folders[folderName] = folders[folderName] ?? 0;
        }
      }
      if (command === "ls") {
        // do nothing
      }

      return;
    }
    if (line.startsWith("dir")) {
      // probably do nothing too
    } else {
      const currentFolder = foldersStack[foldersStack.length - 1];
      const fileSize = parseFloat(line);
      folders[currentFolder] += fileSize;
    }
  },
  onEnd() {
    // clean folderStack
    while (foldersStack.length !== 1) {
      const lookedAtFolder = foldersStack.pop() as string;
      folders[foldersStack[foldersStack.length - 1]] += folders[lookedAtFolder];
    }

    const less100kTotalSize = Object.entries(folders)
      .filter(([, size]) => size <= 100000)
      .reduce((memo, [, size]) => memo + size, 0);

    const rootsize = folders["/"];
    const freeSpace = TOTAL_SIZE - rootsize;

    const [deleteFolderName, deleteFolderSize] = Object.entries(folders)
      .sort(([, a], [, b]) => a - b)
      .find(([, size]) => freeSpace + size >= UPDATE_SIZE) as [string, number];

    console.log({
      less100kTotalSize,
      rootsize,
      deleteFolderName,
      deleteFolderSize,
      foldersStack,
    });
  },
});
