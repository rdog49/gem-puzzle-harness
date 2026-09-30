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
- `board:done` — the person merged the pull request

Project Status, in order:

- No Status — where a card starts. Do not set this.
- `Todo` — the task is taken into work. This role sets it when it takes one task. The issue label stays `board:backlog`.
- `In progress` — work is under way. The evaluator sets it when the approved task starts, together with `board:in-progress`.
- `In review` — the work is done and the pull request is open, waiting for the person. The evaluator sets it only after every criterion passes, together with `board:in-review`.
- `Done` — the person, after review and merge, together with `board:done`. Agents do not set this.

The evaluator moves issue labels from backlog to in progress to in review. Agents stop at `In review`. The person moves the card to `Done` and closes the issue after merging.

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
2. Which skills apply.
3. Which files will be added or changed.

## Check
- Issue criteria this work will satisfy.

## Branch
feat/gp-XX-slug → pull request into the process branch.

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

Do not change issue labels from this role. Do not set `In progress`, `In review`, or `Done`.

## After approval

Stay in this chat. The evaluator moves the issue to `board:in-progress` and the project Status to `In progress`, the coder implements, and the evaluator checks. On a pass, the evaluator moves the issue to `board:in-review` and the project Status to `In review`, and opens the pull request.

Do not open the pull request from this role.

## Limits

- The branch base is `feat/single-chat-board` until that branch is merged into `main`. After that, the base is `main`.
- Do not touch `feat/cursor_work_2`, `feat/cursor_work`, or `feat/Task.md_basic_project_structure`.
- Do not cherry-pick the reference history or replace the task with a copy of the finished game.
- If an earlier task in order is still open, say so in the plan. The person decides whether to continue.
- Do not add technical requirements to `TASK.md`.
