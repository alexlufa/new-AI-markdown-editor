# DivBlock 组件

一个基于 BlockNote 的自定义 Div Block 组件，提供可配置的样式和 Slash Menu 集成。

## 功能特性

- 🎨 可配置的背景颜色
- 📏 可配置的高度
- 📝 可配置的文本对齐方式
- 🎯 可配置的文本颜色
- 🔍 Slash Menu 集成
- 📱 响应式设计
- ✨ 悬停和聚焦效果

## 文件结构

```text
DivBlock/
├── DivBlockSpec.tsx    # BlockNote 块规范定义
├── DivBlockMenu.tsx    # Slash Menu 配置
├── DivBlock.css        # 样式文件
├── index.ts           # 主要导出文件
└── README.md          # 说明文档
```

## 使用方法

### 1. 导入组件

```typescript
import { DivBlockSpec, createDivBlockMenuItems } from "./components/DivBlock";
```

### 2. 在 BlockNote Schema 中使用

```typescript
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    div: DivBlockSpec,
  },
});
```

### 3. 在 Slash Menu 中使用

```typescript
import { getDefaultReactSlashMenuItems } from "@blocknote/react";

const getCustomSlashMenuItems = (editor) => [
  ...getDefaultReactSlashMenuItems(editor),
  ...createDivBlockMenuItems(editor),
];
```

## 配置选项

### 默认配置

```typescript
const DEFAULT_DIV_BLOCK_PROPS = {
  backgroundColor: "#000000",
  height: "100px",
  textAlignment: "center",
  textColor: "#ffffff",
};
```

### 可用的背景颜色

- `#000000` - 黑色（默认）
- `#ff0000` - 红色
- `#00ff00` - 绿色
- `#0000ff` - 蓝色
- `#ffff00` - 黄色
- `#ff00ff` - 洋红色
- `#00ffff` - 青色

### 可用的高度

- `50px`
- `100px`（默认）
- `150px`
- `200px`
- `300px`

## Slash Menu 项目

组件提供了多个 Slash Menu 项目：

1. **插入 Div 块** - 默认黑色块
2. **插入红色 Div 块** - 红色背景
3. **插入蓝色 Div 块** - 蓝色背景
4. **插入高 Div 块** - 200px 高度

## 样式自定义

可以通过修改 `DivBlock.css` 文件来自定义样式：

```css
.custom-div-block {
  /* 自定义样式 */
}
```

## 响应式支持

组件支持响应式设计，在移动设备上会自动调整间距和填充。
