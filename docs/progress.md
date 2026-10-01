# Project progress

This file is the record of finished Gem Puzzle board tasks. The evaluator appends one section when a pull request has been merged, the card is `board:done`, the project Status is `Done`, and the issue is closed. Older sections stay. Do not rewrite them.

Product behavior stays in `TASK.md`. This file says what each finished task added and how it was built.

## GP-01 — Page shell and build

- Issue: #7
- Pull request: #28
- Merged: 2026-09-30
- What: The page shows the title Gem Puzzle and nothing else. The development server listens on port 8080. The production build writes `dist` with a relative script path. `npm run lint` covers `src`.
- How: `src/index.html` is an empty body. `src/index.js` calls `mountApp` from `src/modules/app.js`, which creates the title in the DOM and loads `src/styles/main.css`. Webpack uses `html-webpack-plugin`, `css-loader`, and `style-loader`. ESLint uses `eslint-config-airbnb-base`. The page does not use jQuery, React, Vue, Angular, or Axios.
