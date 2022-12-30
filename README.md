# Solutions for Advent of Code
## day 1

Heap can be used in part two, but on this scale - `.sort()` will do.

## day 2

Should create more sofisticated Rock Paper Scissors algorithm - but series of `if` & `switches` works just fine.

## day 3

Comparison of Sets.

## day 4

Read pairs by line and compare borders.

## day 5

Create Stack class, that will handle stacks state and accepts commands.
First parse the Stack state, then read commands line by line.

## day 6 

Create a "sliding window" to iterate over string. On each iteration create a Set and check it's length.

## day 7

Save folders sizes in one single object and use a stack to add size to upper directories. Probably graph structure should be used.

## day 8

Read whole grid in memory. "Look" at grid from all sides, marking and counting "visible" trees.

## day 9

Create grid of abstract size (BIG). Then just move tail where head was.

## day 10

Create grid and simple cycle. Use % division, to determine position on CRT from current tick.

## day 11

Really monkey business. Cycles and structures. Add two new lines to end of input, to simplify parsing by `readline`. Use module division, since all tests use prime numbers.

## day 12

Path finding. Find length of shortest path from S to E. Time to roll out Dijkstra. 
Start looking from destination, to find nearest start.
