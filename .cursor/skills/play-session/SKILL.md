---
name: play-session
description: Gem Puzzle shell, labels, timer, move count, saved game, sound, and top 10. Use when implementing layout, menu, timer, moves, localStorage, sound, leaderboard, or the win message.
---

# Play session

Copy labels from `TASK.md` exactly. Below is how they are wired into markup and storage.

## Screen shell

The application root is an element with class `app` inside `body`.

Identifiers:

- `#menu-toggle` — the Menu button, on a narrow screen
- `#controls` — the actions block
- `#size-select` — the size selector
- `#new-game` — New game
- `#auto-solve` — Auto-solve
- `#sound-toggle` — Sound on / Sound off; `aria-pressed` reflects whether sound is on
- `#scores-toggle` — Scores
- `#scores-panel`, list `#score-list`
- `#images-toggle` — Images
- `#board` — the board
- `#timer` — time
- `#move-count` — moves
- `#win-message` — the win text

At 1280px and wider, the board and the actions share one row and there is no horizontal scroll. Around 768px both blocks stay usable. At 375px the board fits the screen, `#menu-toggle` is visible, and that button opens `#controls`.

Colors: dark background `#14110e`, text `#f6f1e7`, accent `#e07a3d`, tile `#f3e6cf`, tile ink `#2a2118`. The interface font is a system grotesque. The title is a serif.

## Time and moves

`#timer` shows `mm:ss`. Minutes and seconds are padded to two digits. The reading increases while the game is in progress. `#move-count` counts only successful moves.

New game and the `N` key start a new solvable game of the current size without reloading the document. The timer and the counter return to zero. `N` does nothing when focus is in a text field or the size selector.

## Resume

`localStorage` key: `gem_puzzle_state`.

Store the size, the tile array, the move count, and the elapsed milliseconds. Write the state when leaving the page and after the game changes. On load, restore the board and the moves. The timer continues from the saved milliseconds and does not restart at `00:00`. Ignore invalid state and start a new 4×4 game.

## Win

`#win-message` text:

`Hooray! You solved the puzzle in #:## and N moves.`

`#:##` is the current `#timer`. `N` is the current `#move-count`. After a win, the game timer stops.

## Sound

A successful move with sound enabled plays a short cue through the Web Audio API, with no audio file in the repository. Sound off suppresses the cue. Sound on brings it back. A failed click plays no sound.

## Scores

Key: `gem_puzzle_scores`. An entry stores the move count and the milliseconds. A win adds a result. The list holds at most 10 entries. Order: fewer moves, then less time. Scores shows and hides the panel. The list is read again after a reload.
