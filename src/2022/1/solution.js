// @ts-check
import fs from 'node:fs';
import { Transform } from 'node:stream';
import path from 'node:path';
import readline from 'node:readline';

/**
 * @param {string} filePath
 */
async function findElfWithMostCalories(filePath) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({input: fileStream})
  const top3 = createTop3Piedestal()

  let maxCalories = 0
  let maxCaloriesElf = 0

  let currentElf = 1
  let currentCallories = 0 

  function replaceMax() {
    if (maxCalories < currentCallories) {
      maxCaloriesElf = currentElf
      maxCalories = currentCallories
    }

    top3.place(currentCallories)
  }

  rl.addListener('line', (input) => {
    if (input === '') {
      replaceMax()

      currentElf++
      currentCallories = 0

      return
    }

    currentCallories += parseInt(input)
  })

  rl.addListener('close', () => {
    replaceMax()
    console.log({maxCaloriesElf, maxCalories, top3: top3.sum()})
  })
}

function createTop3Piedestal() {
  const p = [0, 0, 0]
  
  return {
    sum() {
      return p[0] + p[1] + p[2]
    },
    /**
     * @param {number} calories 
     */
    place(calories) {
      if (p[0] < calories) {
        p[0] = calories
      }

      p.sort((a, b) => a - b)
    }
  }
}

findElfWithMostCalories(path.resolve(path.dirname(new URL(import.meta.url).pathname), 'input.txt'))