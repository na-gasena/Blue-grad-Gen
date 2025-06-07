// パラメータ設定
let params = {
  shape: 'circle',
  colorPalette: 'blue-white',
  shapeSize: 150,
  xPosition: 0,
  yPosition: 0,
  gradientStart: 0.0,
  gradientEnd: 1.0,
  gradientLoop: false,
  gradientReverse: false,
  gradientOffset: 0.0,
  gradientInvert: false,
  previewBg: 'transparent',
  outputWidth: 2520,
  outputHeight: 2992,
  transparentBg: true
};

// カラーパレット定義
const colorPalettes = {
  'blue-white': { start: [0, 0, 255], end: [255, 255, 255] },
  'red-white': { start: [255, 0, 0], end: [255, 255, 255] },
  'green-white': { start: [0, 255, 0], end: [255, 255, 255] }
};

let canvas;
const aspectRatio = 1 / 1.187; // 1:1.187のアスペクト比

function setup() {
  // キャンバスサイズの計算（アスペクト比を保持）
  let canvasWidth = min(windowWidth * 0.6, 600);
  let canvasHeight = canvasWidth / aspectRatio;
  
  // キャンバスを指定されたコンテナに配置
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  
  // 滑らかな描画のための設定
  pixelDensity(2); // 高DPI対応
  
  // UIイベントリスナーの設定
  setupUI();
  
  // 初期表示値を設定
  updateDisplayValues();
}

// 表示値を更新する関数
function updateDisplayValues() {
  const elements = [
    { id: 'sizeValue', value: params.shapeSize },
    { id: 'xPosValue', value: params.xPosition },
    { id: 'yPosValue', value: params.yPosition },
    { id: 'gradStartValue', value: params.gradientStart.toFixed(2) },
    { id: 'gradEndValue', value: params.gradientEnd.toFixed(2) },
    { id: 'gradOffsetValue', value: params.gradientOffset.toFixed(2) },
    { id: 'outputWidthValue', value: params.outputWidth },
    { id: 'outputHeightValue', value: params.outputHeight }
  ];
  
  elements.forEach(elem => {
    const element = document.getElementById(elem.id);
    if (element) {
      element.textContent = elem.value;
    }
  });
}

function draw() {
  // 背景設定
  setBackground();
  
  // 図形の描画
  drawShape();
}

