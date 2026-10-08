# Gem Puzzle

This file is the map for every agent. The stack is below. The table says what to open. How a role behaves is its own file.

## Roles

| Role | File |
| --- | --- |
| Initializer | `.cursor/agents/initializer.md` |
| Coder | `.cursor/agents/coder.md` |
| Evaluator | `.cursor/agents/evaluator.md` |

## Stack

The game runs in the latest Google Chrome.

### Language and boundaries

- JavaScript ES6+, HTML5, and CSS3. Project files are ES modules with `import` / `export`.
- Each module exports a class. Fields hold that module's state. Methods perform its behavior. `src/index.js` constructs those objects and mounts the root one. Do not write a module as free functions that share closed-over variables.
- Bootstrap, other CSS frameworks, preprocessors, TypeScript, and Canvas are allowed. They are not required.
- jQuery, React, Vue, Angular, and Axios are forbidden. Do not add an HTTP wrapper.
- Network access uses only `fetch`, Promises, and `async/await`.

### Page

- `src/index.html` has one empty mount container in `<body>`: `<div id="app"></div>`. The template contains no game markup.
- JavaScript creates all markup inside that container.
- The entry `src/index.js` mounts the application on `document.getElementById('app')`.
- Logic lives in `src/modules/`. Each module owns the stylesheet next to its script and imports that file. Example: `src/modules/board/board.js` imports `./board.css`.
- Rules shared by every screen (reset, page background, type) live in `src/styles/base.css`. The entry imports that file once.
- Do not gather every rule into one `src/styles/main.css` or `style.css`.

### Webpack

- Dev dependencies: `webpack`, `webpack-cli`, `webpack-dev-server`, `html-webpack-plugin`, `css-loader`, `style-loader`, `prettier`, `eslint-config-prettier`.
- Scripts: `start` runs `webpack serve --mode development` on port 8080; `build` runs `webpack --mode production`; `lint` runs `eslint src`; `format:check` runs Prettier; `test` runs Node's built-in test runner.
- Pull requests, `main`, and GitHub Pages follow the CI/CD section below.
- In production `publicPath` is `./`, so the page can be opened as static files, including on GitHub Pages.
- `npm run build` exits 0 and writes `index.html` and the JS bundle into `dist/`. Script and style links are relative. The app needs no separate server.
- Do not commit `dist/` or `node_modules/`.

### CI/CD

Two workflows live under `.github/workflows/`. Do not add another workflow that repeats these jobs.

#### CI

`.github/workflows/ci.yml` runs on every pull request and on a push to `main`.

- Node 20
- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npm run build`
- `npm test`

A red check fails the task. The evaluator's local lint and build are these same commands. Do not weaken the workflow to turn a red check green.

#### CD

`.github/workflows/pages.yml` runs on a push to `main` and on a manual run. It builds `dist/` and deploys that folder to GitHub Pages.

Do not deploy from a task branch.

### ESLint

- ESLint 8, config `eslint-config-airbnb-base`, then `eslint-config-prettier`, plugin `eslint-plugin-import`.
- `npm run lint` on `src` exits 0 with no errors.
- A CSS import is not an unresolved-module error.

### Prettier

- `.prettierrc.json` uses single quotes and ES5 trailing commas.
- `npm run format:check` exits 0.
- Prettier owns formatting. ESLint does not.

### Screen and tests

- The look of the screen is `docs/design.md`.
- Tests are the `unit-tests` skill.

### Console

Opening the page and playing the current task's scenario produces no runtime console errors. The only allowed noise is a 404 for `favicon.ico`.

## When to read what

| Situation | Open |
| --- | --- |
| Stack, modules, build, libraries, CI, Pages | Stack, in this file |
| Palette, type, and layout | `docs/design.md` |
| Board, moves, shuffle, sliding, auto-solve | `docs/puzzle-rules.md` |
| Shell, time, moves, resume, sound, scores, labels | `docs/play-session.md` |
| Picture, loading, error, request cancellation, previews | `docs/picture-tiles.md` |
| Board steps, git, and specs | `docs/workflow.md` |
| A behavior, or a file under `tests/` | `unit-tests` |
| A check is red, or behavior is unexpected | `systematic-debugging` |
| Review comments arrive | `receiving-code-review` |
| Explore, propose, revise, apply, verify, sync, or archive a spec | `openspec-explore`, `openspec-propose`, `openspec-update-change`, `openspec-apply-change`, `openspec-verify-change`, `openspec-sync-specs`, `openspec-archive-change` |
| See which tasks are open | `/tasks` |
| Choose one task | `/choose-task` |
| Confirm the plan, or edit it | `/plan` |
| Commit this task | `/commit` |
| Open its pull request | `/pull-request` |
| Mark the task done | `/done` |
