import renderBoard from './board';

function createButton(id, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = id;
  button.className = 'control';
  button.textContent = text;
  return button;
}

function createSizeSelect() {
  const sizeLabel = document.createElement('label');
  sizeLabel.className = 'field';
  sizeLabel.htmlFor = 'size-select';
  sizeLabel.textContent = 'Size';

  const sizeSelect = document.createElement('select');
  sizeSelect.id = 'size-select';

  [3, 4, 5, 6, 7, 8].forEach((size) => {
    const option = document.createElement('option');
    option.value = String(size);
    option.textContent = `${size}x${size}`;
    option.selected = size === 4;
    sizeSelect.append(option);
  });

  sizeLabel.append(sizeSelect);
  return sizeLabel;
}

function createStat(label, id, value) {
  const stat = document.createElement('p');
  stat.className = 'stat';

  const name = document.createElement('span');
  name.textContent = label;

  const reading = document.createElement('span');
  reading.id = id;
  reading.textContent = value;

  stat.append(name, reading);
  return stat;
}

function isTypingTarget(target) {
  return target instanceof HTMLElement
    && target.closest('input, textarea, select, [contenteditable]') !== null;
}

export default function mountApp(root) {
  const size = 4;
  const app = document.createElement('div');
  app.className = 'app';

  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = 'Gem Puzzle';

  const menuToggle = document.createElement('button');
  menuToggle.type = 'button';
  menuToggle.id = 'menu-toggle';
  menuToggle.className = 'menu-toggle';
  menuToggle.textContent = 'Menu';
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'controls');

  const layout = document.createElement('div');
  layout.className = 'layout';

  const board = document.createElement('div');
  board.id = 'board';
  board.className = 'board';

  const timeStat = createStat('Time', 'timer', '00:00');
  const timer = timeStat.querySelector('#timer');
  const movesStat = createStat('Moves', 'move-count', '0');
  const moveCount = movesStat.querySelector('#move-count');

  function countMove() {
    moveCount.textContent = String(Number(moveCount.textContent) + 1);
  }

  function startGame() {
    timer.textContent = '00:00';
    moveCount.textContent = '0';
    renderBoard(board, countMove, size);
  }

  const newGame = createButton('new-game', 'New game');
  newGame.addEventListener('click', startGame);

  document.addEventListener('keydown', (event) => {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (event.key !== 'n' && event.key !== 'N') {
      return;
    }

    if (isTypingTarget(event.target)) {
      return;
    }

    startGame();
  });

  const controls = document.createElement('div');
  controls.id = 'controls';
  controls.className = 'controls';

  const soundToggle = createButton('sound-toggle', 'Sound on');
  soundToggle.setAttribute('aria-pressed', 'true');

  menuToggle.addEventListener('click', () => {
    const open = controls.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  controls.append(
    createSizeSelect(),
    newGame,
    createButton('auto-solve', 'Auto-solve'),
    soundToggle,
    createButton('scores-toggle', 'Scores'),
    createButton('images-toggle', 'Images'),
    timeStat,
    movesStat,
  );
  layout.append(board, controls);
  app.append(title, menuToggle, layout);
  root.append(app);
  startGame();
}
