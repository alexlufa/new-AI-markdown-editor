import React from "react";
import { BlockNoteEditor } from "@blocknote/core";

interface InlineButtonProps {
  editor: BlockNoteEditor<any, any, any>;
}

export const InlineButton: React.FC<InlineButtonProps> = ({ editor }) => {
  // 插入按钮功能
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

  // 这个组件不需要渲染任何 UI，只是提供功能
  return null;
};

// 导出工具函数，供外部使用
export const insertInlineButton = async (
  editor: BlockNoteEditor<any, any, any>,
  text: string
) => {
  const buttonContent = {
    type: "inlineButton" as const,
    props: { title: text },
  };

  try {
    editor.insertInlineContent([buttonContent as any]);
  } catch (error) {
    console.log("插入按钮失败:", error);
    try {
      const blocks = await editor.topLevelBlocks;
      if (blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
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
