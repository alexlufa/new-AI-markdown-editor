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

  // 添加一个简单的按钮插入功能
  const insertButton = async (text: string) => {
    const buttonContent = {
      type: "inlineButton" as const,
      props: { title: text },
    };

    // 在当前光标位置插入按钮
    try {
      // 尝试直接插入按钮 - 需要包装在数组中
      editor.insertInlineContent([buttonContent as any]);
    } catch (error) {
      console.log("插入按钮失败:", error);
      // 尝试另一种方法：在段落末尾添加按钮
      try {
        // 获取所有顶级块
        const blocks = await editor.topLevelBlocks;
        if (blocks.length > 0) {
          const lastBlock = blocks[blocks.length - 1];
          // 在最后一个块的内容中添加按钮
          const newContent = [
            ...(Array.isArray(lastBlock.content) ? lastBlock.content : []),
            buttonContent as any,
          ].filter((item) => item !== "");

          await editor.updateBlock(lastBlock.id, {
            content: newContent,
          });
        }
      } catch (secondError) {
        console.log("备用方法也失败了:", secondError);
      }
    }
  };

  // 测试 Markdown 解析功能
  const testMarkdownParsing = () => {
    console.log("测试 Markdown 解析...");
    // 创建一个包含 Markdown 语法的测试内容
    const testContent = [
      {
        type: "paragraph",
        content: ["这是一个测试段落，包含 ", "[测试按钮]", " 语法。"],
      },
    ];

    console.log("测试内容:", testContent);
    // 这里我们可以测试 BlockNote 是否能自动解析 Markdown
  };

  // 简化的 Markdown 输入监听器
  React.useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      console.log("键盘事件触发:", event.key, event.target);

      // 当按下空格键或回车键时检查并转换
      if (event.key === " " || event.key === "Enter") {
        console.log("检测到空格或回车键，开始检查按钮语法...");

        // 延迟一点时间让输入完成
        setTimeout(async () => {
          try {
            console.log("开始检查编辑器内容...");

            // 直接从 DOM 获取当前文本内容
            const editorElement = document.querySelector(".ProseMirror");
            if (editorElement) {
              const currentText = editorElement.textContent || "";
              console.log("当前编辑器文本内容:", currentText);

              // 检查是否包含按钮语法
              const buttonMatch = currentText.match(/\[([^\]]+)\]/);
              if (buttonMatch) {
                const buttonText = buttonMatch[1];
                console.log("检测到按钮语法，准备转换:", buttonText);

                // 使用 insertButton 函数来插入按钮
                await insertButton(buttonText);

                // 替换掉用户输入的 [button] 文本
                try {
                  // 获取所有顶级块
                  const blocks = await editor.topLevelBlocks;
                  if (blocks.length > 0) {
                    const lastBlock = blocks[blocks.length - 1];

                    if (Array.isArray(lastBlock.content)) {
                      // 找到包含按钮语法的文本项并替换
                      const newContent = lastBlock.content
                        .map((item) => {
                          if (typeof item === "string") {
                            // 将 [button] 替换为空字符串
                            return (item as string).replace(
                              /\[([^\]]+)\]/g,
                              ""
                            );
                          }
                          return item;
                        })
                        .filter((item) => item !== ""); // 过滤掉空字符串

                      // 更新块内容
                      await editor.updateBlock(lastBlock.id, {
                        content: newContent,
                      });

                      console.log("文本替换完成！");
                    }
                  }
                } catch (error) {
                  console.log("文本替换失败:", error);
                }

                console.log("按钮转换成功！");
              } else {
                console.log("未检测到按钮语法");
              }
            } else {
              console.log("找不到编辑器元素");
            }
          } catch (error) {
            console.log("自动转换按钮失败:", error);
          }
        }, 300);
      }
    };

    // 监听键盘事件
    document.addEventListener("keydown", handleKeyDown, true);
    console.log("键盘事件监听器已添加");

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      console.log("键盘事件监听器已移除");
    };
  }, [editor]);

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
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
