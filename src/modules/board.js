const DEFAULT_SIZE = 4;

function solvedTiles(size) {
  const cellCount = size * size;

  return Array.from({ length: cellCount }, (_, index) => (
    index + 1 === cellCount ? 0 : index + 1
  ));
}

export default function renderSolvedBoard(board) {
  board.replaceChildren();

  solvedTiles(DEFAULT_SIZE).forEach((value) => {
    const cell = document.createElement('div');
    const isEmpty = value === 0;

    cell.className = isEmpty ? 'tile tile--empty' : 'tile';
    if (!isEmpty) {
      cell.textContent = String(value);
    }
    board.append(cell);
  });
}
