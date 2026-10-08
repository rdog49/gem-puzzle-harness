---
name: "/pull-request"
id: "pull-request"
category: "Workflow"
description: "The evaluator opens one pull request after the task's single commit"
---

The person runs this to ask for the pull request. The evaluator opens it once, after `/commit` has left the task branch exactly one commit ahead of `main`.

The coder does not run this command.

Set `board:in-review` and Status `In review` on the user project `harness for gem-puzzle` (owner `rdog49`). Do not use any other project. Do not set `Done`. Do not close the issue.

`gh` needs the `project` scope. If a project command reports a missing scope, run `gh auth refresh -s project` and retry.

```bash
gh project list --owner rdog49 --limit 30
```

`PROJECT` is the number whose title is `harness for gem-puzzle`. `ISSUE_URL` is `https://github.com/rdog49/gem-puzzle-harness/issues/NUMBER`.

```bash
gh issue edit NUMBER --remove-label board:in-progress --add-label board:in-review
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "In review"
git push -u origin HEAD
gh pr create --base main --title "GP-XX short result" --body "Summary of this task.

Closes #NUMBER"
```

If the Status value is rejected, list the options and use the in-review column's name:

```bash
gh project field-list PROJECT --owner rdog49
```

The pull request body contains `Closes #NUMBER` for this issue, so the project workflows can link it. Do not close the issue from this command.

Do not commit again after the pull request exists. Do not make a second commit for the pull request number. Tell the person the pull request URL. They review it and merge it. Do not merge. After that merge, the project workflows close the issue and set Status `Done`.
