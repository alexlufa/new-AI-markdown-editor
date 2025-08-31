import React, { useState } from "react";
import {
  useCreateBlockNote,
  createReactInlineContentSpec,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteSchema, defaultInlineContentSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Upload, Download, Trash, Plus } from "lucide-react";
import { InlineButton } from "./components/InlineButton";
import "./App.css";
import "./styles/editor.css";

// 创建普通按钮的内联内容规范
const inlineButton = createReactInlineContentSpec(
  {
    type: "inlineButton",
    propSchema: {
      title: {
        default: "",
      },
    },
    content: "none",
    parse: {
      // 支持 Markdown 语法: [按钮文字]
      markdown: {
        match: /\[([^\]]+)\]/,
        parse: (match: RegExpMatchArray) => ({
          title: match[1],
        }),
      },
    },
  },
  {
    render: (props) => {
      return (
        <span
          style={{
            border: "none",
            background: "blue",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-block",
            margin: "0 2px",
          }}
        >
          <span>{props.inlineContent.props.title}</span>
        </span>
      );
    },
  }
);

// 创建包含自定义内联内容的schema
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    inlineButton,
    ...defaultInlineContentSpecs,
  },
});

function App() {
  const [documentName, setDocumentName] = useState("Untitled Document");

  // Create BlockNote editor with custom schema
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "image",
        props: {
          url: "https://cdn.midjourney.com/ec9e385d-0833-4234-bb1e-5ef438ada569/0_0.png",
          //   caption: "Midjourney Generated Image",
        },
      },
      {
        type: "heading",
        content: "Welcome to BlockNote Editor Prototype!",
      },

      {
        type: "paragraph",
        content: "This is a React rich text editor built with BlockNote.",
      },
      {
        type: "paragraph",
        content: "You can:",
      },
      {
        type: "bulletListItem",
        content: "Use / commands to create different types of blocks",
      },
      {
        type: "bulletListItem",
        content: "Drag and drop to rearrange blocks",
      },
      {
        type: "bulletListItem",
        content: "Use Tab and Shift+Tab for indentation",
      },
      {
        type: "bulletListItem",
        content: "Real-time collaborative editing",
      },
      {
        type: "paragraph",
        content: [
          "I enjoy working with ",
          {
            type: "inlineButton",
            props: {
              title: "Hector",
            },
          },
          " and ",
          {
            type: "inlineButton",
            props: {
              title: "BlockNote",
            },
          },
          "!",
        ],
      },
      {
        type: "paragraph",
        content: [
          "These are ",
          {
            type: "inlineButton",
            props: {
              title: "blue buttons",
            },
          },
          " embedded in the text!",
        ],
      },
    ],
  });

  const handleSave = async () => {
    try {
      // Save using BlockNote
      const blocks = await editor.topLevelBlocks;
      const data = JSON.stringify(
        {
          type: "blocknote",
          content: blocks,
          documentName,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      );

      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentName}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.type === "blocknote" && data.content) {
            try {
              // Try to load using BlockNote
              await editor.replaceBlocks(editor.topLevelBlocks, data.content);
              if (data.documentName) {
                setDocumentName(data.documentName);
              } else {
                setDocumentName(file.name.replace(".json", ""));
              }
            } catch (error) {
              console.log("BlockNote loading failed:", error);
              alert("Document loading failed, please check file format");
            }
          } else {
            alert(
              "File format not supported, please select a valid BlockNote document"
            );
          }
        } catch (error) {
          console.error("File loading failed:", error);
          alert("File format error, please select a valid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to clear all content?")) {
      try {
        // Clear using BlockNote
        await editor.replaceBlocks(editor.topLevelBlocks, []);
      } catch (error) {
        console.error("Clear failed:", error);
        alert("Clear failed, please try again");
      }
    }
  };

  // 使用 InlineButton 组件提供的功能
  const insertButton = async (text: string) => {
    // 这里可以调用 InlineButton 组件导出的工具函数
    // 或者直接使用组件的功能
    console.log("插入按钮功能已移至 InlineButton 组件");
  };

  return (
    <div className="container">
      <Card className="editor-card">
        <CardHeader className="header">
          <Input
            value={documentName}
            onChange={(event) => setDocumentName(event.currentTarget.value)}
            placeholder="Enter document name"
            className="document-name-input"
          />
          {/* <div className="button-group">
            <input
              type="file"
              accept=".json"
              onChange={handleLoad}
              style={{ display: "none" }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outline" asChild>
                <span>
                  <Upload size={16} className="mr-2" />
                  Load Document
                </span>
              </Button>
            </label>
            <Button variant="outline" onClick={handleSave}>
              <Download size={16} className="mr-2" />
              Save Document
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              <Trash size={16} className="mr-2" />
              Clear Content
            </Button>
            <Button
              onClick={async () => await insertButton("测试按钮")}
              variant="secondary"
            >
              <Plus size={16} className="mr-2" />
              Insert Button
            </Button>
            <Button onClick={testMarkdownParsing} variant="outline">
              Test Markdown
            </Button>
          </div> */}
        </CardHeader>

        <CardContent className="editor-content">
          <BlockNoteView editor={editor} />
          <InlineButton editor={editor} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
