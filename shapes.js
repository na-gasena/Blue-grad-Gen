// 図形描画クラス
class ShapeRenderer {
  constructor(config, gradientUtils) {
    this.config = config;
    this.gradientUtils = gradientUtils;
    this.renderSettings = {
      minStripHeight: 0.5,
      baseSteps: 2000,
      stepMultiplier: 8,
      highResSteps: 4000,
      highResMultiplier: 12
    };
  }
  
  // メイン描画関数
  drawShape(graphics, x, y, size, isHighRes = false) {
    const shape = this.config.getParam('shape');
    
    graphics.push();
    graphics.noStroke();
    graphics.blendMode(NORMAL);
    
    switch (shape) {
      case 'circle':
        this._drawCircle(graphics, x, y, size, isHighRes);
        break;
      case 'triangle':
        this._drawTriangle(graphics, x, y, size, isHighRes);
        break;
      case 'rectangle':
        this._drawRectangle(graphics, x, y, size, isHighRes);
        break;
      default:
        console.warn(`未知の図形タイプ: ${shape}`);
    }
    
    graphics.pop();
  }
  
  // 円の描画
  _drawCircle(graphics, x, y, size, isHighRes) {
    const steps = this._calculateSteps(size, isHighRes);
    const palette = this.config.getColorPalette();
    
    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      const gradProgress = this.gradientUtils.calculateGradientProgress(progress);
      
      const yPos = y - size/2 + (progress * size);
      const stripHeight = Math.max(this.renderSettings.minStripHeight, size / steps);
      
      const distFromCenter = abs(yPos - y);
      if (distFromCenter < size/2) {
        const circleWidth = 2 * sqrt((size/2) * (size/2) - distFromCenter * distFromCenter);
        
        const color = this.gradientUtils.interpolateColor(palette, gradProgress, x, yPos);
        graphics.fill(color.r, color.g, color.b);
        
        graphics.rect(x - circleWidth/2, yPos, circleWidth, stripHeight);
      }
    }
  }
  
  // 三角形の描画
  _drawTriangle(graphics, x, y, size, isHighRes) {
    const steps = this._calculateSteps(size, isHighRes);
    const palette = this.config.getColorPalette();
    
    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      const gradProgress = this.gradientUtils.calculateGradientProgress(progress);
      
      const yPos = y - size/2 + (progress * size);
      const triangleWidth = (1 - progress) * size;
      const stripHeight = Math.max(this.renderSettings.minStripHeight, size / steps);
      
      if (triangleWidth > 0) {
        const color = this.gradientUtils.interpolateColor(palette, gradProgress, x, yPos);
        graphics.fill(color.r, color.g, color.b);
        
        graphics.rect(x - triangleWidth/2, yPos, triangleWidth, stripHeight);
      }
    }
  }
  
  // 四角形の描画
  _drawRectangle(graphics, x, y, size, isHighRes) {
    const steps = this._calculateSteps(size, isHighRes);
    const palette = this.config.getColorPalette();
    
    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      const gradProgress = this.gradientUtils.calculateGradientProgress(progress);
      
      const yPos = y - size/2 + (progress * size);
      const stripHeight = Math.max(this.renderSettings.minStripHeight, size / steps);
      
      const color = this.gradientUtils.interpolateColor(palette, gradProgress, x, yPos);
      graphics.fill(color.r, color.g, color.b);
      
      graphics.rect(x - size/2, yPos, size, stripHeight);
    }
  }
  
  // ステップ数を計算
  _calculateSteps(size, isHighRes) {
    if (isHighRes) {
      return Math.max(this.renderSettings.highResSteps, size * this.renderSettings.highResMultiplier);
    } else {
      return Math.max(this.renderSettings.baseSteps, size * this.renderSettings.stepMultiplier);
    }
  }
  
  // マスク用の図形描画（透過処理用）
  drawShapeMask(graphics, x, y, size) {
    const shape = this.config.getParam('shape');
    
    graphics.push();
    graphics.fill(255); // 白で描画（不透明部分）
    graphics.noStroke();
    
    switch (shape) {
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
} 