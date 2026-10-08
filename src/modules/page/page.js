import './page.css';
import Board from '../board/board';

const SIZES = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8'];

export default class Page {
  constructor(root) {
    this.root = root;
    this.menuOpen = false;
    this.root.classList.add('app');

    this.title = document.createElement('h1');
    this.title.className = 'page__title';
    this.title.textContent = 'Gem Puzzle';

    this.menuToggle = document.createElement('button');
    this.menuToggle.id = 'menu-toggle';
    this.menuToggle.className = 'menu-toggle';
    this.menuToggle.type = 'button';
    this.menuToggle.textContent = 'Menu';
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.setAttribute('aria-controls', 'controls');

    this.main = document.createElement('div');
    this.main.className = 'app__main';

    this.board = document.createElement('div');
    this.board.id = 'board';
    this.board.className = 'board';
    this.puzzle = new Board(this.board);

    this.controls = document.createElement('div');
    this.controls.id = 'controls';
    this.controls.className = 'controls';

    this.sizeSelect = document.createElement('select');
    this.sizeSelect.id = 'size-select';
    this.sizeSelect.className = 'controls__select';
    SIZES.forEach((size) => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      option.selected = size === '4x4';
      this.sizeSelect.append(option);
    });

    this.sizeLabel = document.createElement('label');
    this.sizeLabel.className = 'controls__size';
    this.sizeLabel.append('Size', this.sizeSelect);
    this.controls.append(this.sizeLabel);

    this.newGame = this.createAction('new-game', 'New game');
    this.autoSolve = this.createAction('auto-solve', 'Auto-solve');
    this.soundToggle = this.createAction('sound-toggle', 'Sound on');
    this.soundToggle.setAttribute('aria-pressed', 'true');
    this.scoresToggle = this.createAction('scores-toggle', 'Scores');
    this.imagesToggle = this.createAction('images-toggle', 'Images');

    this.main.append(this.board, this.controls);
    this.root.append(this.title, this.menuToggle, this.main);

    this.menuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });
  }

  createAction(id, label) {
    const button = document.createElement('button');
    button.id = id;
    button.type = 'button';
    button.className = 'controls__action';
    button.textContent = label;
    this.controls.append(button);
    return button;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.root.classList.toggle('app--menu-open', this.menuOpen);
    this.menuToggle.setAttribute('aria-expanded', String(this.menuOpen));
  }
}
