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

let suppressClick = false;

function paintTiles(board, tiles, size, onMove) {
  board.replaceChildren();

  let draggedIndex = null;

  function commitMove(index) {
    const next = moveTile(tiles, index, size);

    if (!next) {
      return;
    }

    paintTiles(board, next, size, onMove);
    onMove();
  }

  tiles.forEach((value, index) => {
    const isEmpty = value === 0;
    const cell = document.createElement(isEmpty ? 'div' : 'button');

    cell.className = isEmpty ? 'tile tile--empty' : 'tile';
    if (!isEmpty) {
      cell.type = 'button';
      cell.draggable = true;
      cell.textContent = String(value);
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

export default function renderBoard(board, onMove = () => {}) {
  paintTiles(board, shuffledTiles(DEFAULT_SIZE), DEFAULT_SIZE, onMove);
}
