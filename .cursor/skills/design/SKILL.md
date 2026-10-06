---
name: design
description: Visual design of the Gem Puzzle screen — palette, type, and layout. Use when building or checking color, type, tiles, the board, or breakpoints.
---

# Screen design

`TASK.md` says what the screen is for. This skill is how it looks. Lint and the build do not accept the screen. It has to match this design.

## Palette

- Page background `#14110e`, text `#f6f1e7`
- Accent `#e07a3d` for the title and the buttons
- Tile face `#f3e6cf`, tile text `#2a2118`
- Board surface `#1c1814`, board edge `#3a322b`
- The empty cell is transparent

## Type

- Title: Georgia, "Times New Roman", serif. Large, centered, regular weight, accent color. The words are `Gem Puzzle`.
- Controls and tiles: "Segoe UI", Roboto, Helvetica, Arial, sans-serif

## Layout

- The board is the main object. It is square. The default grid is 4 by 4, with a small gap and light tiles.
- At 1280px and wider the board and the actions sit on one row. There is no horizontal scroll.
- Around 768px both stay on screen and nothing is clipped.
- At 375px the board fits the width. Actions stay hidden until the Menu button opens them.
- A win message is obvious and sits over the board.
- A move is a visible slide, not an instant jump.

Do not invent a second palette or a light theme.
