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

function drawGradientCircle(x, y, size) {
  let steps = 100;
  let currentPalette = colorPalettes[params.colorPalette];
  
  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);
    
    // グラデーション範囲の調整
    let gradProgress;
    if (progress < params.gradientStart || progress > params.gradientEnd) {
      if (params.gradientLoop) {
        // ループモード：範囲外でも継続的にループ
        let range = params.gradientEnd - params.gradientStart;
        let normalizedProgress = (progress - params.gradientStart) / range;
        gradProgress = normalizedProgress - Math.floor(normalizedProgress);
      } else {
        // 非ループモード：範囲外は端の色を使用
        gradProgress = progress < params.gradientStart ? 0 : 1;
      }
    } else {
      // 範囲内：線形マッピング
      gradProgress = (progress - params.gradientStart) / (params.gradientEnd - params.gradientStart);
    }
    
    // 色の補間
    let r = lerp(currentPalette.start[0], currentPalette.end[0], gradProgress);
    let g = lerp(currentPalette.start[1], currentPalette.end[1], gradProgress);
    let b = lerp(currentPalette.start[2], currentPalette.end[2], gradProgress);
    
    fill(r, g, b);
    
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
    
    // グラデーション範囲の調整
    let gradProgress;
    if (progress < params.gradientStart || progress > params.gradientEnd) {
      if (params.gradientLoop) {
        // ループモード：範囲外でも継続的にループ
        let range = params.gradientEnd - params.gradientStart;
        let normalizedProgress = (progress - params.gradientStart) / range;
        gradProgress = normalizedProgress - Math.floor(normalizedProgress);
      } else {
        // 非ループモード：範囲外は端の色を使用
        gradProgress = progress < params.gradientStart ? 0 : 1;
      }
    } else {
      // 範囲内：線形マッピング
      gradProgress = (progress - params.gradientStart) / (params.gradientEnd - params.gradientStart);
    }
    
    // 色の補間
    let r = lerp(currentPalette.start[0], currentPalette.end[0], gradProgress);
    let g = lerp(currentPalette.start[1], currentPalette.end[1], gradProgress);
    let b = lerp(currentPalette.start[2], currentPalette.end[2], gradProgress);
    
    fill(r, g, b);
    
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
    
    // グラデーション範囲の調整
    let gradProgress;
    if (progress < params.gradientStart || progress > params.gradientEnd) {
      if (params.gradientLoop) {
        // ループモード：範囲外でも継続的にループ
        let range = params.gradientEnd - params.gradientStart;
        let normalizedProgress = (progress - params.gradientStart) / range;
        gradProgress = normalizedProgress - Math.floor(normalizedProgress);
      } else {
        // 非ループモード：範囲外は端の色を使用
        gradProgress = progress < params.gradientStart ? 0 : 1;
      }
    } else {
      // 範囲内：線形マッピング
      gradProgress = (progress - params.gradientStart) / (params.gradientEnd - params.gradientStart);
    }
    
    // 色の補間
    let r = lerp(currentPalette.start[0], currentPalette.end[0], gradProgress);
    let g = lerp(currentPalette.start[1], currentPalette.end[1], gradProgress);
    let b = lerp(currentPalette.start[2], currentPalette.end[2], gradProgress);
    
    fill(r, g, b);
    
    // 四角形の描画（上から下へのグラデーション）
    let yPos = y - size/2 + (progress * size);
    rect(x - size/2, yPos, size, size/steps);
  }
}

function setupUI() {
  // 図形選択
  document.getElementById('shapeSelect').addEventListener('change', function() {
    params.shape = this.value;
  });
  
  // カラーパレット選択
  document.getElementById('colorPalette').addEventListener('change', function() {
    params.colorPalette = this.value;
  });
  
  // 図形サイズ
  document.getElementById('shapeSize').addEventListener('input', function() {
    params.shapeSize = parseInt(this.value);
    document.getElementById('sizeValue').textContent = this.value;
  });
  
  // X位置
  document.getElementById('xPosition').addEventListener('input', function() {
    params.xPosition = parseInt(this.value);
    document.getElementById('xPosValue').textContent = this.value;
  });
  
  // Y位置
  document.getElementById('yPosition').addEventListener('input', function() {
    params.yPosition = parseInt(this.value);
    document.getElementById('yPosValue').textContent = this.value;
  });
  
  // グラデーション開始
  document.getElementById('gradientStart').addEventListener('input', function() {
    params.gradientStart = parseFloat(this.value);
    document.getElementById('gradStartValue').textContent = this.value;
  });
  
  // グラデーション終了
  document.getElementById('gradientEnd').addEventListener('input', function() {
    params.gradientEnd = parseFloat(this.value);
    document.getElementById('gradEndValue').textContent = this.value;
  });
  
  // グラデーションループ
  document.getElementById('gradientLoop').addEventListener('change', function() {
    params.gradientLoop = this.checked;
  });
  
  // プレビュー背景
  document.getElementById('previewBg').addEventListener('change', function() {
    params.previewBg = this.value;
  });
  
  // 出力幅
  document.getElementById('outputWidth').addEventListener('input', function() {
    params.outputWidth = parseInt(this.value);
    document.getElementById('outputWidthValue').textContent = this.value;
  });
  
  // 出力高さ
  document.getElementById('outputHeight').addEventListener('input', function() {
    params.outputHeight = parseInt(this.value);
    document.getElementById('outputHeightValue').textContent = this.value;
  });
  
  // 背景透過設定
  document.getElementById('transparentBg').addEventListener('change', function() {
    params.transparentBg = this.checked;
  });
  
  // 保存ボタン
  document.getElementById('saveButton').addEventListener('click', saveHighResImage);
}

function saveHighResImage() {
  let currentPreviewBg = params.previewBg;
  
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
    
    // グラデーション範囲の調整
    let gradProgress;
    if (progress < params.gradientStart || progress > params.gradientEnd) {
      if (params.gradientLoop) {
        // ループモード：範囲外でも継続的にループ
        let range = params.gradientEnd - params.gradientStart;
        let normalizedProgress = (progress - params.gradientStart) / range;
        gradProgress = normalizedProgress - Math.floor(normalizedProgress);
      } else {
        // 非ループモード：範囲外は端の色を使用
        gradProgress = progress < params.gradientStart ? 0 : 1;
      }
    } else {
      // 範囲内：線形マッピング
      gradProgress = (progress - params.gradientStart) / (params.gradientEnd - params.gradientStart);
    }
    
    // 色の補間
    let r = lerp(currentPalette.start[0], currentPalette.end[0], gradProgress);
    let g = lerp(currentPalette.start[1], currentPalette.end[1], gradProgress);
    let b = lerp(currentPalette.start[2], currentPalette.end[2], gradProgress);
    
    graphics.fill(r, g, b);
    
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
