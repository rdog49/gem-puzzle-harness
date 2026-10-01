const STATE_KEY = 'gem_puzzle_state';
const MIN_SIZE = 3;
const MAX_SIZE = 8;

function isPermutation(tiles, size) {
  const cellCount = size * size;

  if (!Array.isArray(tiles) || tiles.length !== cellCount) {
    return false;
  }

  const seen = new Set();

  return tiles.every((value) => {
    if (!Number.isInteger(value) || value < 0 || value >= cellCount || seen.has(value)) {
      return false;
    }

    seen.add(value);
    return true;
  });
}

function parseState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const {
    size,
    tiles,
    moves,
    elapsed,
  } = value;

  if (!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
    return null;
  }

  if (!isPermutation(tiles, size)) {
    return null;
  }

  if (!Number.isInteger(moves) || moves < 0) {
    return null;
  }

  if (typeof elapsed !== 'number' || !Number.isFinite(elapsed) || elapsed < 0) {
    return null;
  }

  return {
    size,
    tiles: tiles.slice(),
    moves,
    elapsed,
  };
}

export function readSavedGame() {
  try {
    const raw = localStorage.getItem(STATE_KEY);

    if (raw === null) {
      return null;
    }

    return parseState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeSavedGame(state) {
  const record = {
    size: state.size,
    tiles: state.tiles.slice(),
    moves: state.moves,
    elapsed: state.elapsed,
  };

  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(record));
  } catch {
    // The board still plays when storage is unavailable.
  }
}
