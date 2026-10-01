# Gem Puzzle

## Product
A browser sliding puzzle. The player solves the board by moving tiles into the empty cell. It is played on a desktop, a tablet, and a phone in the latest Google Chrome. A game in progress continues after a page reload. The demo opens as an ordinary page.

## Who it is for
Someone opens the page and wants to reach a win, change the board size, put a picture on the tiles instead of numbers, and see their best results.

## How it looks
- A calm dark screen, a warm accent, and light tiles. The title Gem Puzzle is large. The board is the main object.
- On a wide screen the actions and the board sit side by side. There is no horizontal scrolling.
- On a tablet the board and the actions stay reachable and nothing is clipped.
- On a phone the board fits the screen width. Actions are hidden behind a menu button and open when it is pressed.
- The empty cell looks empty. A move is a slide, not an instant jump.
- A win is obvious: a congratulation appears over the board.

## Labels
- Menu: Menu
- Size: Size, options from 3x3 to 8x8
- New game: New game
- Auto-solve: Auto-solve
- Sound on: Sound on. Sound off: Sound off
- Scores: Scores. List heading: Top 10
- Pictures: Images
- Time: Time. Moves: Moves
- Image loading: Loading images…
- Image error: Could not load the image. Number tiles are shown instead.
- Retry: Retry
- Win: Hooray! You solved the puzzle in #:## and N moves

## Rules of a game
- The default board is 4×4: fifteen numbered tiles and one empty cell.
- The player chooses a size from 3×3 to 8×8. Changing the size starts a new game.
- A new game is shuffled at random and can be solved. A solved board is not dealt at the start.
- A click on a tile next to the empty cell slides that tile into the gap. A click on a distant tile changes nothing.
- A tile can be dragged onto the empty cell when the two cells share an edge. An illegal drop does not change the board.
- A new game starts without reloading the page: the New game button and the N key.
- The screen shows the elapsed time as mm:ss and the number of successful moves. Both reset when a new game starts. Time increases while the game is in progress.
- Reloading the page in the middle of a game keeps the same layout, the same move count, and the elapsed time. Time does not start over at zero.
- When the board is solved, the win text shows the same time and the same move count as the screen.
- A successful move plays a sound. The sound can be turned off and on again.
- The Scores button opens at most ten best results. The list survives closing the page. The best results are on top.
- Tiles can show fragments of a picture instead of numbers. The picture is not packaged with the game: the player picks it from a set the game fetches. The empty cell stays empty, and the move rules stay the same.
- While a picture is on the way, a loading message is visible. If the request fails, the error text, the Retry button, and numbered tiles are shown.
- Another picture can be chosen without reloading the page. At least three previews are on screen at once. Choosing a preview puts that picture on the board.
- Auto-solve finishes the board by itself. The moves are visible one after another. After the last move the same congratulation appears.

## How work is run
- The whole product is split into board tasks. Closing all of them equals this description: no missing behavior and no extra product beyond it.
- The person asks to look at one board task and may edit the proposed way of doing it.
- The description, the plan, the implementation, and the check happen in one chat.
- One task is one branch and one pull request.
- The evaluator moves the issue card across the board and opens the pull request.
- When the check passes, the evaluator records the task in `docs/progress.md` on that task's branch, before the pull request is offered for review. The person reviews the pull request and merges it. The evaluator then moves the card to Done and closes the issue. `main` is not edited for that record.

## Done when
- A game can be played through to the congratulation on a wide screen, a tablet, and a phone.
- Size, sound, scores, pictures, and auto-solve behave as described above.
- Reloading the page does not wipe the current game.
- The board has no open tasks for this product.
