// リファクタリング後のメインエントリーポイント

// グローバルアプリケーションインスタンス
let app;

// p5.js setup関数
function setup() {
  // アプリケーションの初期化
  app = new GradientArtApp();
  app.initialize();
}

// p5.js draw関数
function draw() {
  // 継続的な描画処理
  app.render();
}

// p5.js windowResized関数
function windowResized() {
  // ウィンドウリサイズ対応
  app.handleWindowResize();
} 