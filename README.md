# Solutions for Advent of Code

# 2024

### day 1

Just gather both lists in two arrays. Iterate over them in both parts. This is performatively acceptable.

### day 2

Iterate over the list of numbers and compare them with each other in first part. In second part, when first "error" is encountered - remove this number, next number and previous number from the list and run check for each of the result arrays.

### day 3

Use regular expressions to parse the input. Then iterate over the lines and sum multiplies. On second step, consider `do` and `don`.

# 2022
### day 1

Heap can be used in part two, but on this scale - `.sort()` will do.

### day 2

Should create more sofisticated Rock Paper Scissors algorithm - but series of `if` & `switches` works just fine.

### day 3

Comparison of Sets.

### day 4

Read pairs by line and compare borders.

### day 5

Create Stack class, that will handle stacks state and accepts commands.
First parse the Stack state, then read commands line by line.

### day 6 

Create a "sliding window" to iterate over string. On each iteration create a Set and check it's length.

### day 7

Save folders sizes in one single object and use a stack to add size to upper directories. Probably graph structure should be used.

### day 8

Read whole grid in memory. "Look" at grid from all sides, marking and counting "visible" trees.

### day 9

Create grid of abstract size (BIG). Then just move tail where head was.

### day 10

Create grid and simple cycle. Use % division, to determine position on CRT from current tick.

### day 11

Really monkey business. Cycles and structures. Add two new lines to end of input, to simplify parsing by `readline`. Use module division, since all tests use prime numbers.

### day 12

Path finding. Find length of shortest path from S to E. Time to roll out Dijkstra. 
Start looking from destination, to find nearest start.

### day 13

Use recursive strategy to compare lists. 

### day 14

Fucking sand. It coarse and it gets everywhere.

### day 15

Find coverage intervals for each line. Use interval merging algoritm to find gap with beacon.

### day 16

Dynamic programming problem. Build graph of connected valves. Finds distances with WFI algorithm (new find), then iterate over combinations of not empty valves. 

### day 17

Tetris. Tip to right side to be able to add height more easily. Add fuckload of memory and cut height to make it work for 1 trillion.

### day 18

Create a N-sized 3-dimentional grid. "Flood fill" free space to find number of free sides.

### day 19

Use DFS to find the best combination of creating robots or waiting for the pass.
