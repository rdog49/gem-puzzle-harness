---
name: frontend-stack
description: Задаёт стек Gem Puzzle — Webpack, ESLint airbnb-base, ES-модули, пустой body и нативный fetch. Use when adding or changing the build, linter, src entry, modules, or network calls.
---

# Стек

Игра работает в актуальном Google Chrome.

## Язык и границы

- JavaScript ES6+, HTML5, CSS3. Свои файлы — ES-модули с `import` / `export`.
- Разрешены Bootstrap, другие CSS-фреймворки, препроцессоры, TypeScript и Canvas. Они не обязательны.
- Запрещены jQuery, React, Vue, Angular и Axios. Не добавляй обёртки над HTTP.
- Сеть только через `fetch`, Promises и `async/await`.

## Страница

- `src/index.html`: пустой `<body>`. В шаблоне нет разметки игры.
- Вся разметка создаётся из JavaScript.
- Точка входа `src/index.js` монтирует приложение в `document.body`.
- Логика живёт в `src/modules/`. Стили — в `src/styles/main.css`.

## Webpack

- Зависимости разработки: `webpack`, `webpack-cli`, `webpack-dev-server`, `html-webpack-plugin`, `css-loader`, `style-loader`.
- Скрипты: `start` — `webpack serve --mode development`, порт 8080; `build` — `webpack --mode production`; `lint` — `eslint src`.
- В production `publicPath` равен `./`, чтобы страницу можно было открыть как статику, в том числе на GitHub Pages.
- `npm run build` завершается с кодом 0 и кладёт в `dist/` `index.html` и JS-бандл. Ссылки на скрипт и стили относительные. Отдельный сервер приложению не нужен.
- `dist/` и `node_modules/` не коммитятся.

## ESLint

- ESLint 8, конфиг `eslint-config-airbnb-base`, плагин `eslint-plugin-import`.
- `npm run lint` по `src` завершается с кодом 0 и без ошибок.
- Импорт CSS линтером не считается ошибкой неразрешённого модуля.

## Консоль

При открытии страницы и при сценарии текущей задачи в консоли нет ошибок выполнения. Единственный допустимый шум — 404 на `favicon.ico`.
