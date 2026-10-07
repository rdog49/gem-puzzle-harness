---
name: keep-changelog
description: Records one finished Gem Puzzle task in CHANGELOG.md using Keep a Changelog 1.1.0. Use when a board task passes, when writing or editing CHANGELOG.md, or when a role must leave that file untouched.
---

# Keep a changelog

`CHANGELOG.md` at the repository root follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Newest versions stay first. A release date is `YYYY-MM-DD`. Leave the file header as it is.

Product behavior stays in `TASK.md`. This file records the notable change for a person.

## Who writes

Only the evaluator writes this file, and only after every criterion of this task passes. The write happens on the task branch, before the pull request.

The coder does not write it. The initializer does not write it. A chat that only closes a merged card does not write it.

## When to leave it untouched

- Do not write it on `main`.
- Do not check out `main` to record the task.
- Do not edit it after the pull request exists. A pull request number would be a second commit.
- Do not edit it after the person merges. The entry is already in the task commit.
- Do not commit this file by itself.
- Do not push a follow-up that only updates this file.
- If the same bullet is already under `Unreleased`, do not add a second copy.
- Keep every earlier entry.

The commit steps live in the `/commit` command. This file rides in that one task commit.

## Entry

Put this task under `## [Unreleased]`. Add only the heading that fits:

- `### Added` — new behavior
- `### Changed` — existing behavior changed
- `### Deprecated` — behavior that will be removed
- `### Removed` — behavior that is gone
- `### Fixed` — a bug fix
- `### Security` — a vulnerability

One task is one bullet: what the player or the build gained, from the issue and the approved plan. No behavior from a later task. The issue number may end the bullet as `(#NUMBER)`. Do not put a pull request number in the bullet.

Do not paste a git log, a file list, or the method that landed. Do not open a `## [x.y.z] - YYYY-MM-DD` heading for one task. That heading is for a release. This skill does not cut a release.

```markdown
### Added

- What the player or the build gained. (#NUMBER)
```
