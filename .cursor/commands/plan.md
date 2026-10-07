---
name: "/plan"
id: "plan"
category: "Workflow"
description: "Apply the person's confirmation or edits to the plan"
---

The person runs this to confirm the plan or to edit it. Do not start work from an edit alone.

An edit without an approval replaces the matching parts of the plan. Show the updated plan and wait. Do not create a branch and do not change files.

Approval is "go", "approved", "ok", "do it", or "ship it", and direct synonyms. If the same message also edits the plan, apply those edits first, then treat it as approval.

On approval, set `board:in-progress` and Status `In progress` on the user project `harness for gem-puzzle` (owner `rdog49`). Do not use any other project. Do not set `In review` or `Done`. Do not open a pull request.

`gh` needs the `project` scope. If a project command reports a missing scope, run `gh auth refresh -s project` and retry.

```bash
gh project list --owner rdog49 --limit 30
```

`PROJECT` is the number whose title is `harness for gem-puzzle`. `ISSUE_URL` is `https://github.com/rdog49/gem-puzzle-harness/issues/NUMBER`.

```bash
gh issue edit NUMBER --remove-label board:backlog --add-label board:in-progress
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "In progress"
```

If the Status value is rejected, list the options and use the in-progress column's name:

```bash
gh project field-list PROJECT --owner rdog49
```

Then the coder executes the approved plan in this chat. That execution has no command of its own. The coder does not commit.
