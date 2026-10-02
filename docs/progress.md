# Project progress

This file is the record of finished Gem Puzzle board tasks. The evaluator appends one section on the task branch. That section is part of the single task commit, before the pull request is offered for review. Older sections stay. Do not rewrite them. Do not add a section on `main` after the merge. Do not commit this file by itself.

Product behavior stays in `TASK.md`. This file says what each finished task added and how it was built.

## GP-01 — Page shell and build

- Issue: #7
- Pull request: #28
- Merged: 2026-09-30
- What: The page shows the title Gem Puzzle and nothing else. The development server listens on port 8080. The production build writes `dist` with a relative script path. `npm run lint` covers `src`.
- How: `src/index.html` is an empty body. `src/index.js` calls `mountApp` from `src/modules/app.js`, which creates the title in the DOM and loads `src/styles/main.css`. Webpack uses `html-webpack-plugin`, `css-loader`, and `style-loader`. ESLint uses `eslint-config-airbnb-base`. The page does not use jQuery, React, Vue, Angular, or Axios.

## GP-02 — Responsive shell

- Issue: #8
- Pull request: #30
- Merged: 2026-10-01
- What: The page shows the title Gem Puzzle, an empty board, and the actions. From 1280px the board and the actions sit on one row and the page does not scroll sideways. Around 768px both stay reachable. At 375px the board fits the width, and Menu opens the actions.
- How: `src/modules/app.js` builds the shell in the DOM: `#menu-toggle`, `#board`, and `#controls` with Size (3×3–8×8, 4×4 selected), New game, Auto-solve, Sound on, Scores, Images, Time `00:00`, and Moves `0`. `src/styles/main.css` stacks the blocks below 1280px, puts them in a row from 1280px, and hides the actions behind Menu below 768px.

## GP-03 — Default 4x4 board

- Issue: #9
- Pull request: #32
- Merged: 2026-10-01
- What: Without choosing another size, the player sees a 4×4 board: tiles 1–15 in order and one empty cell.
- How: `src/modules/board.js` builds the solved order, with 0 as the empty cell, and `src/modules/app.js` paints it into `#board`. `src/styles/main.css` lays the cells out as a 4×4 grid. Numbered tiles are light. The empty cell has no number. Shuffle, clicks, and other sizes stay out of this task.

## GP-04 — Solvable shuffle

- Issue: #10
- Merged: 2026-10-01
- What: A new 4×4 game is shuffled, unsolved, and solvable. Loading the page again can show a different order.
- How: `src/modules/board.js` starts from the solved board and applies `N * N * 12` random legal moves of the empty cell. If the board is still solved, it makes one more legal move. The parity check treats the empty cell as `N * N` and adds its taxicab distance to the bottom-right cell. `src/modules/app.js` paints that layout into `#board`. Clicks, dragging, and other sizes stay out of this task.

## GP-05 — Click to move

- Issue: #11
- Merged: 2026-10-01
- What: A click on a tile that shares an edge with the empty cell swaps the two cells and raises the move count by 1. A click on any other tile leaves the board and the count unchanged.
- How: `src/modules/board.js` accepts the click only when the row distance plus the column distance is 1, then swaps that tile with the empty cell and redraws. `src/modules/app.js` updates `#move-count` after that swap. `src/styles/main.css` draws numbered tiles as buttons that fill the cell. Dragging, the slide animation, and sound stay out of this task.

## GP-06 — Drag and drop

- Issue: #12
- Merged: 2026-10-01
- What: Dragging a tile onto the empty cell moves it when the two cells share an edge, and the move count rises by 1. Dropping a tile that does not share an edge leaves the board and the count unchanged. A click on a neighbor still makes the same move.
- How: `src/modules/board.js` makes numbered tiles draggable and accepts a drop only on the empty cell, through the same neighbor check as a click. A drop that is not a neighbor does not redraw and does not call the move callback. `src/modules/app.js` still updates `#move-count` from that callback. `src/styles/main.css` uses a grab cursor on numbered tiles. The slide animation and auto-solve stay out of this task.

## GP-07 — Restart without reload

- Issue: #13
- Merged: 2026-10-01
- What: New game and the N key deal a new solvable 4×4 layout without reloading the page. Time returns to 00:00 and the move count returns to 0. N does nothing while the size selector is focused.
- How: `src/modules/board.js` deals again with the same shuffle, using the size already on the board. `src/modules/app.js` wires `#new-game` and the N key to that deal and resets `#timer` and `#move-count`. The clock does not tick yet, and changing the size stays out of this task.

## GP-08 — Timer and move count

- Issue: #14
- Merged: 2026-10-01
- What: The player sees the elapsed time as mm:ss while the game is in progress, and the move count rises only after a successful move. New game and the N key return the time to 00:00 and the count to 0.
- How: `src/modules/app.js` starts a one-second interval from the moment a game starts and writes minutes and seconds, each at least two digits, into `#timer`. The same start clears the previous interval. `#move-count` still updates only from the successful-move callback in `src/modules/board.js`. The win text, the score list, and resume after reload stay out of this task.

## GP-09 — Resume after reload

