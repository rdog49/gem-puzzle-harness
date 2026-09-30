# Project Specification: Gem Puzzle

## Overview
Implement a classic browser-based [15-puzzle game](https://en.wikipedia.org/wiki/15_puzzle).

## Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5 / CSS3 (CSS frameworks or preprocessors are allowed)
- Webpack
- ESLint (Airbnb base config)
- Git

## Technical Requirements
- The application must work correctly in the latest version of Google Chrome.
- **Forbidden:** jQuery, React, Vue, Angular, or external API wrapper libraries like Axios.
- **Allowed:** Bootstrap, CSS frameworks, preprocessors, TypeScript, and Canvas (though not strictly required).
- Network requests must use native `fetch`, Promises, and `async/await`.

## Project Organization & Git Workflow
- Work in a separate branch (`feat/some-feature-name`) and dedicated folder. Do not break the main branch or initial repository structure.
- Commit history must reflect the actual development process (commit message format: `feat: description`).
- The working demo must be deployable to GitHub Pages.

## Functional Requirements
### Level 1: Basic

    Responsive UI: Adapts to desktop, tablet, and mobile screens without overflow or layout breaks. Mobile versions can use a burger menu.

    DOM Structure: The initial index.html must have an empty ``. All markup must be generated dynamically via JavaScript.

    Grid Size: Default grid size is 4x4.

    Solvable State: The board must be shuffled randomly upon starting a new game, but the initial state must be mathematically solvable (Tip: generate valid states by making random legal moves backward from the solved state).

    Movement: Clicking a tile adjacent to the empty cell moves it into the empty space.

    Drag & Drop: Tiles can be dragged onto the empty cell using the mouse.

    Restart: The game can be restarted without reloading the page via a button, menu item, or hotkey.

    Stats Display: Show the elapsed time in mm:ss format and the total move count.

    State Persistence: Game state must be saved in localStorage (key: gem_puzzle_state) so the game can be resumed after a page reload.

### Level 2: Advanced

    Grid Selection: Allow users to choose grid sizes from 3x3 up to 8x8.

    Animations: Smooth sliding animations when tiles move.

    Win Notification: Display a congratulatory message upon winning: "Hooray! You solved the puzzle in #:## and N moves".

    Sound Effects: Toggleable sound effects for tile movements (audio assets of author's choice).

    Leaderboard: Save top 10 best scores in localStorage, accessible via an interface button.

### Level 3: Complex (Images & AI)

    Image Tiles: Display image fragments on tiles instead of numbers.

    Dynamic Fetching: Images must not be bundled statically. Fetch a list of available images from a public API without keys (e.g., Lorem Picsum /v2/list) and load the selected image dynamically.

    Network Resilience & Async: Use fetch and async/await. Do not rely solely on image onload callbacks for splitting. Show a loading state (loader/skeleton/text) during fetches. If a request fails, show an error message with a retry button (with a fallback to number mode).

    Request Cancellation: Users can switch to another random image without reloading. Cancel pending network requests using AbortController.

    Parallel Preloading: Preview thumbnails (at least 3) must be loaded in parallel using Promise.all. Clicking a thumbnail applies it to the board.

    Auto-Solve Feature: An "Auto-Solve" button that automatically solves the puzzle with a visible, animated sequence of moves.

    Tooling Integration: ESLint (using eslint-config-airbnb-base) and Webpack must be fully integrated and running without errors.

    Modular Code: Code must be split into clean ES6+ JavaScript modules.

## Acceptance Criteria Checklist
### Basic Level

    [ ] Layout, design, and UI are fully responsive

    [ ] Board state is generated randomly and guaranteed to be solvable

    [ ] Clicking a tile adjacent to the empty cell moves it successfully

    [ ] Game can be restarted without reloading the page

    [ ] Game timer (mm:ss) and move counter are displayed correctly

    [ ] Tiles support mouse drag-and-drop

    [ ] Game state is saved and restored properly via localStorage

### Advanced Level

    [ ] User can select grid dimensions from 3x3 to 8x8

    [ ] Move sound effects implemented with a mute/unmute toggle

    [ ] Top 10 scores persist in localStorage and can be viewed via UI

    [ ] Tile movement animations are operational

    [ ] Win modal displays completion time and move count

### Complex Level

    [ ] Images replace numbers, fetched dynamically via fetch from a public API

    [ ] Loading indicators and error handling with retry mechanisms are present

    [ ] Thumbnails loaded asynchronously with Promise.all; request cancellation via AbortController implemented

    [ ] Animated auto-solve functionality works correctly

    [ ] ESLint integrated and passing

    [ ] Webpack build configured and functional

    [ ] Code is modular (ES6+ architecture)

### Code Quality

    [ ] Zero execution/runtime errors in the console (excluding 404 for favicon.ico)

    [ ] Zero ESLint errors