function setBackground() {
  switch(params.previewBg) {
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

function drawShape() {
  push();
  
  // 図形の中心位置を計算
  let centerX = width / 2 + params.xPosition;
  let centerY = height / 2 + params.yPosition;
  
  // 図形描画
  noStroke();
  
  switch(params.shape) {
    case 'circle':
      drawGradientCircle(centerX, centerY, params.shapeSize);
      break;
    case 'triangle':
      drawGradientTriangle(centerX, centerY, params.shapeSize);
      break;
    case 'rectangle':
      drawGradientRectangle(centerX, centerY, params.shapeSize);
      break;
  }
  
  pop();
}

// グラデーション進行値を計算するヘルパー関数
function calculateGradientProgress(progress) {
  let range = params.gradientEnd - params.gradientStart;
  
  // 除算エラー回避：開始と終了が同じ場合は単色として扱う
  if (range === 0) {
    return 0.5; // 中間色を使用
  }
  
  // オフセット適用：進行値をオフセット分ずらす
  let adjustedProgress = progress - params.gradientOffset;
  
  // 0-1の範囲に正規化（ループ処理）
  adjustedProgress = adjustedProgress - Math.floor(adjustedProgress);
  if (adjustedProgress < 0) {
    adjustedProgress += 1;
  }
  
  let gradProgress;
  
  // グラデーション範囲のチェック
  if (adjustedProgress < params.gradientStart || adjustedProgress > params.gradientEnd) {
    if (params.gradientLoop) {
      // ループモード：範囲外でも継続的にループ
      let normalizedProgress = (adjustedProgress - params.gradientStart) / range;
      normalizedProgress = normalizedProgress - Math.floor(normalizedProgress);
      if (normalizedProgress < 0) {
        normalizedProgress += 1;
      }
      gradProgress = normalizedProgress;
    } else {
      // 非ループモード：範囲外は端の色を使用
      gradProgress = adjustedProgress < params.gradientStart ? 0 : 1;
    }
  } else {
    // 範囲内：線形マッピング
    gradProgress = (adjustedProgress - params.gradientStart) / range;
  }
  
  // 値を0-1の範囲でクランプ
  gradProgress = Math.max(0, Math.min(1, gradProgress));
  
  // 折り返しグラデーション処理
  if (params.gradientReverse) {
    // 0→1→0の山型グラデーション
    gradProgress = gradProgress <= 0.5 ? gradProgress * 2 : (1 - gradProgress) * 2;
  }
  
  return gradProgress;
}

// カラー補間のヘルパー関数（改良されたディザリング付き）
function interpolateColor(palette, gradProgress, x = 0, y = 0) {
  // NaN や無効な値をチェック
  if (!isFinite(gradProgress)) {
    gradProgress = 0.5;
  }
  
  // 0-1の範囲にクランプ
  gradProgress = Math.max(0, Math.min(1, gradProgress));
  
  let startColor = palette.start;
  let endColor = palette.end;
  
  // カラー反転が有効な場合、開始色と終了色を入れ替え
  if (params.gradientInvert) {
    startColor = palette.end;
    endColor = palette.start;
  }
  
  // 基本色の計算
  let baseR = lerp(startColor[0], endColor[0], gradProgress);
  let baseG = lerp(startColor[1], endColor[1], gradProgress);
  let baseB = lerp(startColor[2], endColor[2], gradProgress);
  
  // 改良されたディザリング処理
  let ditherStrength = 2.0; // ディザリング強度を増加
  
  // 座標の正規化（解像度に依存しないディザリングパターンのため）
  let normalizedX = x * 0.001;
  let normalizedY = y * 0.001;
  
  // 複数のノイズレイヤーを組み合わせ
  let noise1 = noise(normalizedX * 50, normalizedY * 50) - 0.5;
  let noise2 = noise(normalizedX * 20, normalizedY * 20) - 0.5;
  let noise3 = noise(normalizedX * 80, normalizedY * 80) - 0.5;
  
  // ノイズを重み付けして組み合わせ
  let combinedNoise = (noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1) * ditherStrength;
  
  // 各色チャンネルに異なるオフセットを適用してより自然なディザリングを実現
  let r = baseR + combinedNoise + (noise(normalizedX * 100, normalizedY * 100, 0.1) - 0.5) * ditherStrength * 0.5;
  let g = baseG + combinedNoise + (noise(normalizedX * 100, normalizedY * 100, 0.2) - 0.5) * ditherStrength * 0.5;
  let b = baseB + combinedNoise + (noise(normalizedX * 100, normalizedY * 100, 0.3) - 0.5) * ditherStrength * 0.5;
  
  // 色値を0-255の範囲でクランプ
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return { r, g, b };
}

function drawGradientCircle(x, y, size) {
  let steps = Math.max(2000, size * 8); // ステップ数を大幅に増加
  let currentPalette = colorPalettes[params.colorPalette];
  
  push();
  blendMode(NORMAL); // 正常なブレンドモード
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 円の描画（上から下へのグラデーション）
    let yPos = y - size/2 + (progress * size);
    let stripHeight = Math.max(0.5, size / steps); // 最小高さを0.5pxに設定
    
    // 各Y位置での円の幅を計算
    let distFromCenter = abs(yPos - y);
    if (distFromCenter < size/2) {
      let circleWidth = 2 * sqrt((size/2) * (size/2) - distFromCenter * distFromCenter);
      
      // 色の補間（座標を渡してディザリング）
      let color = interpolateColor(currentPalette, gradProgress, x, yPos);
      fill(color.r, color.g, color.b);
      
      // より細かい高さで描画してバンドを減らす
      rect(x - circleWidth/2, yPos, circleWidth, stripHeight);
    }
  }
  
  pop();
}

function drawGradientTriangle(x, y, size) {
  let steps = Math.max(2000, size * 8); // ステップ数を大幅に増加
  let currentPalette = colorPalettes[params.colorPalette];
  
  push();
  blendMode(NORMAL);
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 三角形の描画（上から下へのグラデーション）
    let yPos = y - size/2 + (progress * size);
    let triangleWidth = (1 - progress) * size;
    let stripHeight = Math.max(0.5, size / steps); // 最小高さを0.5pxに設定
    
    if (triangleWidth > 0) {
      // 色の補間（座標を渡してディザリング）
      let color = interpolateColor(currentPalette, gradProgress, x, yPos);
      fill(color.r, color.g, color.b);
      
      rect(x - triangleWidth/2, yPos, triangleWidth, stripHeight);
    }
  }
  
  pop();
}

function drawGradientRectangle(x, y, size) {
  let steps = Math.max(2000, size * 8); // ステップ数を大幅に増加
  let currentPalette = colorPalettes[params.colorPalette];
  
  push();
  blendMode(NORMAL);
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 四角形の描画（上から下へのグラデーション）
    let yPos = y - size/2 + (progress * size);
    let stripHeight = Math.max(0.5, size / steps); // 最小高さを0.5pxに設定
    
    // 色の補間（座標を渡してディザリング）
    let color = interpolateColor(currentPalette, gradProgress, x, yPos);
    fill(color.r, color.g, color.b);
    
    rect(x - size/2, yPos, size, stripHeight);
  }
  
  pop();
}

