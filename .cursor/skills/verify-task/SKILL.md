---
name: verify-task
description: Checks one Gem Puzzle task with the build, the linter, and a browser pass, then moves the card and opens the pull request. Use when evaluating a finished board task.
---

# Check one task

The scope is the open issue's criteria and the approved plan. Do not require behavior from later tasks, and do not fail this task for lacking it.

## Always

- `npm run lint` exits 0 when the task has sources under `src`.
- `npm run build` exits 0 when the task touches the build or game logic.
- `package.json` and `src` do not depend on jQuery, React, Vue, Angular, or Axios.
- Network code uses `fetch` and `async/await`.
- The scenario console has no runtime errors. A 404 for `favicon.ico` is allowed.

## Screen

When the task is visible to the player, open `http://localhost:8080` and walk the criteria with clicks, drags, and the keyboard. A screenshot does not replace that pass.

Use the widths named in the task: at least 1280px, about 768px, and 375px.

For resume, check the `gem_puzzle_state` key. For scores, check `gem_puzzle_scores` and a list of at most 10 rows. For pictures, watch the network: the Picsum list, cancellation through `AbortController`, and at least three previews loaded together with `Promise.all`.

## Verdict

For each criterion of this task, write "pass" or "fail" and what you saw. On a failure, return the coder a fix list inside this task and leave the label `board:in-progress` and the project Status `In progress`. Do not move that card to `In review` or `Done`.

Do not edit `TASK.md`. Do not edit other issues.

## Board and pull request

This role moves the issue label and the Status field on the user project `harness for gem-puzzle` (owner `rdog49`). Do not use any other project. The initializer already sets Status `Todo` when the task is taken. This role does not set `Todo`. It sets `Done` only in "After the person merges".

`gh` needs the `project` scope. If a project command reports a missing scope, run `gh auth refresh -s project` and retry the same move.

```bash
gh project list --owner rdog49 --limit 30
```

`PROJECT` is the number whose title is `harness for gem-puzzle`. `ISSUE_URL` is `https://github.com/rdog49/gem-puzzle-harness/issues/NUMBER`.

Issue label, same moment as the project Status:

```bash
gh issue edit NUMBER --remove-label board:backlog --add-label board:in-progress
gh issue edit NUMBER --remove-label board:in-progress --add-label board:in-review
```

Add the issue when it is not already on the project. If add reports that the item already exists, continue and set Status.

```bash
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "In progress"
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "In review"
```

When the approved task starts, set `board:in-progress` and Status `In progress` (work is under way). When every criterion passes, set `board:in-review` and Status `In review` (the pull request is waiting for the person). On a failure, leave both on in progress.

If a Status value is rejected, list the options and use the name of that column:

```bash
gh project field-list PROJECT --owner rdog49
```

Stay on the task branch. Follow the `keep-changelog` skill for `CHANGELOG.md`, then commit.

The coder left the task uncommitted. One commit contains every change for this task, including `CHANGELOG.md`. Do not use a `docs:` message.

```bash
git add CHANGELOG.md
git add path/to/each/task/file
git commit -m "feat: GP-XX short result"
git log --oneline main..HEAD
```

`git log --oneline main..HEAD` shows exactly one commit. If it shows more, stop and do not push. Do not add another commit to repair it.

Then push that commit and open the pull request against `main`:

```bash
git push -u origin HEAD
gh pr create --base main --title "GP-XX short result" --body "Summary of this task."
```

The pull request body must not contain `Closes`, `Fixes`, or `Resolves`. Merging must leave the issue open so this role can close it after the board move.

Do not commit again after the pull request exists. Tell the person the pull request URL. Their remaining step is to review it and merge it.

Do not set `board:done` or project Status `Done` yet. Do not close the issue, and do not merge. Leave `CHANGELOG.md` as the `keep-changelog` skill requires.

## After the person merges

Run this only when the pull request `state` is `MERGED`. If it is still open, stop. Do not merge it yourself.

```bash
gh pr view PR --json state,mergedAt,title,url
```

When it is merged, move the card and close the issue:

```bash
gh issue edit NUMBER --remove-label board:in-review --add-label board:done
gh project item-add PROJECT --owner rdog49 --url ISSUE_URL
gh project item-edit PROJECT --owner rdog49 --url ISSUE_URL --field Status --value "Done"
gh issue close NUMBER --reason completed
```

If the issue still has `board:in-progress` or `board:backlog`, remove that label in the same `gh issue edit`. If a Status value is rejected, list the field options and use the done column's name.

Skip this move when the issue is already `board:done` and closed.

Leave `CHANGELOG.md` untouched. The `keep-changelog` skill already finished that entry.

A new chat runs this board close for any earlier task that is merged and still open or still `board:in-review`, before it checks out `main` for the new task. It does not write `CHANGELOG.md`.
