import { insertOrUpdateBlock } from "@blocknote/core";
import { DefaultReactSuggestionItem } from "@blocknote/react";

// DivBlock 的默认配置
export const DEFAULT_DIV_BLOCK_PROPS = {
  backgroundColor: "#000000",
  height: "100px",
  textAlignment: "center" as const,
  textColor: "#ffffff",
};

// 创建 Div Block 的 Slash Menu 项目
export const createDivBlockMenuItem = (editor: any) => ({
  title: "插入 Div 块",
  onItemClick: () =>
    insertOrUpdateBlock(editor, {
      type: "div",
      props: DEFAULT_DIV_BLOCK_PROPS,
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

  // 红色块
  {
    title: "插入红色 Div 块",
    onItemClick: () =>
      insertOrUpdateBlock(editor, {
        type: "div",
        props: {
          ...DEFAULT_DIV_BLOCK_PROPS,
          backgroundColor: "#ff0000",
        },
      }),
    aliases: ["red", "红色", "red-div", "红色块"],
    group: "自定义块",
    subtext: "插入一个红色背景的 Div 块",
  },

  // 蓝色块
  {
    title: "插入蓝色 Div 块",
    onItemClick: () =>
      insertOrUpdateBlock(editor, {
        type: "div",
        props: {
          ...DEFAULT_DIV_BLOCK_PROPS,
          backgroundColor: "#0000ff",
        },
      }),
    aliases: ["blue", "蓝色", "blue-div", "蓝色块"],
    group: "自定义块",
    subtext: "插入一个蓝色背景的 Div 块",
  },

  // 高块
  {
    title: "插入高 Div 块",
    onItemClick: () =>
      insertOrUpdateBlock(editor, {
        type: "div",
        props: {
          ...DEFAULT_DIV_BLOCK_PROPS,
          height: "200px",
        },
      }),
    aliases: ["tall", "高", "tall-div", "高块"],
    group: "自定义块",
    subtext: "插入一个高度为 200px 的 Div 块",
  },
];
