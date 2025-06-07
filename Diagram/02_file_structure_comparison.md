# リファクタリング前後のファイル構造比較

## 概要
このファイル構造比較図は、リファクタリング前の単一ファイルから、リファクタリング後の機能別分割ファイルへの変化を示しています。

## Mermaidコード

```mermaid
graph LR
    subgraph "リファクタリング前"
        A1["sketch_original.js<br/>579行 / 19KB<br/>全機能が1ファイルに集約"]
    end
    
    subgraph "リファクタリング後"
        B1["sketch.js<br/>23行 / 511B"]
        B2["app.js<br/>108行 / 3.2KB"]
        B3["config.js<br/>89行 / 2.4KB"]
        B4["ui.js<br/>150行 / 5.3KB"]
        B5["gradientUtils.js<br/>120行 / 4.6KB"]
        B6["shapes.js<br/>136行 / 4.4KB"]
        B7["imageExporter.js<br/>95行 / 3.5KB"]
        B8["index.html<br/>128行 / 4.2KB<br/>（スクリプト読み込み順序管理）"]
    end
    
    A1 -.->|"リファクタリング"| B1
    A1 -.->|"機能分割"| B2
    A1 -.->|"設定分離"| B3
    A1 -.->|"UI分離"| B4
    A1 -.->|"計算分離"| B5
    A1 -.->|"描画分離"| B6
    A1 -.->|"出力分離"| B7
    
    style A1 fill:#ffcdd2
    style B1 fill:#e1f5fe
    style B2 fill:#f3e5f5
    style B3 fill:#fff3e0
    style B4 fill:#e8f5e8
    style B5 fill:#fce4ec
    style B6 fill:#e0f2f1
    style B7 fill:#fff8e1
    style B8 fill:#f1f8e9
```

## 改善効果

### リファクタリング前の問題点
- **巨大なファイル**: 579行の単一ファイル
- **責任の混在**: 全機能が1箇所に集約
- **保守困難**: コードの理解・修正が困難
- **再利用不可**: モジュール化されていない

### リファクタリング後の利点
- **機能分離**: 各ファイルが明確な責任を持つ
- **適切なサイズ**: 100-150行程度の管理しやすいファイル
- **保守性向上**: 修正箇所の特定が容易
- **再利用可能**: モジュール単位での利用が可能

## ファイル詳細

| ファイル名 | 行数 | サイズ | 主な責任 |
|-----------|------|--------|----------|
| sketch.js | 23 | 511B | p5.jsエントリーポイント |
| app.js | 108 | 3.2KB | アプリケーション統制 |
| config.js | 89 | 2.4KB | 設定管理・検証 |
| ui.js | 150 | 5.3KB | UI制御・イベント処理 |
| gradientUtils.js | 120 | 4.6KB | グラデーション計算 |
| shapes.js | 136 | 4.4KB | 図形描画ロジック |
| imageExporter.js | 95 | 3.5KB | 画像出力・透過処理 | 