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

test('default board is a solved 4x4 with one empty cell', () => {
  const Board = loadBoard();
  const board = Object.create(Board.prototype);
  board.fillSolved();

  assert.equal(board.size, 4);
  assert.deepEqual(
    board.cells,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
  );
  assert.equal(board.cells.filter((value) => value === 0).length, 1);
});
