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
