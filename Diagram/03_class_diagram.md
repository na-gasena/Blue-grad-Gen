# クラス図（詳細設計）

## 概要
このクラス図は、リファクタリング後の各クラスの詳細な構造と依存関係を示しています。

## Mermaidコード

```mermaid
classDiagram
    class Config {
        +Object params
        +Object colorPalettes
        +Object constants
        +getParam(key) Object
        +setParam(key, value) Boolean
        +validateParam(key, value) Object
        +getColorPalette(name) Object
        +updateParams(newParams) void
    }
    
    class GradientUtils {
        -Config config
        +calculateGradientProgress(progress) Number
        +interpolateColor(palette, gradProgress, x, y) Object
        -_calculateProgressInRange(adjustedProgress, params, range) Number
        -_applyDithering(baseR, baseG, baseB, x, y) Object
    }
    
    class ShapeRenderer {
        -Config config
        -GradientUtils gradientUtils
        -Object renderSettings
        +drawShape(graphics, x, y, size, isHighRes) void
        +drawShapeMask(graphics, x, y, size) void
        -_drawCircle(graphics, x, y, size, isHighRes) void
        -_drawTriangle(graphics, x, y, size, isHighRes) void
        -_drawRectangle(graphics, x, y, size, isHighRes) void
        -_calculateSteps(size, isHighRes) Number
    }
    
    class UIManager {
        -Config config
        -Array displayElements
        +setupEventListeners() void
        +updateDisplayValues() void
        -_setupShapeControls() void
        -_setupPositionControls() void
        -_setupGradientControls() void
        -_setupOutputControls() void
        -_setupSaveButton() void
        -_safeAddEventListener(id, event, callback) void
        -_updateDisplayValue(elementId, value) void
        -_dispatchCustomEvent(eventName, detail) void
    }
    
    class ImageExporter {
        -Config config
        -ShapeRenderer shapeRenderer
        +saveHighResImage(canvasWidth, canvasHeight) void
        -_calculateCoordinates(canvasWidth, canvasHeight, outputWidth, outputHeight) Object
        -_renderWithTransparency(canvas, coordinates) void
        -_renderOpaque(canvas, coordinates) void
        -_applyTransparencyMask(targetCanvas, maskCanvas) void
        -_generateFilename() String
    }
    
    class GradientArtApp {
        -Config config
        -GradientUtils gradientUtils
        -ShapeRenderer shapeRenderer
        -ImageExporter imageExporter
        -UIManager uiManager
        -Object canvas
        -Number canvasWidth
        -Number canvasHeight
        +initialize() void
        +render() void
        +saveImage() void
        +handleWindowResize() void
        -_setupCanvas() void
        -_setupUI() void
        -_setupEventListeners() void
        -_setBackground() void
        -_drawShape() void
    }
    
    GradientArtApp --> Config
    GradientArtApp --> GradientUtils
    GradientArtApp --> ShapeRenderer
    GradientArtApp --> ImageExporter
    GradientArtApp --> UIManager
    
    GradientUtils --> Config
    ShapeRenderer --> Config
    ShapeRenderer --> GradientUtils
    UIManager --> Config
    ImageExporter --> Config
    ImageExporter --> ShapeRenderer
```

## クラス詳細説明

### Config（設定管理）
- **役割**: アプリケーション全体の設定とパラメータ管理
- **主要機能**: 
  - パラメータの取得・設定・検証
  - カラーパレット管理
  - 定数定義
- **特徴**: 全てのクラスから参照される中心的な設定クラス

### GradientUtils（グラデーション計算）
- **役割**: グラデーション計算とカラー補間処理
- **主要機能**:
  - グラデーション進行値の計算
  - カラー補間とディザリング
  - ループ・反転・オフセット処理
- **特徴**: 数学的計算を担当する純粋な処理クラス

### ShapeRenderer（図形描画）
- **役割**: 各種図形の描画処理
- **主要機能**:
  - 円・三角形・四角形の描画
  - 高解像度レンダリング
  - マスク描画（透過処理用）
- **特徴**: p5.jsの描画機能を抽象化したレンダリングクラス

### UIManager（UI管理）
- **役割**: ユーザーインターフェースの制御
- **主要機能**:
  - イベントリスナーの設定
  - UI要素の値更新
  - 安全なDOM操作
- **特徴**: UIとロジックの分離を実現するインターフェースクラス

### ImageExporter（画像出力）
- **役割**: 高解像度画像の生成と保存
- **主要機能**:
  - 高解像度レンダリング
  - 透過背景処理
  - ファイル名生成と保存
- **特徴**: 複雑な画像処理を専門に扱うエクスポートクラス

### GradientArtApp（メインアプリケーション）
- **役割**: アプリケーション全体の統制と制御
- **主要機能**:
  - 各コンポーネントの初期化
  - 描画ループの管理
  - ウィンドウリサイズ対応
- **特徴**: 全てのクラスを統合する中央制御クラス

## 設計パターン

- **Facade Pattern**: GradientArtAppが複雑なサブシステムを隠蔽
- **Strategy Pattern**: ShapeRendererが図形描画の戦略を切り替え
- **Observer Pattern**: UIManagerがイベント駆動でConfig更新を通知
- **Dependency Injection**: 各クラスが必要な依存関係を注入で受け取り 