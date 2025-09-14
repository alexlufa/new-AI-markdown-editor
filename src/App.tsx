import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import "./App.css";
import "./styles/editor.css";
import { DivBlockSpec, createDivBlockMenuItems } from "./components/DivBlock";

// 创建包含自定义 Div Block 的 schema
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // 包含所有默认块
    ...defaultBlockSpecs,
    // 添加自定义 Div Block
    div: DivBlockSpec,
  },
});

// 获取所有 Slash Menu 项目（包括默认的和自定义的）
const getCustomSlashMenuItems = (editor: typeof schema.BlockNoteEditor) => [
  ...getDefaultReactSlashMenuItems(editor),
  ...createDivBlockMenuItems(editor),
];

export default function App() {
  // 创建一个新的编辑器实例，使用自定义 schema
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "欢迎使用 BlockNote 编辑器！",
      },
      {
        type: "paragraph",
        content:
          "按 '/' 键打开 Slash Menu，然后输入 'div'、'红色'、'蓝色' 或 '高' 来插入不同类型的 Div Block！",
      },
      {
        type: "div",
        props: {
          backgroundColor: "#000000",
          height: "100px",
          textAlignment: "center",
          textColor: "#ffffff",
        },
      },
      {
        type: "paragraph",
        content: "这是一个默认的黑色 Div Block。",
      },
      {
        type: "div",
        props: {
          backgroundColor: "#ff0000",
          height: "100px",
          textAlignment: "center",
          textColor: "#ffffff",
        },
      },
      {
        type: "paragraph",
        content: "这是一个红色 Div Block。",
      },
      {
        type: "paragraph",
        content: "试试在下面输入 '/' 然后选择不同的 Div Block 选项来添加更多！",
      },
    ],
  });

  // 使用 React 组件渲染编辑器实例
  return (
    <div className="app-container">
      <div className="editor-container">
        <BlockNoteView editor={editor} slashMenu={false}>
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
          />
        </BlockNoteView>
      </div>
    </div>
  );
}