function setupUI() {
  // エラーハンドリング付きでイベントリスナーを設定
  function safeAddEventListener(id, event, callback) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener(event, callback);
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }
  
  // 図形選択
  safeAddEventListener('shapeSelect', 'change', function() {
    params.shape = this.value;
  });
  
  // カラーパレット選択
  safeAddEventListener('colorPalette', 'change', function() {
    params.colorPalette = this.value;
  });
  
  // 図形サイズ
  safeAddEventListener('shapeSize', 'input', function() {
    const value = parseInt(this.value);
    params.shapeSize = Math.max(1, Math.min(1000, value)); // 1-1000の範囲で制限
    const sizeValue = document.getElementById('sizeValue');
    if (sizeValue) sizeValue.textContent = params.shapeSize;
  });
  
  // X位置
  safeAddEventListener('xPosition', 'input', function() {
    params.xPosition = parseInt(this.value);
    const xPosValue = document.getElementById('xPosValue');
    if (xPosValue) xPosValue.textContent = this.value;
  });
  
  // Y位置
  safeAddEventListener('yPosition', 'input', function() {
    params.yPosition = parseInt(this.value);
    const yPosValue = document.getElementById('yPosValue');
    if (yPosValue) yPosValue.textContent = this.value;
  });
  
  // グラデーション開始
  safeAddEventListener('gradientStart', 'input', function() {
    const value = parseFloat(this.value);
    params.gradientStart = Math.max(0, Math.min(1, value)); // 0-1の範囲で制限
    const gradStartValue = document.getElementById('gradStartValue');
    if (gradStartValue) gradStartValue.textContent = params.gradientStart.toFixed(2);
  });
  
  // グラデーション終了
  safeAddEventListener('gradientEnd', 'input', function() {
    const value = parseFloat(this.value);
    params.gradientEnd = Math.max(0, Math.min(1, value)); // 0-1の範囲で制限
    const gradEndValue = document.getElementById('gradEndValue');
    if (gradEndValue) gradEndValue.textContent = params.gradientEnd.toFixed(2);
  });
  
  // グラデーションループ
  safeAddEventListener('gradientLoop', 'change', function() {
    params.gradientLoop = this.checked;
  });
  
  // グラデーション折り返し
  safeAddEventListener('gradientReverse', 'change', function() {
    params.gradientReverse = this.checked;
  });
  
  // グラデーションオフセット（スライド）
  safeAddEventListener('gradientOffset', 'input', function() {
    const value = parseFloat(this.value);
    params.gradientOffset = Math.max(-1, Math.min(1, value)); // -1から1の範囲で制限
    const gradOffsetValue = document.getElementById('gradOffsetValue');
    if (gradOffsetValue) gradOffsetValue.textContent = params.gradientOffset.toFixed(2);
  });
  
  // グラデーションカラー反転
  safeAddEventListener('gradientInvert', 'change', function() {
    params.gradientInvert = this.checked;
  });
  
  // プレビュー背景
  safeAddEventListener('previewBg', 'change', function() {
    params.previewBg = this.value;
  });
  
  // 出力幅
  safeAddEventListener('outputWidth', 'input', function() {
    const value = parseInt(this.value);
    params.outputWidth = Math.max(100, Math.min(10000, value)); // 100-10000の範囲で制限
    const outputWidthValue = document.getElementById('outputWidthValue');
    if (outputWidthValue) outputWidthValue.textContent = params.outputWidth;
  });
  
  // 出力高さ
  safeAddEventListener('outputHeight', 'input', function() {
    const value = parseInt(this.value);
    params.outputHeight = Math.max(100, Math.min(10000, value)); // 100-10000の範囲で制限
    const outputHeightValue = document.getElementById('outputHeightValue');
    if (outputHeightValue) outputHeightValue.textContent = params.outputHeight;
  });
  
  // 背景透過設定
  safeAddEventListener('transparentBg', 'change', function() {
    params.transparentBg = this.checked;
  });
  
  // 保存ボタン
  safeAddEventListener('saveButton', 'click', saveHighResImage);
}

