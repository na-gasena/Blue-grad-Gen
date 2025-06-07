// メインアプリケーションクラス
class GradientArtApp {
  constructor() {
    this.config = new Config();
    this.gradientUtils = new GradientUtils(this.config);
    this.shapeRenderer = new ShapeRenderer(this.config, this.gradientUtils);
    this.imageExporter = new ImageExporter(this.config, this.shapeRenderer);
    this.uiManager = new UIManager(this.config);
    
    this.canvas = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
  }
  
  // アプリケーションの初期化
  initialize() {
    this._setupCanvas();
    this._setupUI();
    this._setupEventListeners();
  }
  
  // キャンバスの設定
  _setupCanvas() {
    // キャンバスサイズの計算（アスペクト比を保持）
    this.canvasWidth = min(windowWidth * this.config.constants.CANVAS_WIDTH_RATIO, 
                          this.config.constants.MAX_CANVAS_WIDTH);
    this.canvasHeight = this.canvasWidth / this.config.constants.ASPECT_RATIO;
    
    // キャンバスを指定されたコンテナに配置
    this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
    this.canvas.parent('canvas-container');
    
    // 滑らかな描画のための設定
    pixelDensity(this.config.constants.PIXEL_DENSITY);
  }
  
  // UI設定
  _setupUI() {
    this.uiManager.setupEventListeners();
  }
  
  // イベントリスナーの設定
  _setupEventListeners() {
    // 保存イベントのリスナー
    document.addEventListener('save-image', () => {
      this.saveImage();
    });
  }
  
  // 描画処理
  render() {
    this._setBackground();
    this._drawShape();
  }
  
  // 背景の設定
  _setBackground() {
    const bgType = this.config.getParam('previewBg');
    
    switch(bgType) {
      case 'white':
        background(255);
        break;
      case 'black':
        background(0);
        break;
      case 'gray':
        background(128);
        break;
      case 'transparent':
      default:
        clear();
        break;
    }
  }
  
  // 図形の描画
  _drawShape() {
    // 図形の中心位置を計算
    const centerX = this.canvasWidth / 2 + this.config.getParam('xPosition');
    const centerY = this.canvasHeight / 2 + this.config.getParam('yPosition');
    const size = this.config.getParam('shapeSize');
    
    // 図形描画
    this.shapeRenderer.drawShape(getMainCanvas(), centerX, centerY, size, false);
  }
  
  // 画像保存
  saveImage() {
    this.imageExporter.saveHighResImage(this.canvasWidth, this.canvasHeight);
  }
  
  // ウィンドウリサイズ対応
  handleWindowResize() {
    // キャンバスサイズを再計算
    this.canvasWidth = min(windowWidth * this.config.constants.CANVAS_WIDTH_RATIO, 
                          this.config.constants.MAX_CANVAS_WIDTH);
    this.canvasHeight = this.canvasWidth / this.config.constants.ASPECT_RATIO;
    resizeCanvas(this.canvasWidth, this.canvasHeight);
  }
}

// p5.jsのグローバル関数から現在のキャンバスを取得するヘルパー関数
function getMainCanvas() {
  // p5.jsの現在の描画コンテキストを返す
  // この場合は直接window（グローバルスコープ）を使用
  return window;
} 