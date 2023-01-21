import path from "node:path";
import { solveInput } from "../util/input.js";
const isExample = true;

type Resource = "ore" | "clay" | "obsidian" | "geode";
const resourceorder = ["geode", "obsidian", "clay", "ore"] as Resource[];

interface Robot {
  type: Resource;
}

class BluepringState {
  remainingMinutes: number;
  robots: Record<Resource, number>;
  resources: Record<Resource, number>;
  constructor(
    minutes: number,
    robots: Record<Resource, number>,
    resources: Record<Resource, number>
  ) {
    this.remainingMinutes = minutes;
    this.robots = robots;
    this.resources = resources;
  }

  toString(): string {
    return `M: ${this.remainingMinutes}, rbts: ${resourceorder
      .map((type) => this.robots[type])
      .join(",")}, resources: ${resourceorder
      .map((type) => this.resources[type])
      .join(",")}`;
  }

  get geodeRobots(): number {
    return this.robots.geode;
  }

  get maxPossibleGeodes(): number {
    return (
      this.resources.geode + this.remainingMinutes * (this.geodeRobots || 0)
    );
  }

  get resourcesAfterMinute(): Record<Resource, number> {
    return resourceorder.reduce(
      (memo, type) => ({
        ...memo,
        [type]: (memo[type] || 0) + (this.robots[type] || 0),
      }),
      this.resources
    );
  }

  canBuildGeode(blueprint: Blueprint): boolean {
    return (
      this.resources.ore >= (blueprint.robotCosts.geode?.ore ?? 0) &&
      this.resources.obsidian >= (blueprint.robotCosts.geode?.obsidian ?? 0)
    );
  }

  canBuildObsidian(blueprint: Blueprint): boolean {
    return (
      this.robots.obsidian < 20 &&
      this.resources.ore >= (blueprint.robotCosts.obsidian?.ore ?? 0) &&
      this.resources.clay >= (blueprint.robotCosts.obsidian?.clay ?? 0)
    );
  }

  canBuildClay(blueprint: Blueprint): boolean {
    return (
      this.robots.clay < 20 &&
      this.resources.ore >= (blueprint.robotCosts.clay?.ore ?? 0)
    );
  }

  canBuildOre(blueprint: Blueprint): boolean {
    return (
      this.robots.ore < 4 &&
      this.resources.ore >= (blueprint.robotCosts.ore?.ore ?? 0)
    );
  }
}

class Blueprint {
  public id: number;
  public robots: Record<Resource, number>;
  public robotCosts: Record<Resource, Partial<Record<Resource, number>>>;
  constructor(blueprintString: string) {
    this.robots = {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    };
    const regexp =
      /Blueprint (?<id>\d{1,2}): Each ore robot costs (?<oreCostOre>\d{1,}) ore. Each clay robot costs (?<oreCostClay>\d{1,}) ore. Each obsidian robot costs (?<oreCostObsidian>\d{1,2}) ore and (?<clayCostObsidian>\d{1,}) clay. Each geode robot costs (?<oreCostGeode>\d{1,2}) ore and (?<obsidianCostGeode>\d{1,2}) obsidian./;

    const match = blueprintString.match(regexp);
    if (!match) {
      throw new Error("Invalid blueprint");
    }
    const {
      id,
      oreCostOre,
      oreCostClay,
      oreCostObsidian,
      clayCostObsidian,
      oreCostGeode,
      obsidianCostGeode,
    } = match.groups!;

    this.id = Number(id);
    this.robotCosts = {
      ore: {
        ore: Number(oreCostOre),
      },
      clay: {
        ore: Number(oreCostClay),
      },
      obsidian: {
        ore: Number(oreCostObsidian),
        clay: Number(clayCostObsidian),
      },
      geode: {
        ore: Number(oreCostGeode),
        obsidian: Number(obsidianCostGeode),
      },
    };
  }

  public runBlueprintDynamic(minutes: number): number {
    const states = new Map<string, BluepringState>();
    const seenStates = new Set<string>();
    this.robots = {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    };
    let maxGeodes = 0;

    const initialState = new BluepringState(minutes, this.robots, {
      clay: 0,
      geode: 0,
      obsidian: 0,
      ore: 0,
    });

    states.set(initialState.toString(), initialState);

    while (states.size > 0) {
      const state = states.values().next().value as BluepringState;
      const stateId = state.toString();

      if (state.resources.geode >= maxGeodes) {
        maxGeodes = state.resources.geode;
      }

      if (state.remainingMinutes >= -1) {
        if (state.maxPossibleGeodes < maxGeodes) {
          states.delete(stateId);
          continue;
        }

        if (state.canBuildGeode(this)) {
          const newResources = state.resourcesAfterMinute;
          const newState = new BluepringState(
            state.remainingMinutes - 1,
            { ...state.robots, geode: state.robots.geode + 1 },
            {
              ...newResources,
              geode: newResources.geode,
              ore: newResources.ore - this.robotCosts.geode.ore!,
              obsidian: newResources.obsidian - this.robotCosts.geode.obsidian!,
            }
          );
          const newStateId = newState.toString();
          if (!seenStates.has(newStateId)) {
            states.set(newStateId, newState);
          }
        }

        if (state.canBuildObsidian(this)) {
          const newResources = state.resourcesAfterMinute;
          const newState = new BluepringState(
            state.remainingMinutes - 1,
            { ...state.robots, obsidian: state.robots.obsidian + 1 },
            {
              ...newResources,
              obsidian: newResources.obsidian,
              ore: newResources.ore - this.robotCosts.obsidian.ore!,
              clay: newResources.clay - this.robotCosts.obsidian.clay!,
            }
          );
          const newStateId = newState.toString();
          if (!seenStates.has(newStateId)) {
            states.set(newStateId, newState);
          }
        }

        if (state.canBuildClay(this)) {
          const newResources = state.resourcesAfterMinute;
          const newState = new BluepringState(
            state.remainingMinutes - 1,
            { ...state.robots, clay: state.robots.clay + 1 },
            {
              ...newResources,
              clay: newResources.clay,
              ore: newResources.ore - this.robotCosts.clay.ore!,
            }
          );
          const newStateId = newState.toString();
          if (!seenStates.has(newStateId)) {
            states.set(newStateId, newState);
          }
        }

        if (state.canBuildOre(this)) {
          const newResources = state.resourcesAfterMinute;
          const newState = new BluepringState(
            state.remainingMinutes - 1,
            { ...state.robots, ore: state.robots.ore + 1 },
            {
              ...newResources,
              ore: newResources.ore - this.robotCosts.clay.ore!,
            }
          );

          const newStateId = newState.toString();
          if (!seenStates.has(newStateId)) {
            states.set(newStateId, newState);
          }
        }

        // Do nothing
        {
          const newState = new BluepringState(
            state.remainingMinutes - 1,
            state.robots,
            state.resourcesAfterMinute
          );

          const newStateId = newState.toString();
          if (!seenStates.has(newStateId)) {
            states.set(newStateId, newState);
          }
        }
      }

      states.delete(stateId);
      seenStates.add(stateId);
    }

    return maxGeodes;
  }
}

solveInput({
  onInput(line) {
    const blueprint = new Blueprint(line);
    console.log({
      // costs: blueprint.robotCosts,
      // resources: blueprint.runBlueprint(24),
      // robots: blueprint.robots,
      maxGeodes: blueprint.runBlueprintDynamic(24),
    });
  },
  onEnd() {},
  pathToInputFile: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    isExample ? "input_example.txt" : "input.txt"
  ),
});
