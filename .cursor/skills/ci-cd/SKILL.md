---
name: ci-cd
description: Runs the Gem Puzzle pipeline — lint and build on every pull request, and deploys the production build to GitHub Pages from main. Use when changing the build, the linter, GitHub Actions, or a Pages release.
---

# CI/CD

Two workflows live under `.github/workflows/`. Do not add another workflow that repeats these jobs.

## CI

`.github/workflows/ci.yml` runs on every pull request and on a push to `main`.

- Node 20
- `npm ci`
- `npm run lint`
- `npm run build`

A red check fails the task. The evaluator's local lint and build are these same commands. Do not weaken the workflow to turn a red check green.

## CD

`.github/workflows/pages.yml` runs on a push to `main` and on a manual run. It builds `dist/` and deploys that folder to GitHub Pages.

Do not deploy from a task branch. Do not commit `dist/`.
