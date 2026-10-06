---
name: board-task
description: Reads one GitHub board task, writes a plan, and waits for approval before any code. Use when the user mentions a GitHub issue, board, backlog, kanban, or asks to look at a task.
---

# Board task

Work comes from an issue in `rdog49/gem-puzzle-harness`. The same card has an issue label and a Status on the user project `harness for gem-puzzle` (owner `rdog49`).

Issue labels:

- `board:backlog` — not started
- `board:in-progress` — the plan is approved and work is under way
- `board:in-review` — the check passed and the pull request is open
- `board:done` — the person merged the pull request, and the evaluator then closed the card

Project Status, in order:

- No Status — where a card starts. Do not set this.
- `Todo` — the task is taken into work. This role sets it when it takes one task. The issue label stays `board:backlog`.
- `In progress` — work is under way. The evaluator sets it when the approved task starts, together with `board:in-progress`.
- `In review` — the work is done and the pull request is open, waiting for the person. The evaluator sets it only after every criterion passes, together with `board:in-review`.
- `Done` — the evaluator sets it after the person has merged the pull request, together with `board:done`, and then closes the issue.

The evaluator moves issue labels from backlog to in progress to in review. The person reviews the pull request and merges it. After that merge, the evaluator sets `board:done` and `Done` and closes the issue. Do not set `Done` while the pull request is still open.

## Start from main

A new chat does this before it reads the new task, and the coder does it again before creating the branch. The base is `main`. The pull request targets `main`.

```bash
git checkout main
git fetch origin
gh pr list --base main --state merged --limit 1 --json number,title,mergeCommit
```

`MERGE_SHA` is `mergeCommit.oid` of that latest merged pull request (the finished GP).

```bash
git merge-base --is-ancestor MERGE_SHA HEAD
```

Exit 0 means local `main` already contains that pull request. Continue.

Any other result means it is not pulled yet, including a non-zero `git rev-list --count HEAD..origin/main`:

```bash
git pull --ff-only origin main
```

Run the ancestor check again. Continue only after it exits 0. If there is no merged pull request yet, pull `main` when it is behind `origin/main`, then continue.

Then read what already shipped. Open `CHANGELOG.md` and run `git log -8 --oneline`. Do not plan or build a task that repeats a finished entry.

## Read the task

```bash
gh issue view NUMBER
gh issue list --label board:backlog --limit 30
```

Take one task. If the person did not name a number, show the backlog and wait for a number.

## Reply before code

Use this shape and stop:

```markdown
## Task
#NUMBER — title

## Description
What the player gets, in your own words.

## How I will do it
1. Steps for this scope only.
2. Which files in `docs/` apply, and which skills apply.
3. Which files will be added or changed.

## Check
- Issue criteria this work will satisfy.

## Branch
feat/gp-XX-slug → pull request into `main`.

Waiting for approval or edits. I will not change files until you reply.
```

Approval is "go", "approved", "ok", "do it", or "ship it", and direct synonyms. An edit without one of those words updates the plan and does not start the work.

## Project status

`gh` needs the `project` scope. If a project command reports a missing scope, run `gh auth refresh -s project` and retry.

```bash
gh project list --owner rdog49 --limit 30
```

`PROJECT` is the number whose title is `harness for gem-puzzle`. Do not use any other project. `ISSUE_URL` is `https://github.com/rdog49/gem-puzzle-harness/issues/NUMBER`.

When this role takes one task, add it if it is missing, then set Status to `Todo`. If add reports that the item already exists, still set Status. Do not move a card that is already `In progress`, `In review`, or `Done` back to `Todo`.

```bash
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "Todo"
```

If the value is rejected, list the options and use the name of the to-do column:

```bash
gh project field-list PROJECT --owner rdog49
```

Do not change issue labels from this role. Do not set `In progress`, `In review`, or `Done` on the task just taken. `Done` after a merge belongs to the evaluator.

## After approval

Stay in this chat. The evaluator moves the issue to `board:in-progress` and the project Status to `In progress`, the coder implements, and the evaluator checks. The coder does not commit. On a pass, the evaluator follows the `keep-changelog` skill and makes one commit that contains the task and `CHANGELOG.md`, then moves the issue to `board:in-review` and the project Status to `In review`, and opens the pull request. The person reviews it and merges it. The evaluator then sets `board:done` and Status `Done` and closes the issue. That close leaves `CHANGELOG.md` as the `keep-changelog` skill requires.

Do not open the pull request from this role. Do not set `Done` on the task just taken.

## Limits

- The branch base is `main`, after "Start from main". The pull request targets `main`.
- Do not touch `feat/cursor_work_2`, `feat/cursor_work`, or `feat/Task.md_basic_project_structure`.
- Do not cherry-pick the reference history or replace the task with a copy of the finished game.
- If an earlier task in order is still open, say so in the plan. The person decides whether to continue.
- Do not add technical requirements to `TASK.md`.
