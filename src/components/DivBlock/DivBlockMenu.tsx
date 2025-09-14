import { insertOrUpdateBlock } from "@blocknote/core";
import { DefaultReactSuggestionItem } from "@blocknote/react";

// DivBlock 的默认配置 - 使用正确的类型
export const DEFAULT_DIV_BLOCK_PROPS = {
  backgroundColor: "#000000" as const,
  height: "200px" as const,
  textAlignment: "center" as const,
  textColor: "#ffffff" as const,
};

// 创建 Div Block 的 Slash Menu 项目
export const createDivBlockMenuItem = (editor: any) => ({
  title: "插入 Div 块",
  onItemClick: () =>
    insertOrUpdateBlock(editor, {
      type: "div",
      props: DEFAULT_DIV_BLOCK_PROPS as any,
    }),
  aliases: ["div", "divblock", "div-block", "黑色块", "div块"],
  group: "自定义块",
  subtext: "插入一个自定义的 Div 块，背景为黑色，高度为 100px",
});

// 创建不同配置的 Div Block 菜单项
export const createDivBlockMenuItems = (
  editor: any
): DefaultReactSuggestionItem[] => [
  // 默认黑色块
  createDivBlockMenuItem(editor),
];
