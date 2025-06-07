// UI管理クラス
class UIManager {
  constructor(config) {
    this.config = config;
    this.displayElements = [
      { id: 'sizeValue', key: 'shapeSize' },
      { id: 'xPosValue', key: 'xPosition' },
      { id: 'yPosValue', key: 'yPosition' },
      { id: 'gradStartValue', key: 'gradientStart', format: 'decimal' },
      { id: 'gradEndValue', key: 'gradientEnd', format: 'decimal' },
      { id: 'gradOffsetValue', key: 'gradientOffset', format: 'decimal' },
      { id: 'outputWidthValue', key: 'outputWidth' },
      { id: 'outputHeightValue', key: 'outputHeight' }
    ];
  }
  
  // UIイベントリスナーの設定
  setupEventListeners() {
    this._setupShapeControls();
    this._setupPositionControls();
    this._setupGradientControls();
    this._setupOutputControls();
    this._setupSaveButton();
    
    // 初期表示値を更新
    this.updateDisplayValues();
  }
  
  // 表示値を更新
  updateDisplayValues() {
    this.displayElements.forEach(elem => {
      const element = document.getElementById(elem.id);
      if (element) {
        const value = this.config.getParam(elem.key);
        element.textContent = elem.format === 'decimal' ? value.toFixed(2) : value;
      }
    });
  }
  
  // 図形選択とカラーパレット設定
  _setupShapeControls() {
    this._safeAddEventListener('shapeSelect', 'change', (event) => {
      this.config.setParam('shape', event.target.value);
    });
    
    this._safeAddEventListener('colorPalette', 'change', (event) => {
      this.config.setParam('colorPalette', event.target.value);
    });
  }
  
  // 位置とサイズ設定
  _setupPositionControls() {
    this._safeAddEventListener('shapeSize', 'input', (event) => {
      this.config.setParam('shapeSize', event.target.value);
      this._updateDisplayValue('sizeValue', this.config.getParam('shapeSize'));
    });
    
    this._safeAddEventListener('xPosition', 'input', (event) => {
      this.config.setParam('xPosition', event.target.value);
      this._updateDisplayValue('xPosValue', event.target.value);
    });
    
    this._safeAddEventListener('yPosition', 'input', (event) => {
      this.config.setParam('yPosition', event.target.value);
      this._updateDisplayValue('yPosValue', event.target.value);
    });
  }
  
  // グラデーション設定
  _setupGradientControls() {
    this._safeAddEventListener('gradientStart', 'input', (event) => {
      this.config.setParam('gradientStart', event.target.value);
      this._updateDisplayValue('gradStartValue', this.config.getParam('gradientStart').toFixed(2));
    });
    
    this._safeAddEventListener('gradientEnd', 'input', (event) => {
      this.config.setParam('gradientEnd', event.target.value);
      this._updateDisplayValue('gradEndValue', this.config.getParam('gradientEnd').toFixed(2));
    });
    
    this._safeAddEventListener('gradientLoop', 'change', (event) => {
      this.config.setParam('gradientLoop', event.target.checked);
    });
    
    this._safeAddEventListener('gradientReverse', 'change', (event) => {
      this.config.setParam('gradientReverse', event.target.checked);
    });
    
    this._safeAddEventListener('gradientOffset', 'input', (event) => {
      this.config.setParam('gradientOffset', event.target.value);
      this._updateDisplayValue('gradOffsetValue', this.config.getParam('gradientOffset').toFixed(2));
    });
    
    this._safeAddEventListener('gradientInvert', 'change', (event) => {
      this.config.setParam('gradientInvert', event.target.checked);
    });
    
    this._safeAddEventListener('previewBg', 'change', (event) => {
      this.config.setParam('previewBg', event.target.value);
    });
  }
  
  // 出力設定
  _setupOutputControls() {
    this._safeAddEventListener('outputWidth', 'input', (event) => {
      this.config.setParam('outputWidth', event.target.value);
      this._updateDisplayValue('outputWidthValue', this.config.getParam('outputWidth'));
    });
    
    this._safeAddEventListener('outputHeight', 'input', (event) => {
      this.config.setParam('outputHeight', event.target.value);
      this._updateDisplayValue('outputHeightValue', this.config.getParam('outputHeight'));
    });
    
    this._safeAddEventListener('transparentBg', 'change', (event) => {
      this.config.setParam('transparentBg', event.target.checked);
    });
  }
  
  // 保存ボタン設定
  _setupSaveButton() {
    this._safeAddEventListener('saveButton', 'click', () => {
      // 保存イベントを発火（メインアプリケーションで処理）
      this._dispatchCustomEvent('save-image');
    });
  }
  
  // 安全なイベントリスナー追加
  _safeAddEventListener(id, event, callback) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener(event, callback);
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }
  
  // 表示値の更新
  _updateDisplayValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }
  
  // カスタムイベントの発火
  _dispatchCustomEvent(eventName, detail = null) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
} 