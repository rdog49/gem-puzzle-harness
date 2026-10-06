class App {
  constructor(root) {
    this.root = root;
    this.root.style.minHeight = '100vh';
  }
}

export default new App(document.getElementById('app'));
