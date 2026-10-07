---
name: "/done"
id: "done"
category: "Workflow"
description: "Mark one task done after the person has merged its pull request"
---

The person runs this to mark the task done. Run it only when the pull request `state` is `MERGED`. If it is still open, stop. Do not merge it. Do not write `CHANGELOG.md`.

```bash
gh pr view PR --json state,mergedAt,title,url
```

When it is merged, set `board:done` and Status `Done` on the user project `harness for gem-puzzle` (owner `rdog49`), then close the issue. Do not use any other project. Do not move a card back to No Status.

`gh` needs the `project` scope. If a project command reports a missing scope, run `gh auth refresh -s project` and retry.

```bash
gh project list --owner rdog49 --limit 30
```

`PROJECT` is the number whose title is `harness for gem-puzzle`. `ISSUE_URL` is `https://github.com/rdog49/gem-puzzle-harness/issues/NUMBER`.

```bash
gh issue edit NUMBER --remove-label board:in-review --add-label board:done
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "Done"
gh issue close NUMBER --reason completed
```

If the issue still has `board:in-progress` or `board:backlog`, remove that label in the same `gh issue edit`. If a Status value is rejected, list the options and use the done column's name:

```bash
gh project field-list PROJECT --owner rdog49
```

Skip this when the issue is already `board:done` and closed.
