import React from "react";
import { DefaultReactSuggestionItem } from "@blocknote/react";
import "./SlashMenuItem.css";

interface SlashMenuItemProps {
  item: DefaultReactSuggestionItem;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export const SlashMenuItem: React.FC<SlashMenuItemProps> = ({
  item,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`slash-menu-item ${isSelected ? "selected" : ""} ${className}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="slash-menu-item-content">
        {item.icon && <div className="slash-menu-item-icon">{item.icon}</div>}

        <div className="slash-menu-item-text">
          <div className="slash-menu-item-title">{item.title}</div>
          {item.subtext && (
            <div className="slash-menu-item-subtitle">{item.subtext}</div>
          )}
        </div>

        {item.badge && (
          <div className="slash-menu-item-badge">{item.badge}</div>
        )}
      </div>
    </div>
  );
};
