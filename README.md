# Gem Puzzle Harness

This repository is a harness shell for AI agents in Cursor. Gem Puzzle is the product the shell builds from board cards. The repository itself is the shell: roles, skills, one chat rule, and the path of a card through to a pull request.

## The game

The tree already contains a browser sliding puzzle. The player slides a tile into the empty cell. The default board is 4×4 (tiles 1–15 and one empty cell). The size can be chosen from 3×3 to 8×8. A new game is shuffled at random and can be solved.

A tile that shares an edge with the empty cell can be moved by a click or by a drag onto that cell. A move is a slide of about 200 ms. The screen shows the time as `mm:ss` and the number of successful moves. Reloading the page keeps the layout, the move count, and the elapsed time. When the board is solved, a congratulation appears over the board with the same time and the same move count.

The game has a move sound, a Top 10 list, pictures instead of numbers, and auto-solve. The picture is fetched over the network (Picsum): while the file is on the way, a loading message is visible; on failure the numbered tiles and a retry button remain; three previews are on screen at once, and another picture can be chosen without reloading. Auto-solve finishes the board by itself, one move after another.

On a wide screen the board and the actions sit side by side. On a tablet both stay reachable. On a phone the board fits the screen width, and the actions open from the Menu button.

How the game should behave is in `TASK.md`. What each card already added is in `docs/progress.md`.

The development server listens on port 8080. `npm run lint` checks `src`. `npm run build` writes `dist` with relative paths. A push to `main` publishes that build to GitHub Pages: https://rdog49.github.io/gem-puzzle-harness/. The page is JavaScript (ES modules), HTML, and CSS. Webpack builds it. Network calls use `fetch`. The page markup is empty: the script draws the game.

## The harness

The shell takes one GitHub board card through three roles in one chat. The person names a task in the current chat. The agent reads it, proposes a plan, and waits. After approval or edits, the same three roles continue that card here: code, the check, the board move, and the pull request. A separate chat per role is not opened.

The roles live in `.cursor/agents/`:

1. **Initializer** reads one issue, compares it with `TASK.md`, and sets Status `Todo` on the project `harness for gem-puzzle`. The chat gets a description and a plan. Files stay unchanged until the person agrees or edits the plan.
2. After agreement, the **evaluator** moves the issue label to `board:in-progress` and the project Status to `In progress`.
3. **Coder** cuts the branch `feat/gp-XX-slug` from an up-to-date `main` and writes only the agreed scope. Labels and behavior come from `TASK.md`. The implementation method comes from the skills. The coder does not commit.
4. **Evaluator** runs the linter, the build, and a browser pass against this card's criteria. If something breaks, the card stays `In progress`, and the coder fixes it in the same chat.
5. When the check passes, the evaluator appends a section to `docs/progress.md` and makes one commit: the task changes and that file, message `feat: GP-XX short result`. The card moves to `board:in-review` and Status `In review`, and a pull request into `main` is opened. The person reviews the pull request and merges it. The agent does not merge.
6. After the merge, the evaluator sets `board:done` and Status `Done` and closes the issue. The `docs/progress.md` section is already inside the merged commit. It is not edited again on `main`.

The next chat starts on `main`. If the latest merged pull request is not yet in local `main`, it is pulled first, and only then is the new branch cut.

One task is one branch, one commit, and one pull request.

### What the shell is made of

- `.cursor/rules/single-chat.mdc` — the rule for every chat: one card, three roles, one chat.
- `.cursor/agents/initializer.md` — the plan and Status `Todo`.
- `.cursor/agents/coder.md` — the code for the agreed scope.
- `.cursor/agents/evaluator.md` — the check, the task's single commit, the board, and the pull request.
- `.cursor/skills/board-task` — how to read a card, set `Todo`, and stop at the plan.
- `.cursor/skills/frontend-stack` — Webpack, ESLint (airbnb-base), ES modules, an empty `body`, and network calls through `fetch`.
- `.cursor/skills/puzzle-rules` — the board, the shuffle, moves, sizes, animation, and auto-solve.
- `.cursor/skills/play-session` — the page shell, labels, timer, moves, saved game, sound, and Top 10.
- `.cursor/skills/picture-tiles` — pictures, previews, loading, retry, and request cancellation.
- `.cursor/skills/verify-task` — lint, the build, a browser pass, the progress record, the card move, and the pull request.
- `TASK.md` — the product description only. Technical constraints stay in the skills.
- `docs/progress.md` — the record of closed cards: what the player gained and how it was built.

### Board

Tasks are issues in `rdog49/gem-puzzle-harness`. Issue labels are `board:backlog`, `board:in-progress`, `board:in-review`, and `board:done`. The same card on the project `harness for gem-puzzle` (owner `rdog49`) moves through Status: No Status, then `Todo`, `In progress`, `In review`, and `Done`. Project commands need the `project` scope on `gh` (`gh auth refresh -s project`).

The branch `feat/cursor_work_2` keeps a finished game as a behavior reference. It is not merged into tasks, and task code is not copied from it.
