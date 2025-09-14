import React, { useMemo } from "react";
import { DefaultReactSuggestionItem } from "@blocknote/react";
import { SlashMenuItem } from "./SlashMenuItem";
import "./SlashMenu.css";

interface SlashMenuProps {
  items: DefaultReactSuggestionItem[];
  selectedIndex: number;
  onItemClick: (item: DefaultReactSuggestionItem) => void;
  loadingState?: "loading" | "loaded" | "loading-initial";
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  items,
  selectedIndex,
  onItemClick,
  loadingState = "loaded",
}) => {
  const renderedItems = useMemo(() => {
    let currentGroup: string | undefined = undefined;
    const renderedItems: React.ReactNode[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 添加分组标签
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        renderedItems.push(
          <div key={`group-${currentGroup}`} className="slash-menu-group-label">
            {currentGroup}
          </div>
        );
      }

      // 添加菜单项
      renderedItems.push(
        <SlashMenuItem
          key={item.title}
          item={item}
          isSelected={i === selectedIndex}
          onClick={() => onItemClick(item)}
        />
      );
    }

    return renderedItems;
  }, [items, selectedIndex, onItemClick]);

  return (
    <div className="slash-menu">
      {renderedItems}
      {renderedItems.length === 0 && loadingState === "loaded" && (
        <div className="slash-menu-empty">没有找到匹配的项目</div>
      )}
      {loadingState === "loading" && (
        <div className="slash-menu-loading">加载中...</div>
      )}
    </div>
  );
};