- Issue: #15
- Merged: 2026-10-01
- What: Reloading the page keeps the same board, the same move count, and the elapsed time. The clock continues from the saved milliseconds. A broken saved record starts a new 4×4 game.
- How: `src/modules/session.js` reads and writes `gem_puzzle_state`: size, tiles, moves, and elapsed milliseconds. `src/modules/board.js` paints a saved layout and reports the tiles after a successful move. `src/modules/app.js` restores that layout, the move count, and the clock, and writes the record after a new game, after a move, and when the page is left. Scores and pictures stay out of this task.

## GP-10 — Grid size from 3x3 to 8x8

- Issue: #16
- Merged: 2026-10-01
- What: The player chooses 3x3, 4x4, 5x5, 6x6, 7x7, or 8x8. Each choice starts a new solvable game of that size without reloading the page. 3×3 has nine cells and one empty cell. 8×8 has 64 cells and one empty cell.
- How: `src/modules/app.js` listens to `#size-select` and starts a new game through the existing shuffle, which already deals any size from 3 to 8 by moving the empty cell. The move count and the timer return to zero. Pictures stay out of this task.

## GP-11 — Sliding animation

- Issue: #17
- Merged: 2026-10-01
- What: A successful click and a legal drop slide that tile into the empty cell over about 200 ms. An illegal click or drop leaves the board where it is and does not animate another tile.
- How: `src/modules/board.js` measures the chosen tile and the empty cell, translates only that tile, then redraws and reports the move. `src/styles/main.css` runs that translation for 200 ms. Auto-solve stays out of this task.

## GP-12 — Win message

- Issue: #18
- Merged: 2026-10-02
- What: A solved board shows `Hooray! You solved the puzzle in #:## and N moves.` over the board. The time and the move count match the screen, and the timer stops. A saved solved game shows the same message and does not restart the clock. New game and a size change hide the message and start the clock from zero.
- How: `src/modules/board.js` exports `isSolved`. `src/modules/app.js` shows `#win-message` after the slide that finishes the board, freezes the saved milliseconds, and stops the clock. `src/styles/main.css` places that text over the board. Scores and auto-solve stay out of this task.

## GP-13 — Move sound

- Issue: #19
- Merged: 2026-10-02
- What: A successful move plays a short cue. The button switches between Sound on and Sound off. Sound off keeps the next successful move quiet, and Sound on brings the cue back. A click that does not move a tile stays silent. The toggle is not kept after a reload.
- How: src/modules/sound.js plays a short Web Audio oscillator and adds no audio file. src/modules/app.js wires #sound-toggle and aria-pressed, and plays the cue from the successful-move callback. The saved game still stores only size, tiles, moves, and elapsed milliseconds. Scores and pictures stay out of this task.

## GP-14 — Top 10 scores

- Issue: #20
- Merged: 2026-10-02
- What: The Scores button opens and hides a Top 10 list. A win adds the move count and the time. The list keeps at most ten results, with fewer moves first and then less time. The list remains after a reload. Opening a saved solved game does not add that result again.
- How: `src/modules/session.js` reads and writes `gem_puzzle_scores`. `src/modules/app.js` records a result only when a move first solves the board, and `#scores-toggle` shows and hides `#scores-panel` with `#score-list`. `src/styles/main.css` places the list in the actions column. Pictures and auto-solve stay out of this task.

## GP-15 — Picture tiles

- Issue: #21
- Merged: 2026-10-02
- What: Images loads the first picture from a keyless Picsum list and lays its fragments on the occupied tiles. The empty cell stays empty. A neighboring move still slides that fragment into the gap. A new game and a size change keep the same picture.
- How: `src/modules/images.js` fetches `https://picsum.photos/v2/list?page=1&limit=12`, then fetches `https://picsum.photos/id/{id}/800/800` with `fetch`, reads a blob, and shows it through an object URL. `src/modules/board.js` paints each occupied cell with `background-size` and `background-position` from the tile number. `src/modules/app.js` wires `#images-toggle`. `src/styles/main.css` stops the picture from repeating. The error screen, request cancellation, and the preview row stay out of this task.

## GP-16 — Loading, error, and retry

- Issue: #22
- Merged: 2026-10-02
- What: While the picture list or the picture file is still on the way, the player sees Loading images…. After the request settles, that message is hidden. A failed request shows Could not load the image. Number tiles are shown instead., the Retry button, and numbered tiles. Retry sends the failed request again: the list when the list failed, or the file when the file failed.
- How: `src/modules/images.js` reports which request failed and skips the list when only the file needs another try. `src/modules/app.js` shows `#image-loader`, `#image-error`, and `#retry-image` inside `#image-panel`, and returns the tiles to numbers on failure. `src/styles/main.css` hides those messages when they are not in use. Request cancellation and the preview row stay out of this task.

## GP-17 — Image switch and thumbnails

- Issue: #23
- Merged: 2026-10-02
- What: The player sees three picture previews and can put another picture on the tiles without waiting for the previous load. The board keeps the latest choice. A cancelled request does not show the error screen. Loading, the error text, and Retry stay as they were.
- How: `src/modules/images.js` loads the Picsum list and three `180/180` previews with one `Promise.all`, and loads the `800/800` file as a blob. The list request and the file request each have an `AbortController`. A new choice calls `abort()`, and `AbortError` is not treated as a load error. `src/modules/app.js` draws the previews in `#thumbs` and applies only the latest picture. `src/styles/main.css` lays the previews in a row. Auto-solve stays out of this task.
