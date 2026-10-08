import './board.css';

const SIZE = 4;

export default class Board {
  constructor(root) {
    this.root = root;
    this.fillSolved();
    this.render();
  }

  fillSolved() {
    this.size = SIZE;
    const count = this.size * this.size;
    this.cells = Array.from({ length: count }, (_, index) =>
      index === count - 1 ? 0 : index + 1
    );
  }

  render() {
    this.root.replaceChildren();
    this.cells.forEach((value) => {
      const cell = document.createElement('div');
      const empty = value === 0;
      cell.className = empty ? 'tile tile--empty' : 'tile';
      if (!empty) {
        cell.textContent = String(value);
      }
      this.root.append(cell);
    });
  }
}
