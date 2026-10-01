const DEFAULT_SIZE = 4;
const SHUFFLE_PASSES = 12;

function solvedTiles(size) {
  const cellCount = size * size;

  return Array.from({ length: cellCount }, (_, index) => (
    index + 1 === cellCount ? 0 : index + 1
  ));
}

function isSolved(tiles) {
  const lastIndex = tiles.length - 1;

  return tiles.every((value, index) => (
    index === lastIndex ? value === 0 : value === index + 1
  ));
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

function applyBlankMove(tiles, size) {
  const blankIndex = tiles.indexOf(0);
  const options = neighborIndexes(blankIndex, size);
  const choice = options[Math.floor(Math.random() * options.length)];
  const next = tiles.slice();

  next[blankIndex] = next[choice];
  next[choice] = 0;
  return next;
}

function inversionCount(tiles, size) {
  const blankValue = size * size;
  const ranked = tiles.map((value) => (value === 0 ? blankValue : value));
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

function blankTaxicab(tiles, size) {
  const blankIndex = tiles.indexOf(0);
  const row = Math.floor(blankIndex / size);
  const column = blankIndex % size;
  const last = size - 1;

  return Math.abs(row - last) + Math.abs(column - last);
}

function isSolvable(tiles, size) {
  return (inversionCount(tiles, size) + blankTaxicab(tiles, size)) % 2 === 0;
}

function shuffledTiles(size) {
  const steps = size * size * SHUFFLE_PASSES;
  let tiles = solvedTiles(size);

  for (let step = 0; step < steps; step += 1) {
    tiles = applyBlankMove(tiles, size);
  }

  if (isSolved(tiles)) {
    tiles = applyBlankMove(tiles, size);
  }

  while (!isSolvable(tiles, size)) {
    tiles = applyBlankMove(tiles, size);
  }

  return tiles;
}

function renderTiles(board, tiles) {
  board.replaceChildren();

  tiles.forEach((value) => {
    const cell = document.createElement('div');
    const isEmpty = value === 0;

    cell.className = isEmpty ? 'tile tile--empty' : 'tile';
    if (!isEmpty) {
      cell.textContent = String(value);
    }
    board.append(cell);
  });
}

export default function renderShuffledBoard(board) {
  renderTiles(board, shuffledTiles(DEFAULT_SIZE));
}
