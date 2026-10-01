# Gem Puzzle

A browser sliding puzzle. How the game should look and behave is in `TASK.md`. That file is the product description. The build and the technical constraints live in the agents and their skills under `.cursor/`.

The game is built from GitHub board tasks. Every task together equals the finished product.

## One chat

The person names a board task in the current chat. The agent reads it, proposes a description and a plan, and waits. After approval or edits, the initializer, coder, and evaluator roles work in that same chat. They move the card on the issue and on the project board, and the evaluator opens the pull request.

Another chat per role is not needed.

After the task is done, the person only reviews the pull request and merges it. The evaluator then moves the card to Done on the issue and on the project, closes the issue, and records the task in `docs/progress.md`.

## Roles

- `.cursor/agents/initializer.md` — reads the task, sets project Status `Todo`, and agrees the plan
- `.cursor/agents/coder.md` — builds the agreed scope
- `.cursor/agents/evaluator.md` — checks that scope, moves the card through `In progress` and `In review`, opens the pull request, and after the merge sets `Done`, closes the issue, and updates `docs/progress.md`

## Board

Tasks are labeled `board:backlog`, `board:in-progress`, `board:in-review`, and `board:done`. The user project `harness for gem-puzzle` keeps the same card in Status: No Status, then `Todo`, `In progress`, `In review`, and `Done`. The person merges the pull request. The evaluator sets `Done` after that merge. A new task chat checks out `main` and pulls when the latest merged GP is not already there. `gh` needs the `project` scope (`gh auth refresh -s project`).

```bash
gh issue list --label board:backlog --limit 30
```

The branch `feat/cursor_work_2` keeps a finished game as a behavior reference. Do not rewrite it or merge it into a task.
