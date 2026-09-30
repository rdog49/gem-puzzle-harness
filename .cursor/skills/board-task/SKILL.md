---
name: board-task
description: Reads one GitHub board task, writes a plan, and waits for approval before any code. Use when the user mentions a GitHub issue, board, backlog, kanban, or asks to look at a task.
---

# Board task

Work comes from an issue in `rdog49/gem-puzzle-harness`. Board columns are labels:

- `board:backlog` — not started
- `board:in-progress` — the plan is approved and work is under way
- `board:in-review` — the check passed and the pull request is open
- `board:done` — the person merged the pull request

The evaluator moves cards between backlog, in progress, and in review. The person moves a card to `board:done` and closes the issue after merging.

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

## After approval

Stay in this chat. The evaluator moves the card to `board:in-progress`, the coder implements, and the evaluator checks. On a pass, the evaluator moves the card to `board:in-review` and opens the pull request.

Do not move cards from this role. Do not open the pull request from this role.

## Limits

- The branch base is `feat/single-chat-board` until that branch is merged into `main`. After that, the base is `main`.
- Do not touch `feat/cursor_work_2`, `feat/cursor_work`, or `feat/Task.md_basic_project_structure`.
- Do not cherry-pick the reference history or replace the task with a copy of the finished game.
- If an earlier task in order is still open, say so in the plan. The person decides whether to continue.
- Do not add technical requirements to `TASK.md`.
