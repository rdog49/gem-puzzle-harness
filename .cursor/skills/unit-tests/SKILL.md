---
name: unit-tests
description: Writes short Gem Puzzle unit tests with Node's built-in test runner. Use when adding or changing a behavior, or a file under tests/.
---

# Tests

A unit test checks one behavior. It does not open a browser, a page, or a dev server.

The suite stays small. `npm test` runs `node --test`. Do not add Playwright, another runner, a browser, or a snapshot.

## Where

- Tests: `tests/*.test.js`
- Command: `npm test`
- Runner: `node:test` and `node:assert/strict`

## How to write one

The package has no `"type": "module"`, so a test file is CommonJS. Import the runner with `require`.

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('one behavior', () => {
  assert.equal(1 + 1, 2);
});
```

Call the behavior under test. Assert with `assert.equal`, `assert.deepEqual`, or `assert.throws`.

A task that adds behavior adds or updates one short test for that behavior. Do not walk the whole game in one file. Do not start a browser. Do not import a module that needs `document` or `window`.

## CI

CI runs `npm test`. A red test fails the task. Do not skip or delete a test to turn the check green.
