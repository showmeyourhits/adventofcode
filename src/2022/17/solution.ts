import path from "node:path";
import { solveInput } from "../../util/input.js";
const isExample = true;

type JetDirection = "<" | ">";

type CacheObject = {
  index: number;
  xDiff: number;
  yDiff: number;
  highestPoint: number;
};

class Figure {
  shape: string[];
  constructor(shape: string[]) {
    this.shape = shape;
  }
  get height() {
    return this.shape.length;
  }
  get width() {
    return this.shape[0].length;
  }
}

class Chamber {
  grid: string[][];
  highestPoint = 0;
  topDistance: number;
  wallDistance: number;
  jetPattern: string;
  figures: Figure[] = [];
  jetIndex = 0;
  cuttedHeight = 0;
  maxHeight: number;
  skip: { rocks: number; height: number } = { rocks: 0, height: 0 };

  cache = new Map<string, CacheObject[]>();

  constructor(params: {
    width: number;
    topDistance: number;
    wallDistance: number;
    jetPattern: string;
    figures: Figure[];
    maxHeight: number;
  }) {
    this.figures = params.figures;
    this.grid = Array.from(new Array(params.width), () =>
      Array.from(
        new Array(params.topDistance + this.figures[0].height),
        () => "."
      )
    );
    this.topDistance = params.topDistance;
    this.wallDistance = params.wallDistance;
    this.jetPattern = params.jetPattern;
    this.maxHeight = params.maxHeight;
  }

  fallingRocks(count: number) {
    this.jetIndex = 0;
    this.cuttedHeight = 0;

    for (let i = 0; i < count; i++) {
      const figure = this.getFigure(i);
      const lackingHeight =
        this.highestPoint +
        figure.height -
        this.grid[0].length -
        this.cuttedHeight;

      if (lackingHeight > 0) {
        const addedGrid = Array.from(new Array(lackingHeight), () => ".");
        this.grid.forEach((row) => row.push(...addedGrid));
      }

      this.fallRock(i);
      this.cutHeight(this.maxHeight);

      if (this.skip.rocks > 0) {
        console.log("skip", this.skip);
        return;
      }
    }
  }

  private fallRock(index: number) {
    const figure = this.getFigure(index);

    const initialPosY =
      this.highestPoint + this.topDistance - this.cuttedHeight;
    const initialPosX = this.wallDistance;

    let posY = initialPosY;
    let posX = initialPosX;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const direction = this.getJetDirection();

      switch (direction) {
        case "<": {
          if (!this.hasCollision(figure, posX - 1, posY)) {
            posX--;
          }
          break;
        }
        case ">": {
          if (!this.hasCollision(figure, posX + 1, posY)) {
            posX++;
          }
          break;
        }
      }

      this.jetIndex++;

      if (this.hasCollision(figure, posX, posY - 1)) {
        break;
      }

      posY--;
    }

    this.drawFigure(figure, posX, posY);
    const prevHighestPoint = this.highestPoint;

    this.highestPoint = Math.max(
      posY + figure.height + this.cuttedHeight,
      this.highestPoint
    );
    const rockIndex = this.getFallingRockIndex(index).toString();

    const currentState = {
      index,
      xDiff: posX - initialPosX,
      yDiff: posY - initialPosY,
      highestPoint: this.highestPoint,
    };

    if (!this.cache.has(rockIndex)) {
      this.cache.set(rockIndex, []);
    }

    const prevCacheObjects = this.cache.get(rockIndex) as CacheObject[];

    for (const prevState of prevCacheObjects) {
      if (
        prevState.xDiff === currentState.xDiff &&
        prevState.yDiff === currentState.yDiff
      ) {
        this.skip = {
          rocks: currentState.index - prevState.index,
          height: currentState.highestPoint - prevState.highestPoint,
        };
        break;
      }
    }

    if (prevCacheObjects.length >= 2) {
      prevCacheObjects.shift();
    }

    prevCacheObjects.push(currentState);
  }

  private getJetDirection(): JetDirection {
    return this.jetPattern[
      this.jetIndex % this.jetPattern.length
    ] as JetDirection;
  }

  private getFigure(index: number): Figure {
    return this.figures[index % this.figures.length];
  }

  private hasCollision(fig: Figure, posX: number, posY: number): boolean {
    if (posY < 0) return true;
    if (posX < 0 || posX + fig.width > this.grid.length) return true;

    for (let y = 0; y < fig.height; y++) {
      for (let x = 0; x < fig.width; x++) {
        if (fig.shape[y][x] === "#" && this.grid[posX + x][posY + y] === "#") {
          return true;
        }
      }
    }
    return false;
  }

  private cutHeight(maxHeight: number) {
    if (this.grid[0].length <= maxHeight) return;

    const diff = this.grid[0].length - maxHeight;
    this.cuttedHeight += diff;

    this.grid.forEach((row) => row.splice(0, diff));
  }

  private drawFigure(fig: Figure, posX: number, posY: number) {
    for (let y = 0; y < fig.height; y++) {
      for (let x = 0; x < fig.width; x++) {
        if (fig.shape[y][x] === "#") {
          this.grid[posX + x][posY + y] = "#";
        }
      }
    }
  }

  public drawChamber() {
    const reversedGrid = this.grid.map((row) => row.slice().reverse());
    for (let y = 0; y < reversedGrid[0].length; y++) {
      let line = "";
      for (let x = 0; x < reversedGrid.length; x++) {
        line += reversedGrid[x][y];
      }

      console.log(`|${line}|`);
    }
    console.log(`+${"-".repeat(this.grid.length)}+`);
  }

  private getFallingRockIndex(rockIndex: number): number {
    return this.jetIndex * rockIndex;
  }
}

let jetPattern: string;
const CHAMBER_WIDTH = 7;
const WALL_DISTANCE = 2;
const TOP_DISTANCE = 3;
const ROCK_COUNT = 1000000000000;

/* eslint-disable prettier/prettier */
const FIGURES = [
  ['####'],
  [
    '.#.',
    '###',
    '.#.'
  ],
  [
    '###',
    '..#',
    '..#'
  ],
  [
    '#',
    '#',
    '#',
    '#'
  ],
  [
    '##',
    '##'
  ]
]
/* eslint-enable prettier/prettier */

solveInput({
  onInput(line) {
    jetPattern = line;
  },
  onEnd() {
    const chamber = new Chamber({
      width: CHAMBER_WIDTH,
      topDistance: TOP_DISTANCE,
      wallDistance: WALL_DISTANCE,
      jetPattern,
      figures: FIGURES.map((f) => new Figure(f)),
      maxHeight: 100,
    });

    chamber.fallingRocks(ROCK_COUNT);
    // chamber.drawChamber();

    console.log({
      highestPoint: chamber.highestPoint,
      cycleLen: chamber.figures.length * chamber.jetPattern.length,
    });
  },
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    isExample ? "input_example.txt" : "input.txt"
  ),
});
