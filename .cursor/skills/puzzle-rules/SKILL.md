---
name: puzzle-rules
description: Gem Puzzle board rules — solvable shuffle, moves, sizes, sliding, and auto-solve. Use when implementing the board, shuffle, clicks, drag-and-drop, grid size, animation, or auto-solve.
---

# Board rules

Size `N` is from 3 to 8. There are `N * N` cells. Tiles are the numbers `1 … N*N-1`. The empty cell is `0`. The default `N` is 4.

A solved board reads left to right, top to bottom, with zero in the last cell.

## Neighbors and moves

Two cells are neighbors when the row distance plus the column distance is 1. A move swaps a tile with zero only when they are neighbors.

- A click on a neighboring tile makes the move and increases the move count by 1.
- A click on a non-neighboring tile changes neither the board nor the count.
- Dragging a neighboring tile onto the empty cell makes the same move.
- Dropping a non-neighboring tile on the empty cell changes nothing.

## Solvability

A permutation is solvable when `(inversions + taxicab) % 2 === 0`.

- While counting inversions, replace zero with `N * N`, so the empty cell is greater than every tile.
- `taxicab` is the sum of the absolute row and column differences between the empty cell and the bottom-right cell.

A new game is built from the solved board by a series of random legal blank moves (`N * N * 12` steps). If the board is still solved, make one more legal move. Do not deal a random permutation and then reject unsolvable ones as the only method.

Two new games may differ. The starting game is not solved.

## Size

The selector offers 3x3, 4x4, 5x5, 6x6, 7x7, and 8x8. Changing the size starts a new solvable game of that size. 3x3 has nine cells and one empty cell. 8x8 has 64 cells and one empty cell.

## Sliding

A successful click and a successful drop last about 200 ms: the tile visibly travels into the empty cell. An instant coordinate change with no transition does not qualify.

## Auto-solve

The Auto-solve button plays a sequence of legal moves only, until the board is solved. Each move is visible. The board does not jump to the solved state in one assignment. When the sequence ends, the normal win message shows the resulting time and move count.
