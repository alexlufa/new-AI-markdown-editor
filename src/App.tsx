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
} from "@blocknote/react";
import "./App.css";
import "./styles/editor.css";
import { DivBlockSpec, createDivBlockMenuItems } from "./components/DivBlock";
import { SlashMenuController } from "./components/SlashMenuController";
import { CustomSideMenu } from "./components/SideMenu";
import { SideMenuController } from "@blocknote/react";

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
        type: "div",
        props: {
          background:
            "https://cdn.midjourney.com/413fb91d-f5a7-4628-8d7a-1140d160cb00/0_0.png",
          height: "200px",
          textAlignment: "center",
          textColor: "#ffffff",
        },
      },
      {
        type: "paragraph",
        content: "这是一个默认的黑色 Div Block。",
      },
    ],
  });

  // 使用 React 组件渲染编辑器实例
  return (
    <div className="app-container">
      <div className="editor-container" style={{ position: "relative" }}>
        <BlockNoteView editor={editor} slashMenu={false} sideMenu={false}>
          <SideMenuController
            sideMenu={(props: any) => <CustomSideMenu {...props} />}
          />
          <SlashMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
            editor={editor}
          />
        </BlockNoteView>
      </div>
    </div>
  );
}
