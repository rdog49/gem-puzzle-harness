---
name: playwright-tests
description: Writes short Gem Puzzle unit tests and snapshots with Playwright. Use when adding or changing a screen, a control, a rule, or a file under tests/.
---

# Tests

Short tests are unit tests and snapshots. Follow [Playwright: writing tests](https://playwright.dev/docs/writing-tests). A unit test checks one behavior. A snapshot checks how that screen looks.

The suite stays small. `@playwright/test` runs on Chromium, the one browser Playwright needs in order to start. Do not add a browser matrix, another browser, or a long end-to-end tour. `tests/shell.spec.js` stays a short check of the title and the mount point.

## Where

- Config: `playwright.config.js`
- Tests: `tests/*.spec.js`
- Command: `npm test`
- Base URL: `http://localhost:8080`. The config starts `npm run start`.

## How to write one

Each test gets its own `page`. Start with `await page.goto('/')`.

Find a control with `getByRole`. Find text with `getByText`. The mount point `#app` is the one CSS locator.

Assert with an async matcher: `await expect(locator).toBeVisible()`, `toHaveTitle`, `toHaveText`, `toHaveCount`. A visual check is one snapshot, `await expect(locator).toHaveScreenshot()`. Do not call `page.waitForTimeout`.

A task the player can see adds or updates one short test, or one snapshot, for the behavior it introduces. Do not walk the whole game in one spec.

## CI

CI installs Chromium and runs `npm test`. A red test fails the task. Do not skip or delete a test to turn the check green.
