---
name: verify-task
description: Checks one Gem Puzzle task with the build, the linter, and a browser pass, then moves the card and opens the pull request. Use when evaluating a finished board task.
---

# Check one task

The scope is the open issue's criteria and the approved plan. Do not require behavior from later tasks, and do not fail this task for lacking it.

## Always

- `npm run format:check` exits 0.
- `npm run lint` exits 0 when the task has sources under `src`.
- `npm run build` exits 0 when the task touches the build or game logic.
- `npm test` exits 0. Unit tests follow the `unit-tests` skill. The screen matches `docs/design.md`.
- The same checks run in CI. The pipeline is the CI/CD section of `AGENTS.md`. A red check fails the task.
- The result matches the stack in `AGENTS.md`: forbidden libraries, `fetch`, and the console.

## Screen

When the task is visible to the player, open `http://localhost:8080` and walk the criteria with clicks, drags, and the keyboard. A screenshot does not replace that pass.

Use the widths named in the task: at least 1280px, about 768px, and 375px.

For resume, check the `gem_puzzle_state` key. For scores, check `gem_puzzle_scores` and a list of at most 10 rows. For pictures, watch the network: the Picsum list, cancellation through `AbortController`, and at least three previews loaded together with `Promise.all`.

## Verdict

For each criterion of this task, write "pass" or "fail" and what you saw. On a failure, return the coder a fix list inside this task and leave the label `board:in-progress` and the project Status `In progress`. Do not move that card to `In review` or `Done`.

Do not edit `TASK.md`. Do not edit other issues.

## Board and pull request

The person asks for each move. This role does not set `Todo`. `/choose-task` already did that.

When the approved task starts, `/plan` sets `In progress`. On a failure, leave the card there. Do not move it to `In review` or `Done`.

When every criterion passes, stay on the task branch. Follow the `keep-changelog` skill. The commit waits until the person runs `/commit`. The pull request waits until the person runs `/pull-request`. Do not set `Done` yet. Do not close the issue, and do not merge. Leave `CHANGELOG.md` as the `keep-changelog` skill requires.

## Then the spec

This skill is the technical check. It runs first.

When every check here passes and the task is an OpenSpec change, the next skill is `openspec-verify-change`. It checks that change against its spec, tasks, and design. Do not start it while a check here is red.

A game card with no spec stops after this skill.

## After the person merges

The person marks the task with `/done`. If the pull request is still open, stop. Do not merge it. Leave `CHANGELOG.md` untouched. The steps are in `docs/workflow.md`.
