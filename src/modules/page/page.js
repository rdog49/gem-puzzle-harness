import './page.css';

export default class Page {
  constructor(root) {
    this.root = root;
    this.title = document.createElement('h1');
    this.title.className = 'page__title';
    this.title.textContent = 'Gem Puzzle';
    this.root.append(this.title);
  }
}
