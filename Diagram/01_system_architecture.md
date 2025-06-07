# リファクタリング後システム構成図

## 概要
このシステム構成図は、Blue Gradient Generatorのリファクタリング後のモジュール構成と依存関係を示しています。

## Mermaidコード

```mermaid
graph TD
    subgraph "p5.js エントリーポイント"
        A["sketch.js<br/>• setup()<br/>• draw()<br/>• windowResized()"]
    end
    
    subgraph "メインアプリケーション"
        B["GradientArtApp<br/>• initialize()<br/>• render()<br/>• saveImage()<br/>• handleWindowResize()"]
    end
    
    subgraph "設定管理"
        C["Config<br/>• params<br/>• colorPalettes<br/>• constants<br/>• getParam()<br/>• setParam()<br/>• validateParam()"]
    end
    
    subgraph "UI管理"
        D["UIManager<br/>• setupEventListeners()<br/>• updateDisplayValues()<br/>• _setupShapeControls()<br/>• _setupGradientControls()"]
    end
    
    subgraph "グラデーション処理"
        E["GradientUtils<br/>• calculateGradientProgress()<br/>• interpolateColor()<br/>• _applyDithering()"]
    end
    
    subgraph "図形描画"
        F["ShapeRenderer<br/>• drawShape()<br/>• _drawCircle()<br/>• _drawTriangle()<br/>• _drawRectangle()<br/>• drawShapeMask()"]
    end
    
    subgraph "画像出力"
        G["ImageExporter<br/>• saveHighResImage()<br/>• _renderWithTransparency()<br/>• _applyTransparencyMask()"]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    D --> C
    E --> C
    F --> C
    F --> E
    G --> C
    G --> F
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fce4ec
    style F fill:#e0f2f1
    style G fill:#fff8e1
```

## 構成要素

- **sketch.js**: p5.jsのエントリーポイント、最小限のコード
- **GradientArtApp**: メインアプリケーションクラス、全体統制
- **Config**: 設定管理、パラメータ検証
- **UIManager**: ユーザーインターフェース管理
- **GradientUtils**: グラデーション計算とカラー処理
- **ShapeRenderer**: 図形描画ロジック
- **ImageExporter**: 高解像度画像出力 