function saveHighResImage() {
  // 高解像度キャンバス作成
  let highResCanvas = createGraphics(params.outputWidth, params.outputHeight);
  
  // ピクセル密度を1に設定して正確なサイズにする
  highResCanvas.pixelDensity(1);
  
  if (params.transparentBg) {
    // 透過背景の場合：マスクを使用した正確な透過処理
    
    // 1. まず白背景で図形を描画
    highResCanvas.background(255);
    // 座標スケーリングをより正確に計算
    let scaleX = params.outputWidth / width;
    let scaleY = params.outputHeight / height;
    let centerX = params.outputWidth / 2 + (params.xPosition * scaleX);
    let centerY = params.outputHeight / 2 + (params.yPosition * scaleY);
    let scaledSize = params.shapeSize * scaleX;
    drawHighResShape(highResCanvas, centerX, centerY, scaledSize);
    
    // 2. マスク用キャンバスを作成（図形の形状を白で描画）
    let maskCanvas = createGraphics(params.outputWidth, params.outputHeight);
    maskCanvas.pixelDensity(1);
    maskCanvas.background(0); // 黒背景（透過部分）
    maskCanvas.fill(255); // 白で図形を描画（不透明部分）
    maskCanvas.noStroke();
    
    // マスク用の図形描画
    drawShapeMask(maskCanvas, centerX, centerY, scaledSize);
    
    // 3. マスクを適用してピクセル単位で透過処理
    applyTransparencyMask(highResCanvas, maskCanvas);
    
  } else {
    // 不透明背景の場合：従来通り
    highResCanvas.background(255);
    // 座標スケーリングをより正確に計算
    let scaleX = params.outputWidth / width;
    let scaleY = params.outputHeight / height;
    let centerX = params.outputWidth / 2 + (params.xPosition * scaleX);
    let centerY = params.outputHeight / 2 + (params.yPosition * scaleY);
    let scaledSize = params.shapeSize * scaleX;
    drawHighResShape(highResCanvas, centerX, centerY, scaledSize);
  }
  
  // ファイル保存
  let timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
  let filename = `gradient-art-${params.shape}-${timestamp}.png`;
  highResCanvas.save(filename);
}

function drawHighResShape(graphics, x, y, size) {
  graphics.push();
  graphics.noStroke();
  
  let steps = Math.max(4000, size * 12); // 高解像度用により細かいステップ（大幅増加）
  let currentPalette = colorPalettes[params.colorPalette];
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    switch(params.shape) {
      case 'circle':
        // 円の高解像度描画
        let circleYPos = y - size/2 + (progress * size);
        let circleStripHeight = Math.max(0.5, size / steps); // プレビューと同じ最小高さ設定
        
        let distFromCenter = abs(circleYPos - y);
        if (distFromCenter < size/2) {
          let circleWidth = 2 * sqrt((size/2) * (size/2) - distFromCenter * distFromCenter);
          
          // 色の補間（座標を渡してディザリング）
          let circleColor = interpolateColor(currentPalette, gradProgress, x, circleYPos);
          graphics.fill(circleColor.r, circleColor.g, circleColor.b);
          
          graphics.rect(x - circleWidth/2, circleYPos, circleWidth, circleStripHeight);
        }
        break;
        
      case 'triangle':
        let triangleYPos = y - size/2 + (progress * size);
        let triangleWidth = (1 - progress) * size;
        let triangleStripHeight = Math.max(0.5, size / steps); // プレビューと同じ最小高さ設定
        if (triangleWidth > 0) {
          // 色の補間（座標を渡してディザリング）
          let triangleColor = interpolateColor(currentPalette, gradProgress, x, triangleYPos);
          graphics.fill(triangleColor.r, triangleColor.g, triangleColor.b);
          
          graphics.rect(x - triangleWidth/2, triangleYPos, triangleWidth, triangleStripHeight);
        }
        break;
        
      case 'rectangle':
        let rectYPos = y - size/2 + (progress * size);
        let rectStripHeight = Math.max(0.5, size / steps); // プレビューと同じ最小高さ設定
        
        // 色の補間（座標を渡してディザリング）
        let rectColor = interpolateColor(currentPalette, gradProgress, x, rectYPos);
        graphics.fill(rectColor.r, rectColor.g, rectColor.b);
        
        graphics.rect(x - size/2, rectYPos, size, rectStripHeight);
        break;
    }
  }
  
  graphics.pop();
}

// マスク用の図形描画（単色の白で図形の形状のみ）
function drawShapeMask(graphics, x, y, size) {
  graphics.push();
  graphics.fill(255); // 白で描画（不透明部分）
  graphics.noStroke();
  
  switch(params.shape) {
    case 'circle':
      graphics.circle(x, y, size);
      break;
    case 'triangle':
      graphics.triangle(x, y - size/2, x - size/2, y + size/2, x + size/2, y + size/2);
      break;
    case 'rectangle':
      graphics.rect(x - size/2, y - size/2, size, size);
      break;
  }
  
  graphics.pop();
}

// マスクを適用して透過処理を行う
function applyTransparencyMask(targetCanvas, maskCanvas) {
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

function windowResized() {
  // ウィンドウリサイズ時にキャンバスサイズを調整
  let canvasWidth = min(windowWidth * 0.6, 600);
  let canvasHeight = canvasWidth / aspectRatio;
  resizeCanvas(canvasWidth, canvasHeight);
}
