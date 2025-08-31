# InlineButton 组件

这个组件提供了在 BlockNote 编辑器中插入内联按钮的功能。

## 功能特性

- 自动检测 Markdown 语法 `[按钮文字]` 并转换为内联按钮
- 支持键盘事件监听（空格键和回车键触发）
- 提供工具函数 `insertInlineButton` 供外部调用

## 使用方法

### 1. 在组件中使用

```tsx
import { InlineButton } from "./components/InlineButton";

function App() {
  const editor = useCreateBlockNote({ schema });

  return (
    <div>
      <BlockNoteView editor={editor} />
      <InlineButton editor={editor} />
    </div>
  );
}
```

### 2. 直接调用工具函数

```tsx
import { insertInlineButton } from "./components/InlineButton";

// 在需要的地方插入按钮
await insertInlineButton(editor, "按钮文字");
```

### 3. Markdown 语法

在编辑器中输入 `[按钮文字]` 然后按空格键或回车键，会自动转换为内联按钮。

## 组件结构

- `InlineButton`: 主要的组件，提供自动检测和转换功能
- `insertInlineButton`: 工具函数，用于手动插入按钮

## 注意事项

- 组件不需要渲染任何 UI，只是提供功能
- 确保编辑器 schema 中包含了 `inlineButton` 的内联内容规范
- 组件会自动监听键盘事件，无需手动管理事件监听器
