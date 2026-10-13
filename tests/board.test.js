const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function loadBoard() {
  const filename = path.resolve(__dirname, '../src/modules/board/board.js');
  const source = fs
    .readFileSync(filename, 'utf8')
    .replace(/import\s+['"]\.\/board\.css['"];?/, '')
    .replace('export default class Board', 'class Board')
    .concat('\nmodule.exports = Board;\n');
  const boardModule = new Module(filename);
  boardModule.filename = filename;
  boardModule.paths = Module._nodeModulePaths(path.dirname(filename));
  boardModule._compile(source, filename);
  return boardModule.exports;
}

function createBoard() {
  const Board = loadBoard();
  return Object.create(Board.prototype);
}

function randomFrom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

test('default board is a solved 4x4 with one empty cell', () => {
  const board = createBoard();
  board.fillSolved();

  assert.equal(board.size, 4);
  assert.deepEqual(
    board.cells,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
  );
  assert.equal(board.cells.filter((value) => value === 0).length, 1);
});

test('shuffle leaves an unsolved solvable board', () => {
  const board = createBoard();
  board.shuffle(randomFrom(1));

  assert.equal(board.size, 4);
  assert.equal(board.isSolved(), false);
  assert.equal(board.isSolvable(), true);
  assert.deepEqual(
    [...board.cells].sort((left, right) => left - right),
    TILES
  );
});

test('two shuffles can differ', () => {
  const first = createBoard();
  const second = createBoard();
  first.shuffle(randomFrom(1));
  second.shuffle(randomFrom(2));

  assert.notDeepEqual(first.cells, second.cells);
});

test('a walk back to solved still ends unsolved', () => {
  const board = createBoard();
  let previous = null;
  const random = () => {
    const blank = board.cells.indexOf(0);
    const neighbors = board.neighborIndexes(blank);
    const back = previous === null ? -1 : neighbors.indexOf(previous);
    const pick = back === -1 ? 0 : back;
    previous = blank;
    return (pick + 0.5) / neighbors.length;
  };

  board.shuffle(random);

  assert.equal(board.isSolved(), false);
  assert.equal(board.isSolvable(), true);
});

test('one swapped pair is unsolvable', () => {
  const board = createBoard();
  board.fillSolved();
  board.cells[0] = 2;
  board.cells[1] = 1;

  assert.equal(board.isSolvable(), false);
});
