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

// カラー補間のヘルパー関数
function interpolateColor(palette, gradProgress) {
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
  
  let r = lerp(startColor[0], endColor[0], gradProgress);
  let g = lerp(startColor[1], endColor[1], gradProgress);
  let b = lerp(startColor[2], endColor[2], gradProgress);
  
  // 色値も0-255の範囲でクランプ
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return { r, g, b };
}

function drawGradientCircle(x, y, size) {
  let steps = 100;
  let currentPalette = colorPalettes[params.colorPalette];
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 色の補間
    let color = interpolateColor(currentPalette, gradProgress);
    fill(color.r, color.g, color.b);
    
    // 円の描画（上から下へのグラデーション）
    let yStart = y - size/2 + (progress * size);
    let yEnd = y - size/2 + ((progress + 1/steps) * size);
    
    // 各段階で円の幅を計算
    for (let py = yStart; py < yEnd; py += 1) {
      let distFromCenter = abs(py - y);
      if (distFromCenter < size/2) {
        let circleWidth = 2 * sqrt((size/2) * (size/2) - distFromCenter * distFromCenter);
        rect(x - circleWidth/2, py, circleWidth, 1);
      }
    }
  }
}

function drawGradientTriangle(x, y, size) {
  let steps = 100;
  let currentPalette = colorPalettes[params.colorPalette];
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 色の補間
    let color = interpolateColor(currentPalette, gradProgress);
    fill(color.r, color.g, color.b);
    
    // 三角形の描画（上から下へのグラデーション）
    let yPos = y - size/2 + (progress * size);
    let triangleWidth = (1 - progress) * size;
    
    if (triangleWidth > 0) {
      rect(x - triangleWidth/2, yPos, triangleWidth, size/steps);
    }
  }
}

function drawGradientRectangle(x, y, size) {
  let steps = 100;
  let currentPalette = colorPalettes[params.colorPalette];
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 色の補間
    let color = interpolateColor(currentPalette, gradProgress);
    fill(color.r, color.g, color.b);
    
    // 四角形の描画（上から下へのグラデーション）
    let yPos = y - size/2 + (progress * size);
    rect(x - size/2, yPos, size, size/steps);
  }
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
  
  // 背景設定（保存用）
  if (!params.transparentBg) {
    highResCanvas.background(255); // 白背景
  } else {
    highResCanvas.clear(); // 透過背景
  }
  
  // 高解像度での図形描画
  let centerX = params.outputWidth / 2 + (params.xPosition * params.outputWidth / width);
  let centerY = params.outputHeight / 2 + (params.yPosition * params.outputHeight / height);
  let scaledSize = params.shapeSize * (params.outputWidth / width);
  
  drawHighResShape(highResCanvas, centerX, centerY, scaledSize);
  
  // ファイル保存
  let timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
  let filename = `gradient-art-${params.shape}-${timestamp}.png`;
  highResCanvas.save(filename);
}

function drawHighResShape(graphics, x, y, size) {
  graphics.push();
  graphics.noStroke();
  
  let steps = 200; // 高解像度用により細かいステップ
  let currentPalette = colorPalettes[params.colorPalette];
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    let gradProgress = calculateGradientProgress(progress);
    
    // 色の補間
    let color = interpolateColor(currentPalette, gradProgress);
    graphics.fill(color.r, color.g, color.b);
    
    switch(params.shape) {
      case 'circle':
        // 円の高解像度描画
        let yStart = y - size/2 + (progress * size);
        let yEnd = y - size/2 + ((progress + 1/steps) * size);
        
        for (let py = yStart; py < yEnd; py += 1) {
          let distFromCenter = abs(py - y);
          if (distFromCenter < size/2) {
            let circleWidth = 2 * sqrt((size/2) * (size/2) - distFromCenter * distFromCenter);
            graphics.rect(x - circleWidth/2, py, circleWidth, 1);
          }
        }
        break;
        
      case 'triangle':
        let yPos = y - size/2 + (progress * size);
        let triangleWidth = (1 - progress) * size;
        if (triangleWidth > 0) {
          graphics.rect(x - triangleWidth/2, yPos, triangleWidth, size/steps);
        }
        break;
        
      case 'rectangle':
        let rectYPos = y - size/2 + (progress * size);
        graphics.rect(x - size/2, rectYPos, size, size/steps);
        break;
    }
  }
  
  graphics.pop();
}

function windowResized() {
  // ウィンドウリサイズ時にキャンバスサイズを調整
  let canvasWidth = min(windowWidth * 0.6, 600);
  let canvasHeight = canvasWidth / aspectRatio;
  resizeCanvas(canvasWidth, canvasHeight);
}
