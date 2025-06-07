// グラデーション計算ユーティリティクラス
class GradientUtils {
  constructor(config) {
    this.config = config;
  }
  
  // グラデーション進行値を計算
  calculateGradientProgress(progress) {
    const params = this.config.params;
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
    
    let gradProgress = this._calculateProgressInRange(adjustedProgress, params, range);
    
    // 値を0-1の範囲でクランプ
    gradProgress = Math.max(0, Math.min(1, gradProgress));
    
    // 折り返しグラデーション処理
    if (params.gradientReverse) {
      // 0→1→0の山型グラデーション
      gradProgress = gradProgress <= 0.5 ? gradProgress * 2 : (1 - gradProgress) * 2;
    }
    
    return gradProgress;
  }
  
  // 範囲内での進行値を計算（プライベートメソッド）
  _calculateProgressInRange(adjustedProgress, params, range) {
    // グラデーション範囲のチェック
    if (adjustedProgress < params.gradientStart || adjustedProgress > params.gradientEnd) {
      if (params.gradientLoop) {
        // ループモード：範囲外でも継続的にループ
        let normalizedProgress = (adjustedProgress - params.gradientStart) / range;
        normalizedProgress = normalizedProgress - Math.floor(normalizedProgress);
        if (normalizedProgress < 0) {
          normalizedProgress += 1;
        }
        return normalizedProgress;
      } else {
        // 非ループモード：範囲外は端の色を使用
        return adjustedProgress < params.gradientStart ? 0 : 1;
      }
    } else {
      // 範囲内：線形マッピング
      return (adjustedProgress - params.gradientStart) / range;
    }
  }
  
  // カラー補間（改良されたディザリング付き）
  interpolateColor(palette, gradProgress, x = 0, y = 0) {
    // NaN や無効な値をチェック
    if (!isFinite(gradProgress)) {
      gradProgress = 0.5;
    }
    
    // 0-1の範囲にクランプ
    gradProgress = Math.max(0, Math.min(1, gradProgress));
    
    let startColor = palette.start;
    let endColor = palette.end;
    
    // カラー反転が有効な場合、開始色と終了色を入れ替え
    if (this.config.getParam('gradientInvert')) {
      startColor = palette.end;
      endColor = palette.start;
    }
    
    // 基本色の計算
    let baseR = lerp(startColor[0], endColor[0], gradProgress);
    let baseG = lerp(startColor[1], endColor[1], gradProgress);
    let baseB = lerp(startColor[2], endColor[2], gradProgress);
    
    // ディザリング処理を適用
    const ditheredColor = this._applyDithering(baseR, baseG, baseB, x, y);
    
    return ditheredColor;
  }
  
  // ディザリング処理（プライベートメソッド）
  _applyDithering(baseR, baseG, baseB, x, y) {
    const ditherStrength = 2.0; // ディザリング強度
    
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
} 