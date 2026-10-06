---
name: frontend-stack
description: Sets the Gem Puzzle stack — Webpack, ESLint airbnb-base, ES modules, a mount point, and native fetch. Use when adding or changing the build, linter, src entry, modules, or network calls.
---

# Stack

The game runs in the latest Google Chrome.

## Language and boundaries

- JavaScript ES6+, HTML5, and CSS3. Project files are ES modules with `import` / `export`.
- Bootstrap, other CSS frameworks, preprocessors, TypeScript, and Canvas are allowed. They are not required.
- jQuery, React, Vue, Angular, and Axios are forbidden. Do not add an HTTP wrapper.
- Network access uses only `fetch`, Promises, and `async/await`.

## Page

- `src/index.html` has one empty mount container in `<body>`: `<div id="app"></div>`. The template contains no game markup.
- JavaScript creates all markup inside that container.
- The entry `src/index.js` mounts the application on `document.getElementById('app')`.
- Logic lives in `src/modules/`. Styles live in `src/styles/main.css`.

## Webpack

- Dev dependencies: `webpack`, `webpack-cli`, `webpack-dev-server`, `html-webpack-plugin`, `css-loader`, `style-loader`.
- Scripts: `start` runs `webpack serve --mode development` on port 8080; `build` runs `webpack --mode production`; `lint` runs `eslint src`.
- In production `publicPath` is `./`, so the page can be opened as static files, including on GitHub Pages.
- `npm run build` exits 0 and writes `index.html` and the JS bundle into `dist/`. Script and style links are relative. The app needs no separate server.
- Do not commit `dist/` or `node_modules/`.

## ESLint

- ESLint 8, config `eslint-config-airbnb-base`, plugin `eslint-plugin-import`.
- `npm run lint` on `src` exits 0 with no errors.
- A CSS import is not an unresolved-module error.

## Console

Opening the page and playing the current task's scenario produces no runtime console errors. The only allowed noise is a 404 for `favicon.ico`.
