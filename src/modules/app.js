import renderBoard, { isSolved } from './board';
import { loadBoardImage, loadPreviews } from './images';
import {
  addScore,
  readSavedGame,
  readScores,
  writeSavedGame,
} from './session';
import { playMoveSound, setSoundOn, unlockSound } from './sound';

const TICK_MS = 1000;
const SIZES = [3, 4, 5, 6, 7, 8];

function formatElapsed(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / TICK_MS);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

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

  SIZES.forEach((size) => {
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
  const saved = readSavedGame();
  let size = saved ? saved.size : 4;
  let tiles = [];
  let pictureUrl = null;
  let imageFailure = null;
  let imageGeneration = 0;
  let selectedId = null;
  let previewUrls = [];

  const imagePanel = document.createElement('div');
  imagePanel.id = 'image-panel';
  imagePanel.className = 'image-panel';

  const imageLoader = document.createElement('p');
  imageLoader.id = 'image-loader';
  imageLoader.className = 'image-status';
  imageLoader.textContent = 'Loading images…';
  imageLoader.hidden = true;

  const imageError = document.createElement('p');
  imageError.id = 'image-error';
  imageError.className = 'image-status';
  imageError.textContent = 'Could not load the image. Number tiles are shown instead.';
  imageError.hidden = true;

  const retryImage = createButton('retry-image', 'Retry');
  retryImage.hidden = true;

  const thumbs = document.createElement('div');
  thumbs.id = 'thumbs';

  imagePanel.append(imageLoader, imageError, retryImage, thumbs);
  let moves = 0;
  let startedAt = 0;
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

  const boardFrame = document.createElement('div');
  boardFrame.className = 'board-frame';

  const board = document.createElement('div');
  board.id = 'board';
  board.className = 'board';

  const winMessage = document.createElement('p');
  winMessage.id = 'win-message';
  winMessage.className = 'win-message';
  winMessage.hidden = true;

  boardFrame.append(board, winMessage);

  const timeStat = createStat('Time', 'timer', '00:00');
  const timer = timeStat.querySelector('#timer');
  const movesStat = createStat('Moves', 'move-count', '0');
  const moveCount = movesStat.querySelector('#move-count');

  let clockId = 0;
  let frozenElapsed = null;
  const sizeField = createSizeSelect();
  const sizeSelect = sizeField.querySelector('#size-select');

  function elapsedNow() {
    if (frozenElapsed !== null) {
      return frozenElapsed;
    }

    return Date.now() - startedAt;
  }

  function hideWin() {
    winMessage.hidden = true;
    winMessage.textContent = '';
  }

  function stopClock() {
    window.clearTimeout(clockId);
    window.clearInterval(clockId);
    clockId = 0;

    if (frozenElapsed === null) {
      frozenElapsed = Date.now() - startedAt;
    }

    timer.textContent = formatElapsed(frozenElapsed);
  }

  function persist() {
    writeSavedGame({
      size,
      tiles,
      moves,
      elapsed: elapsedNow(),
    });
  }

  function showWin() {
    stopClock();
    winMessage.textContent = `Hooray! You solved the puzzle in ${timer.textContent} and ${moveCount.textContent} moves.`;
    winMessage.hidden = false;
    persist();
  }

  let recordWin = () => {};

  function countMove(nextTiles) {
    tiles = nextTiles.slice();
    moves += 1;
    moveCount.textContent = String(moves);
    playMoveSound();

    if (isSolved(tiles, size)) {
      showWin();
      recordWin();
      return;
    }

    persist();
  }

  function startClock(elapsedMs) {
    window.clearTimeout(clockId);
    window.clearInterval(clockId);
    frozenElapsed = null;
    startedAt = Date.now() - elapsedMs;
    timer.textContent = formatElapsed(elapsedMs);

    const remainder = elapsedMs % TICK_MS;
    const delay = remainder === 0 ? TICK_MS : TICK_MS - remainder;

    clockId = window.setTimeout(() => {
      if (frozenElapsed !== null) {
        return;
      }

      timer.textContent = formatElapsed(elapsedNow());
      clockId = window.setInterval(() => {
        if (frozenElapsed !== null) {
          return;
        }

        timer.textContent = formatElapsed(elapsedNow());
      }, TICK_MS);
    }, delay);
  }

  function showBoard(initialTiles) {
    sizeSelect.value = String(size);
    board.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
    board.style.gridTemplateRows = `repeat(${size}, minmax(0, 1fr))`;
    tiles = renderBoard(board, countMove, size, initialTiles, pictureUrl);
    persist();
  }

  function showImageState(state) {
    imageLoader.hidden = state !== 'loading';
    imageError.hidden = state !== 'error';
    retryImage.hidden = state !== 'error';
  }

  function clearPicture() {
    if (pictureUrl) {
      URL.revokeObjectURL(pictureUrl);
      pictureUrl = null;
    }

    if (tiles.length === size * size) {
      showBoard(tiles);
    }
  }

  function revokePreviewUrls(urls) {
    urls.forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
  }

  function clearPreviews() {
    revokePreviewUrls(previewUrls);
    previewUrls = [];
    thumbs.replaceChildren();
  }

  function markSelected(id) {
    thumbs.querySelectorAll('.thumb').forEach((button) => {
      const selected = button.dataset.id === String(id);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function applyPicture(url) {
    if (tiles.length !== size * size) {
      URL.revokeObjectURL(url);
      return;
    }

    if (pictureUrl) {
      URL.revokeObjectURL(pictureUrl);
    }

    pictureUrl = url;
    showBoard(tiles);
  }

  async function requestPicture(imageId) {
    imageGeneration += 1;
    const generation = imageGeneration;
    selectedId = imageId;
    markSelected(imageId);
    showImageState('loading');
    const result = await loadBoardImage(imageId);

    if (result.aborted || generation !== imageGeneration) {
      if (result.url) {
        URL.revokeObjectURL(result.url);
      }

      return;
    }

    if (!result.ok) {
      imageFailure = { stage: 'file', id: result.id };
      clearPicture();
      showImageState('error');
      return;
    }

    if (selectedId !== imageId) {
      URL.revokeObjectURL(result.url);
      return;
    }

    imageFailure = null;
    showImageState('idle');
    applyPicture(result.url);
  }

  function drawPreviews(previews) {
    clearPreviews();

    const buttons = previews.map((preview, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'thumb';
      button.dataset.id = String(preview.id);
      button.setAttribute('aria-label', `Picture ${index + 1}`);
      button.setAttribute('aria-pressed', 'false');

      const image = document.createElement('img');
      image.src = preview.url;
      image.alt = '';
      button.append(image);
      button.addEventListener('click', () => {
        requestPicture(preview.id);
      });

      return button;
    });

    previewUrls = previews.map((preview) => preview.url);
    thumbs.append(...buttons);
  }

  async function showPreviews() {
    imageGeneration += 1;
    const generation = imageGeneration;
    showImageState('loading');
    const result = await loadPreviews();

    if (result.aborted || generation !== imageGeneration) {
      if (result.previews) {
        revokePreviewUrls(result.previews.map((preview) => preview.url));
      }

      return;
    }

    if (!result.ok) {
      imageFailure = { stage: 'list' };
      clearPreviews();
      clearPicture();
      showImageState('error');
      return;
    }

    imageFailure = null;
    drawPreviews(result.previews);
    requestPicture(result.previews[0].id);
  }

  function startGame() {
    moves = 0;
    moveCount.textContent = '0';
    hideWin();
    startClock(0);
    showBoard();
  }

  sizeSelect.addEventListener('change', () => {
    const nextSize = Number(sizeSelect.value);

    if (!SIZES.includes(nextSize)) {
      sizeSelect.value = String(size);
      return;
    }

    size = nextSize;
    startGame();
  });

  function resumeGame(record) {
    size = record.size;
    moves = record.moves;
    moveCount.textContent = String(moves);

    if (isSolved(record.tiles, size)) {
      frozenElapsed = record.elapsed;
      startedAt = Date.now() - record.elapsed;
      timer.textContent = formatElapsed(record.elapsed);
      showBoard(record.tiles);
      showWin();
      return;
    }

    hideWin();
    startClock(record.elapsed);
    showBoard(record.tiles);
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

  const scoresToggle = createButton('scores-toggle', 'Scores');
  scoresToggle.setAttribute('aria-expanded', 'false');
  scoresToggle.setAttribute('aria-controls', 'scores-panel');

  const scoresPanel = document.createElement('section');
  scoresPanel.id = 'scores-panel';
  scoresPanel.className = 'scores-panel';
  scoresPanel.hidden = true;

  const scoresHeading = document.createElement('h2');
  scoresHeading.className = 'scores-heading';
  scoresHeading.textContent = 'Top 10';

  const scoreList = document.createElement('ol');
  scoreList.id = 'score-list';
  scoreList.className = 'score-list';

  scoresPanel.append(scoresHeading, scoreList);

  function renderScores(scores) {
    const rows = scores.map((score) => {
      const item = document.createElement('li');
      item.textContent = `${formatElapsed(score.elapsed)}, ${score.moves} moves`;
      return item;
    });

    scoreList.replaceChildren(...rows);
  }

  recordWin = () => {
    renderScores(addScore({
      moves,
      elapsed: elapsedNow(),
    }));
  };

  scoresToggle.addEventListener('click', () => {
    const open = scoresPanel.hidden;
    scoresPanel.hidden = !open;
    scoresToggle.setAttribute('aria-expanded', String(open));
  });

  renderScores(readScores());

  const soundToggle = createButton('sound-toggle', 'Sound on');
  soundToggle.setAttribute('aria-pressed', 'true');
  soundToggle.addEventListener('click', () => {
    const next = soundToggle.getAttribute('aria-pressed') !== 'true';
    soundToggle.setAttribute('aria-pressed', String(next));
    soundToggle.textContent = next ? 'Sound on' : 'Sound off';
    setSoundOn(next);
  });

  board.addEventListener('pointerdown', () => {
    unlockSound();
  });

  menuToggle.addEventListener('click', () => {
    const open = controls.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  const imagesToggle = createButton('images-toggle', 'Images');
  imagesToggle.addEventListener('click', () => {
    showPreviews();
  });
  retryImage.addEventListener('click', () => {
    if (imageFailure && imageFailure.stage === 'file') {
      requestPicture(imageFailure.id);
      return;
    }

    showPreviews();
  });

  controls.append(
    sizeField,
    newGame,
    createButton('auto-solve', 'Auto-solve'),
    soundToggle,
    scoresToggle,
    scoresPanel,
    imagesToggle,
    imagePanel,
    timeStat,
    movesStat,
  );
  layout.append(boardFrame, controls);
  app.append(title, menuToggle, layout);
  root.append(app);
  window.addEventListener('pagehide', persist);

  if (saved) {
    resumeGame(saved);
  } else {
    startGame();
  }
}
