const DEFAULT_SIZE = 4;

function solvedTiles(size) {
  const cellCount = size * size;

  return Array.from({ length: cellCount }, (_, index) => (
    index + 1 === cellCount ? 0 : index + 1
  ));
}

function sameOrder(left, right) {
  return left.every((value, index) => value === right[index]);
}

export function isSolved(tiles, size) {
  return sameOrder(tiles, solvedTiles(size));
}

function neighborIndexes(index, size) {
  const row = Math.floor(index / size);
  const column = index % size;
  const indexes = [];

  if (row > 0) {
    indexes.push(index - size);
  }
  if (row < size - 1) {
    indexes.push(index + size);
  }
  if (column > 0) {
    indexes.push(index - 1);
  }
  if (column < size - 1) {
    indexes.push(index + 1);
  }

  return indexes;
}

function slideBlank(tiles, size) {
  const blankIndex = tiles.indexOf(0);
  const options = neighborIndexes(blankIndex, size);
  const choice = options[Math.floor(Math.random() * options.length)];
  const next = tiles.slice();

  next[blankIndex] = next[choice];
  next[choice] = 0;
  return next;
}

function inversionCount(tiles, size) {
  const blankRank = size * size;
  const ranked = tiles.map((value) => (value === 0 ? blankRank : value));
  let inversions = 0;

  for (let leftIndex = 0; leftIndex < ranked.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < ranked.length; rightIndex += 1) {
      if (ranked[leftIndex] > ranked[rightIndex]) {
        inversions += 1;
      }
    }
  }

  return inversions;
}

function taxicab(tiles, size) {
  const blankIndex = tiles.indexOf(0);
  const row = Math.floor(blankIndex / size);
  const column = blankIndex % size;
  const corner = size - 1;

  return Math.abs(row - corner) + Math.abs(column - corner);
}

function isSolvable(tiles, size) {
  return (inversionCount(tiles, size) + taxicab(tiles, size)) % 2 === 0;
}

function shuffledTiles(size) {
  const solved = solvedTiles(size);
  const steps = size * size * 12;
  let tiles = solved.slice();

  for (let step = 0; step < steps; step += 1) {
    tiles = slideBlank(tiles, size);
  }

  if (sameOrder(tiles, solved)) {
    tiles = slideBlank(tiles, size);
  }

  if (!isSolvable(tiles, size)) {
    throw new Error('Shuffled board is not solvable');
  }

  return tiles;
}

function moveTile(tiles, index, size) {
  const blankIndex = tiles.indexOf(0);

  if (!neighborIndexes(blankIndex, size).includes(index)) {
    return null;
  }

  const next = tiles.slice();
  next[blankIndex] = next[index];
  next[index] = 0;
  return next;
}

const SLIDE_MS = 200;

let suppressClick = false;
let sliding = false;
let slideGeneration = 0;
let boardLocked = false;
let afterMove = null;
let playMove = () => false;

export function lockBoard(locked) {
  boardLocked = locked;
}

export function playBoardMove(index, done) {
  afterMove = done;
  const started = playMove(index);

  if (!started) {
    afterMove = null;
  }

  return started;
}

function slideIntoBlank(tileElement, blankElement, generation, done) {
  const tile = tileElement;
  const blank = blankElement;
  const tileRect = tile.getBoundingClientRect();
  const blankRect = blank.getBoundingClientRect();
  const deltaX = blankRect.left - tileRect.left;
  const deltaY = blankRect.top - tileRect.top;
  const slide = {
    settled: false,
    onEnd(event) {
      if (event.propertyName !== 'transform') {
        return;
      }

      slide.finish();
    },
    finish() {
      if (slide.settled) {
        return;
      }

      slide.settled = true;
      tile.removeEventListener('transitionend', slide.onEnd);

      if (generation === slideGeneration) {
        done();
      }
    },
  };

  tile.classList.add('tile--sliding');
  tile.getBoundingClientRect();
  tile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  tile.addEventListener('transitionend', slide.onEnd);
  window.setTimeout(slide.finish, SLIDE_MS + 50);
}

function paintPicture(cell, value, size, pictureUrl) {
  const tile = cell;
  const solvedIndex = value - 1;
  const column = solvedIndex % size;
  const row = Math.floor(solvedIndex / size);
  const span = size - 1;

  tile.classList.add('tile--picture');
  tile.style.backgroundImage = `url("${pictureUrl}")`;
  tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
  tile.style.backgroundPosition = `${(column / span) * 100}% ${(row / span) * 100}%`;
  tile.textContent = '';
  tile.setAttribute('aria-label', String(value));
}

function paintTiles(board, tiles, size, onMove, pictureUrl) {
  slideGeneration += 1;
  sliding = false;
  afterMove = null;
  board.classList.remove('board--sliding');
  board.replaceChildren();

  let draggedIndex = null;

  function runMove(index) {
    if (sliding) {
      return false;
    }

    const next = moveTile(tiles, index, size);

    if (!next) {
      return false;
    }

    const blankIndex = tiles.indexOf(0);
    const generation = slideGeneration;

    sliding = true;
    board.classList.add('board--sliding');
    slideIntoBlank(board.children[index], board.children[blankIndex], generation, () => {
      const follow = afterMove;
      afterMove = null;
      paintTiles(board, next, size, onMove, pictureUrl);
      onMove(next);

      if (follow) {
        follow();
      }
    });
    return true;
  }

  playMove = runMove;

  function commitMove(index) {
    if (boardLocked) {
      return;
    }

    runMove(index);
  }

  tiles.forEach((value, index) => {
    const isEmpty = value === 0;
    const cell = document.createElement(isEmpty ? 'div' : 'button');

    cell.className = isEmpty ? 'tile tile--empty' : 'tile';
    if (!isEmpty) {
      cell.type = 'button';
      cell.draggable = true;
      if (pictureUrl) {
        paintPicture(cell, value, size, pictureUrl);
      } else {
        cell.textContent = String(value);
      }
      cell.addEventListener('dragstart', (event) => {
        draggedIndex = index;
        suppressClick = true;
        event.dataTransfer.setData('text/plain', String(index));
      });
      cell.addEventListener('dragend', () => {
        draggedIndex = null;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      });
      cell.addEventListener('click', () => {
        if (suppressClick) {
          suppressClick = false;
          return;
        }

        commitMove(index);
      });
    } else {
      cell.addEventListener('dragover', (event) => {
        event.preventDefault();
      });
      cell.addEventListener('drop', (event) => {
        event.preventDefault();
        const fromIndex = draggedIndex;
        draggedIndex = null;

        if (fromIndex === null) {
          return;
        }

        commitMove(fromIndex);
      });
    }
    board.append(cell);
  });
}

export default function renderBoard(
  board,
  onMove = () => {},
  size = DEFAULT_SIZE,
  initialTiles = null,
  pictureUrl = null,
) {
  const tiles = Array.isArray(initialTiles) ? initialTiles.slice() : shuffledTiles(size);

  paintTiles(board, tiles, size, onMove, pictureUrl);
  return tiles.slice();
}
