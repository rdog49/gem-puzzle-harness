---
name: "/commit"
id: "commit"
category: "Workflow"
description: "One evaluator commit for a task that already passed, including CHANGELOG.md"
---

The person runs this to ask for the commit. The evaluator makes it once, on the task branch, after every criterion of this task passes and after `keep-changelog` has written `CHANGELOG.md`. If the check has not passed, stop.

The coder does not run this command. Do not commit on `main`. Do not push from this command. Do not move the card from this command.

The coder left the task uncommitted. One commit contains every change for this task, including `CHANGELOG.md`. Do not use a `docs:` message. Do not commit this file by itself.

```bash
git add CHANGELOG.md
git add path/to/each/task/file
git commit -m "feat: GP-XX short result"
git log --oneline main..HEAD
```

`git log --oneline main..HEAD` shows exactly one commit. If it shows more, stop and do not push. Do not add another commit to repair it.

Do not commit again after the pull request exists. A pull request number would be a second commit. Leave `CHANGELOG.md` as the `keep-changelog` skill requires.
