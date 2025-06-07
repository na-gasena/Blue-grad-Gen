// 設定管理クラス
class Config {
  constructor() {
    this.params = {
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
    
    this.colorPalettes = {
      'blue-white': { start: [0, 0, 255], end: [255, 255, 255] },
      'red-white': { start: [255, 0, 0], end: [255, 255, 255] },
      'green-white': { start: [0, 255, 0], end: [255, 255, 255] }
    };
    
    this.constants = {
      ASPECT_RATIO: 1 / 1.187,
      MIN_SHAPE_SIZE: 1,
      MAX_SHAPE_SIZE: 1000,
      MIN_OUTPUT_SIZE: 100,
      MAX_OUTPUT_SIZE: 10000,
      PIXEL_DENSITY: 2,
      CANVAS_WIDTH_RATIO: 0.6,
      MAX_CANVAS_WIDTH: 600
    };
  }
  
  // パラメータの取得
  getParam(key) {
    return this.params[key];
  }
  
  // パラメータの設定
  setParam(key, value) {
    if (this.params.hasOwnProperty(key)) {
      this.params[key] = this.validateParam(key, value);
      return true;
    }
    return false;
  }
  
  // パラメータの検証
  validateParam(key, value) {
    switch (key) {
      case 'shapeSize':
        return Math.max(this.constants.MIN_SHAPE_SIZE, 
                       Math.min(this.constants.MAX_SHAPE_SIZE, parseInt(value)));
      case 'xPosition':
      case 'yPosition':
        return parseInt(value);
      case 'gradientStart':
      case 'gradientEnd':
        return Math.max(0, Math.min(1, parseFloat(value)));
      case 'gradientOffset':
        return Math.max(-1, Math.min(1, parseFloat(value)));
      case 'outputWidth':
      case 'outputHeight':
        return Math.max(this.constants.MIN_OUTPUT_SIZE, 
                       Math.min(this.constants.MAX_OUTPUT_SIZE, parseInt(value)));
      default:
        return value;
    }
  }
  
  // カラーパレットの取得
  getColorPalette(name = null) {
    const paletteName = name || this.params.colorPalette;
    return this.colorPalettes[paletteName];
  }
  
  // 設定の一括更新
  updateParams(newParams) {
    Object.keys(newParams).forEach(key => {
      this.setParam(key, newParams[key]);
    });
  }
} 