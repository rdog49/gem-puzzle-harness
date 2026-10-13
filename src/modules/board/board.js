import './board.css';

const SIZE = 4;

export default class Board {
  constructor(root, random = Math.random) {
    this.root = root;
    this.shuffle(random);
    this.render();
  }

  fillSolved() {
    this.size = SIZE;
    const count = this.size * this.size;
    this.cells = Array.from({ length: count }, (_, index) =>
      index === count - 1 ? 0 : index + 1
    );
  }

  shuffle(random = Math.random) {
    this.fillSolved();
    const steps = this.size * this.size * 12;
    for (let step = 0; step < steps; step += 1) {
      this.slideBlank(random);
    }
    if (this.isSolved()) {
      this.slideBlank(random);
    }
  }

  slideBlank(random) {
    const blank = this.cells.indexOf(0);
    const neighbors = this.neighborIndexes(blank);
    const raw = Math.floor(random() * neighbors.length);
    const pick = Math.min(raw, neighbors.length - 1);
    const next = neighbors[pick];
    const tile = this.cells[next];
    this.cells[next] = 0;
    this.cells[blank] = tile;
  }

  neighborIndexes(index) {
    const { size } = this;
    const row = Math.floor(index / size);
    const column = index % size;
    const neighbors = [];
    if (row > 0) {
      neighbors.push(index - size);
    }
    if (row < size - 1) {
      neighbors.push(index + size);
    }
    if (column > 0) {
      neighbors.push(index - 1);
    }
    if (column < size - 1) {
      neighbors.push(index + 1);
    }
    return neighbors;
  }

  isSolved() {
    const count = this.size * this.size;
    return this.cells.every(
      (value, index) => value === (index === count - 1 ? 0 : index + 1)
    );
  }

  isSolvable() {
    const count = this.size * this.size;
    const ranked = this.cells.map((value) => (value === 0 ? count : value));
    let inversions = 0;
    for (let left = 0; left < ranked.length; left += 1) {
      for (let right = left + 1; right < ranked.length; right += 1) {
        if (ranked[left] > ranked[right]) {
          inversions += 1;
        }
      }
    }
    const blank = this.cells.indexOf(0);
    const row = Math.floor(blank / this.size);
    const column = blank % this.size;
    const taxicab =
      Math.abs(row - (this.size - 1)) + Math.abs(column - (this.size - 1));
    return (inversions + taxicab) % 2 === 0;
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
