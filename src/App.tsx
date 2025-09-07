import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import "./App.css";
import "./styles/editor.css";

export default function App() {
  // 创建一个新的编辑器实例
  const editor = useCreateBlockNote();

  // 使用 React 组件渲染编辑器实例
  return (
    <div className="app-container">
      <div className="editor-container">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}
