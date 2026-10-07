---
name: "/choose-task"
id: "choose-task"
category: "Workflow"
description: "Take the one board task the person named, then write the plan and wait"
---

The person runs this with one issue number. If the message has no number, stop and ask for one. Do not guess. Do not take a second task.

Follow "Start from main" in the `board-task` skill before reading the issue. Then:

```bash
gh issue view NUMBER
```

Set Status `Todo` on the user project `harness for gem-puzzle` (owner `rdog49`). Do not use any other project. Leave the issue label as it is. Do not set `In progress`, `In review`, or `Done`. Do not move a card that is already `In progress`, `In review`, or `Done` back to `Todo`.

`gh` needs the `project` scope. If a project command reports a missing scope, run `gh auth refresh -s project` and retry.

```bash
gh project list --owner rdog49 --limit 30
```

`PROJECT` is the number whose title is `harness for gem-puzzle`. `ISSUE_URL` is `https://github.com/rdog49/gem-puzzle-harness/issues/NUMBER`.

```bash
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "Todo"
```

If add reports that the item already exists, still set Status. If the value is rejected, list the options and use the to-do column's name:

```bash
gh project field-list PROJECT --owner rdog49
```

Then write the plan in the reply shape from the `board-task` skill, and stop. Do not create a branch. Do not change files. The person confirms or edits that plan with `/plan`.
