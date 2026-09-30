export default function mountApp(root) {
  const app = document.createElement('div');
  app.className = 'app';

  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = 'Gem Puzzle';

  app.append(title);
  root.append(app);
}
