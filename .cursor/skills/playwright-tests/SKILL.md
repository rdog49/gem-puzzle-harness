---
name: playwright-tests
description: Writes Gem Puzzle UI tests with Playwright. Use when adding or changing a screen, a control, or a file under tests/.
---

# UI tests

Follow [Playwright: writing tests](https://playwright.dev/docs/writing-tests). These tests accept the screen a person sees. They are not unit tests of the puzzle rules.

## Where

- Config: `playwright.config.js`
- Tests: `tests/*.spec.js`
- Command: `npm test`
- Base URL: `http://localhost:8080`. The config starts `npm run start`.

## How to write one

Each test gets its own `page`. Start with `await page.goto('/')`.

Find a control with `getByRole`. Find text with `getByText`. The mount point `#app` is the one CSS locator.

Assert with an async matcher: `await expect(locator).toBeVisible()`, `toHaveTitle`, `toHaveText`, `toHaveCount`. Do not call `page.waitForTimeout`.

A task the player can see adds or updates a test for the behavior it introduces. Use the widths from the task, 1280, 768, and 375, through `page.setViewportSize`. The screen also has to match `docs/design.md`.

## CI

CI installs Chromium and runs `npm test`. A red test fails the task. Do not skip or delete a test to turn the check green.
