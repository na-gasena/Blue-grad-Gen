// 画像出力クラス
class ImageExporter {
  constructor(config, shapeRenderer) {
    this.config = config;
    this.shapeRenderer = shapeRenderer;
  }
  
  // 高解像度画像を保存
  saveHighResImage(canvasWidth, canvasHeight) {
    const outputWidth = this.config.getParam('outputWidth');
    const outputHeight = this.config.getParam('outputHeight');
    const transparentBg = this.config.getParam('transparentBg');
    
    // 高解像度キャンバス作成
    let highResCanvas = createGraphics(outputWidth, outputHeight);
    highResCanvas.pixelDensity(1); // 正確なサイズにするため
    
    // 座標の計算
    const coordinates = this._calculateCoordinates(canvasWidth, canvasHeight, outputWidth, outputHeight);
    
    if (transparentBg) {
      this._renderWithTransparency(highResCanvas, coordinates);
    } else {
      this._renderOpaque(highResCanvas, coordinates);
    }
    
    // ファイル保存
    const filename = this._generateFilename();
    highResCanvas.save(filename);
  }
  
  // 座標の計算
  _calculateCoordinates(canvasWidth, canvasHeight, outputWidth, outputHeight) {
    const scaleX = outputWidth / canvasWidth;
    const scaleY = outputHeight / canvasHeight;
    const centerX = outputWidth / 2 + (this.config.getParam('xPosition') * scaleX);
    const centerY = outputHeight / 2 + (this.config.getParam('yPosition') * scaleY);
    const scaledSize = this.config.getParam('shapeSize') * scaleX;
    
    return { centerX, centerY, scaledSize };
  }
  
  // 透過背景での描画
  _renderWithTransparency(canvas, coordinates) {
    // 1. まず白背景で図形を描画
    canvas.background(255);
    this.shapeRenderer.drawShape(canvas, coordinates.centerX, coordinates.centerY, coordinates.scaledSize, true);
    
    // 2. マスク用キャンバスを作成
    let maskCanvas = createGraphics(canvas.width, canvas.height);
    maskCanvas.pixelDensity(1);
    maskCanvas.background(0); // 黒背景（透過部分）
    
    // マスク用の図形描画
    this.shapeRenderer.drawShapeMask(maskCanvas, coordinates.centerX, coordinates.centerY, coordinates.scaledSize);
    
    // 3. マスクを適用して透過処理
    this._applyTransparencyMask(canvas, maskCanvas);
  }
  
  // 不透明背景での描画
  _renderOpaque(canvas, coordinates) {
    canvas.background(255);
    this.shapeRenderer.drawShape(canvas, coordinates.centerX, coordinates.centerY, coordinates.scaledSize, true);
  }
  
  // マスクを適用して透過処理を行う
  _applyTransparencyMask(targetCanvas, maskCanvas) {
    targetCanvas.loadPixels();
    maskCanvas.loadPixels();
    
    // ピクセル単位で処理
    for (let i = 0; i < targetCanvas.pixels.length; i += 4) {
      let maskAlpha = maskCanvas.pixels[i]; // マスクの赤チャンネル（グレースケール）
      
      // マスクが黒（0）の部分は透過、白（255）の部分は不透明
      if (maskAlpha === 0) {
        // 完全透過
        targetCanvas.pixels[i + 3] = 0; // アルファチャンネルを0に
      } else {
        // 不透明のまま（元の色を保持）
        targetCanvas.pixels[i + 3] = 255; // アルファチャンネルを255に
      }
    }
    
    targetCanvas.updatePixels();
  }
  
  // ファイル名の生成
  _generateFilename() {
    const timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
    const shape = this.config.getParam('shape');
    return `gradient-art-${shape}-${timestamp}.png`;
  }
} 