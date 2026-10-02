function solvedValue(index, cellCount) {
  return index + 1 === cellCount ? 0 : index + 1;
}

function solvedBoard(size) {
  const cellCount = size * size;

  return Array.from({ length: cellCount }, (_, index) => solvedValue(index, cellCount));
}

function sameBoard(left, right) {
  return left.every((value, index) => value === right[index]);
}

function neighbors(index, size) {
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

function swap(tiles, left, right) {
  const next = tiles.slice();
  const moving = next[right];

  next[right] = next[left];
  next[left] = moving;
  return next;
}

function replayBlankTargets(board, targets, moves) {
  let tiles = board;

  for (let step = 0; step < targets.length; step += 1) {
    const tileIndex = targets[step];
    const blankIndex = tiles.indexOf(0);
    tiles = swap(tiles, blankIndex, tileIndex);
    moves.push(tileIndex);
  }

  return tiles;
}

function moveTile(board, value, dest, size, blocked, moves) {
  const startTile = board.indexOf(value);

  if (startTile === dest) {
    return board;
  }

  const cellCount = size * size;
  const startBlank = board.indexOf(0);
  const keyOf = (tile, blank) => tile * cellCount + blank;
  const parent = new Map([[keyOf(startTile, startBlank), null]]);
  const queue = [[startTile, startBlank]];
  let head = 0;
  let found = null;

  while (head < queue.length && found === null) {
    const tile = queue[head][0];
    const blank = queue[head][1];
    head += 1;
    const options = neighbors(blank, size);

    for (let option = 0; option < options.length; option += 1) {
      const nextBlank = options[option];

      if (!blocked.has(nextBlank)) {
        const nextTile = nextBlank === tile ? blank : tile;
        const nextKey = keyOf(nextTile, nextBlank);

        if (!parent.has(nextKey)) {
          parent.set(nextKey, { from: keyOf(tile, blank), into: nextBlank });
          queue.push([nextTile, nextBlank]);

          if (nextTile === dest) {
            found = nextKey;
          }
        }
      }
    }
  }

  if (found === null) {
    return null;
  }

  const targets = [];
  let cursor = found;

  while (parent.get(cursor)) {
    targets.push(parent.get(cursor).into);
    cursor = parent.get(cursor).from;
  }

  targets.reverse();
  return replayBlankTargets(board, targets, moves);
}

function movePair(board, first, firstDest, second, secondDest, blankDest, size, blocked, moves) {
  const cellCount = size * size;
  const keyOf = (left, right, blank) => (left * cellCount + right) * cellCount + blank;
  const startLeft = board.indexOf(first);
  const startRight = board.indexOf(second);
  const startBlank = board.indexOf(0);
  const goal = keyOf(firstDest, secondDest, blankDest);

  if (keyOf(startLeft, startRight, startBlank) === goal) {
    return board;
  }

  const parent = new Map([[keyOf(startLeft, startRight, startBlank), null]]);
  const queue = [[startLeft, startRight, startBlank]];
  let head = 0;
  let found = null;

  while (head < queue.length && found === null) {
    const left = queue[head][0];
    const right = queue[head][1];
    const blank = queue[head][2];
    head += 1;
    const options = neighbors(blank, size);

    for (let option = 0; option < options.length; option += 1) {
      const nextBlank = options[option];

      if (!blocked.has(nextBlank)) {
        let nextLeft = left;
        let nextRight = right;

        if (nextBlank === left) {
          nextLeft = blank;
        } else if (nextBlank === right) {
          nextRight = blank;
        }

        const nextKey = keyOf(nextLeft, nextRight, nextBlank);

        if (!parent.has(nextKey)) {
          parent.set(nextKey, { from: keyOf(left, right, blank), into: nextBlank });
          queue.push([nextLeft, nextRight, nextBlank]);

          if (nextKey === goal) {
            found = nextKey;
          }
        }
      }
    }
  }

  if (found === null) {
    return null;
  }

  const targets = [];
  let cursor = found;

  while (parent.get(cursor)) {
    targets.push(parent.get(cursor).into);
    cursor = parent.get(cursor).from;
  }

  targets.reverse();
  return replayBlankTargets(board, targets, moves);
}

function placeRowTail(board, row, size, blocked, moves) {
  const cellCount = size * size;
  const tileA = solvedValue(row * size + (size - 2), cellCount);
  const tileB = solvedValue(row * size + (size - 1), cellCount);
  const holdA = row * size + (size - 1);
  const holdB = (row + 1) * size + (size - 1);
  const blankDest = row * size + (size - 2);
  const parked = movePair(board, tileA, holdA, tileB, holdB, blankDest, size, blocked, moves);

  if (!parked) {
    return null;
  }

  const indexA = parked.indexOf(tileA);
  let tiles = swap(parked, indexA, parked.indexOf(0));
  moves.push(indexA);
  const indexB = tiles.indexOf(tileB);
  tiles = swap(tiles, indexB, tiles.indexOf(0));
  moves.push(indexB);
  blocked.add(blankDest);
  blocked.add(holdA);
  return tiles;
}

function placeColTail(board, column, size, blocked, moves) {
  const cellCount = size * size;
  const last = size - 1;
  const tileC = solvedValue((size - 2) * size + column, cellCount);
  const tileD = solvedValue(last * size + column, cellCount);
  const holdC = last * size + column;
  const holdD = last * size + column + 1;
  const blankDest = (size - 2) * size + column;
  const parked = movePair(
    board,
    tileC,
    holdC,
    tileD,
    holdD,
    blankDest,
    size,
    blocked,
    moves,
  );

  if (!parked) {
    return null;
  }

  const indexC = parked.indexOf(tileC);
  let tiles = swap(parked, indexC, parked.indexOf(0));
  moves.push(indexC);
  const indexD = tiles.indexOf(tileD);
  tiles = swap(tiles, indexD, tiles.indexOf(0));
  moves.push(indexD);
  blocked.add(blankDest);
  blocked.add(holdC);
  return tiles;
}

function placeCorner(board, size, moves) {
  const cellCount = size * size;
  const positions = [
    (size - 2) * size + (size - 2),
    (size - 2) * size + (size - 1),
    (size - 1) * size + (size - 2),
    (size - 1) * size + (size - 1),
  ];
  const corner = new Set(positions);
  const goal = positions.map((index) => solvedValue(index, cellCount)).join(',');

  function signature(tiles) {
    return positions.map((index) => tiles[index]).join(',');
  }

  if (signature(board) === goal) {
    return board;
  }

  const queue = [{ board, path: [] }];
  const seen = new Set([signature(board)]);
  let head = 0;

  while (head < queue.length) {
    const current = queue[head];
    head += 1;
    const blankIndex = current.board.indexOf(0);
    const options = neighbors(blankIndex, size);

    for (let option = 0; option < options.length; option += 1) {
      const tileIndex = options[option];

      if (corner.has(tileIndex)) {
        const nextBoard = swap(current.board, blankIndex, tileIndex);
        const sig = signature(nextBoard);

        if (!seen.has(sig)) {
          const path = current.path.concat(tileIndex);

          if (sig === goal) {
            path.forEach((index) => {
              moves.push(index);
            });
            return nextBoard;
          }

          seen.add(sig);
          queue.push({ board: nextBoard, path });
        }
      }
    }
  }

  return null;
}

function placeCell(board, dest, size, blocked, moves) {
  const cellCount = size * size;
  const placed = moveTile(board, solvedValue(dest, cellCount), dest, size, blocked, moves);

  if (!placed) {
    return null;
  }

  blocked.add(dest);
  return placed;
}

export default function solutionMoves(tiles, size) {
  const goal = solvedBoard(size);

  if (!Array.isArray(tiles) || tiles.length !== size * size || sameBoard(tiles, goal)) {
    return [];
  }

  let board = tiles.slice();
  const moves = [];
  const blocked = new Set();

  for (let row = 0; row < size - 2; row += 1) {
    for (let column = 0; column < size - 2; column += 1) {
      board = placeCell(board, row * size + column, size, blocked, moves);

      if (!board) {
        return [];
      }
    }

    board = placeRowTail(board, row, size, blocked, moves);

    if (!board) {
      return [];
    }
  }

  for (let column = 0; column < size - 2; column += 1) {
    board = placeColTail(board, column, size, blocked, moves);

    if (!board) {
      return [];
    }
  }

  board = placeCorner(board, size, moves);

  if (!board || !sameBoard(board, goal)) {
    return [];
  }

  return moves;
}
