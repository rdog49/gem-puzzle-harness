---
name: board-task
description: Reads one GitHub board task, writes a plan, and waits for approval before any code. Use when the user mentions a GitHub issue, board, backlog, kanban, or asks to look at a task.
---

# Board task

Work comes from an issue in `rdog49/gem-puzzle-harness`. The same card has an issue label and a Status on the user project `harness for gem-puzzle` (owner `rdog49`).

Issue labels:

- `board:backlog` — not started
- `board:in-progress` — the plan is approved and work is under way
- `board:in-review` — the pull request is open. A closed issue may keep this label. The agent does not set `board:done`.

Project Status, in order:

- No Status — where a card starts. Do not set this.
- `Todo` — `/choose-task` sets it when the person takes one task. The issue label stays `board:backlog`.
- `In progress` — `/plan` sets it when the person approves the plan, together with `board:in-progress`.
- `In review` — `/pull-request` sets it when the pull request opens, together with `board:in-review`.
- `Done` — the project workflows set it after the person merges the pull request, and they close the issue. The agent does not set it.

The person reviews the pull request and merges it. Do not set `Done` while the pull request is still open.

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

The person lists open tasks with `/tasks` and takes one with `/choose-task`. If they did not name a number, `/tasks` shows the backlog and waits.

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

The person confirms or edits that plan with `/plan`.

## Project status

`/choose-task` sets Status `Todo`. `/plan` sets `In progress` only after approval. `/pull-request` sets `In review`. Do not set `Done`. The project workflows set it after the merge.

## After approval

Stay in this chat. The rest of the loop is `docs/workflow.md`. The coder does not commit. Do not open the pull request from this role. Do not set `Done` on the task just taken.

## Limits

- The branch base is `main`, after "Start from main". The pull request targets `main`.
- Do not touch `feat/cursor_work_2`, `feat/cursor_work`, or `feat/Task.md_basic_project_structure`.
- Do not cherry-pick the reference history or replace the task with a copy of the finished game.
- If an earlier task in order is still open, say so in the plan. The person decides whether to continue.
- Do not add technical requirements to `TASK.md`.
