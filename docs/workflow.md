# Workflow

One chat carries one board task. The roles do not mix.

Procedures stay in the skills this file names. The git and `gh` steps stay in the commands. This file does not copy those commands.

`TASK.md` is the product description. Do not add procedures to it.

## Start from main

A new chat starts on `main`. Follow "Start from main" in the `board-task` skill before `/choose-task`. The base is `main`. Local `main` must already contain the latest merged pull request. If it does not, pull `main` first. The new branch is cut from that `main`. The pull request targets `main`.

Then read what already shipped. Open `CHANGELOG.md` and run the short log from that section, `git log -8 --oneline`. Do not plan or build a task that repeats a finished entry.

A merged card that is still open waits for the person to run `/done`.

## One card

Work comes from one issue in `rdog49/gem-puzzle-harness`. The same card has an issue label and a Status on the user project `harness for gem-puzzle` (owner `rdog49`).

Issue labels:

- `board:backlog` — not started
- `board:in-progress` — the plan is approved and work is under way
- `board:in-review` — the pull request is open
- `board:done` — the person merged the pull request, and `/done` then closed the card

Project Status, in order: No Status (do not set it), `Todo`, `In progress`, `In review`, `Done`.

1. `/tasks` lists `board:backlog`. It does not change a card.
2. `/choose-task` reads that issue and sets Status `Todo`. The issue label stays as it is. The reply is the description and the plan from `board-task`. Stop. No branch and no code until the person runs `/plan`.
3. `/plan` applies an edit and waits, or, on approval, sets `board:in-progress` and Status `In progress`. The coder then writes only that scope in this same chat.
4. The evaluator runs `verify-task` first. That check covers the formatter, the linter, the build, the unit tests, and, when the task is on screen, the browser. A failure stays on `board:in-progress` and Status `In progress`. The coder fixes that same task here. Do not start `openspec-verify-change` while this check is red. The check runs again from `verify-task`.
5. When `verify-task` passes and the task is an OpenSpec change, the evaluator runs `openspec-verify-change`. It checks the implementation against that change's spec, tasks, and design. A CRITICAL issue, or an applicable check left not verified, is a failure and stays on `board:in-progress`. WARNING and SUGGESTION are reported and do not by themselves fail the task. A game card with no spec skips this step.
6. When every check that applies has passed, the evaluator follows `keep-changelog`. The commit waits for `/commit`: one commit on the task branch, the task changes and `CHANGELOG.md` together. `/pull-request` then sets `board:in-review` and Status `In review` and opens the pull request. Stop. Do not merge. Do not make a second commit for the pull request number. Leave `CHANGELOG.md` as `keep-changelog` requires.
7. The person reviews the pull request and merges it.
8. `/done` sets `board:done` and Status `Done` and closes the issue. Do not do that while the pull request is still open. `/done` does not edit `CHANGELOG.md`.

## Git

Branch name: `feat/gp-XX-short-slug`, from the updated `main` in "Start from main".

Do not check out `feat/cursor_work_2`, `feat/cursor_work`, or `feat/Task.md_basic_project_structure`. Do not cherry-pick their commits or copy the finished game from them. Read a behavior detail with `git show` only when the plan asks for it.

The coder does not commit, does not push, and does not open a pull request. The person asks for those with `/commit` and `/pull-request`. The evaluator does each one once, after the check passes.

## Specs

OpenSpec lives in `openspec/` and the `openspec-*` skills. Use those skills when the specification changes. This harness has no `/opsx-*` commands.

A game card with no spec still goes through `board-task` and `verify-task`. Do not run `openspec-apply-change` or `openspec-verify-change` on that card. Do not archive a spec for every game card. OpenSpec does not replace the board.

The initializer explores with `openspec-explore` and proposes with `openspec-propose`. A revision of that plan is `openspec-update-change`, and that skill does not write code. The coder implements an approved OpenSpec change with `openspec-apply-change`. After steps 4 and 5 are green, the evaluator runs `openspec-sync-specs`, then `openspec-archive-change`.

## When a check or a review breaks

When a check is red or behavior is unexpected, open `systematic-debugging` before the fix. Do not delete a check or skip it to make the result green.

When review comments arrive, open `receiving-code-review` before applying them.
