import React, { useState, useEffect, useRef } from "react";
import { DefaultReactSuggestionItem } from "@blocknote/react";
import { SlashMenu } from "./SlashMenu";

interface SlashMenuControllerProps {
  triggerCharacter: string;
  getItems: (query: string) => Promise<DefaultReactSuggestionItem[]>;
  editor: any;
}

export const SlashMenuController: React.FC<SlashMenuControllerProps> = ({
  triggerCharacter,
  getItems,
  editor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<DefaultReactSuggestionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [loadingState, setLoadingState] = useState<
    "loading" | "loaded" | "loading-initial"
  >("loaded");
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 触发菜单打开的方法
  const triggerMenu = () => {
    // 先获取当前光标位置和 Block ID
    try {
      const cursorPos = editor?.getTextCursorPosition();
      if (cursorPos && cursorPos.block) {
        setCurrentBlockId(cursorPos.block.id);
        console.log("🎯 触发菜单，保存 Block ID:", cursorPos.block.id);
      }
    } catch (e) {
      console.log("❌ 获取 Block ID 时发生错误:", e);
    }

    updateMenuPosition();
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
    setLoadingState("loading-initial");
    getItems("").then((items) => {
      setItems(items);
      setLoadingState("loaded");
    });
  };

  // 检查光标是否还在当前 Block 中
  const checkCursorInCurrentBlock = () => {
    if (!editor || !currentBlockId) {
      return false;
    }

    try {
      const cursorPos = editor.getTextCursorPosition();
      if (cursorPos && cursorPos.block) {
        const isInCurrentBlock = cursorPos.block.id === currentBlockId;
        console.log("🔍 检查光标位置:", {
          currentBlockId,
          cursorBlockId: cursorPos.block.id,
          isInCurrentBlock,
        });
        return isInCurrentBlock;
      }
    } catch (e) {
      console.log("❌ 检查光标位置时发生错误:", e);
    }

    return false;
  };

  // 获取光标位置并更新菜单位置
  const updateMenuPosition = () => {
    console.log("🔍 开始更新菜单位置...");

    if (!editor) {
      console.log("❌ 编辑器不存在");
      return;
    }

    try {
      // 获取编辑器容器
      const editorContainer = document.querySelector(".bn-editor");
      if (!editorContainer) {
        console.log("❌ 找不到编辑器容器 .bn-editor");
        return;
      }

      const editorRect = editorContainer.getBoundingClientRect();
      console.log("📐 编辑器容器位置:", {
        top: editorRect.top,
        left: editorRect.left,
        width: editorRect.width,
        height: editorRect.height,
      });

      // 使用 BlockNote 的 getTextCursorPosition API 获取光标所在块
      let targetElement = editorContainer; // 默认使用编辑器容器

      try {
        console.log(
          "🔍 尝试通过 BlockNote getTextCursorPosition 获取光标位置..."
        );
        const cursorPos = editor.getTextCursorPosition();
        console.log("📋 getTextCursorPosition 返回值:", cursorPos);

        // 参考文档用法：直接打印光标所在块的ID
        if (cursorPos && cursorPos.block) {
          console.log("Cursor is in block:", cursorPos.block.id);
          console.log("Block type:", cursorPos.block.type);
          console.log("Block content:", cursorPos.block.content);

          // 保存当前 Block ID
          const blockId = cursorPos.block.id;
          setCurrentBlockId(blockId);
          // 修正：使用 data-id 而不是 data-node-id
          const blockIdSelector = `[data-id="${blockId}"]`;
          const foundElement = document.querySelector(blockIdSelector);

          console.log("🔍 通过块ID查找DOM元素:", {
            blockId: blockId,
            selector: blockIdSelector,
            found: !!foundElement,
            element: foundElement,
          });

          if (foundElement) {
            targetElement = foundElement;
            console.log("✅ 成功找到光标所在块对应的DOM元素");
          } else {
            console.log("❌ 无法通过块ID找到对应的DOM元素");

            // 如果通过ID找不到，尝试通过类型查找
            const blockType = cursorPos.block.type;
            const blockTypeSelector = `[data-node-type="${blockType}"]`;
            const typeElement = document.querySelector(blockTypeSelector);

            console.log("🔍 通过块类型查找DOM元素:", {
              blockType: blockType,
              selector: blockTypeSelector,
              found: !!typeElement,
              element: typeElement,
            });

            if (typeElement) {
              targetElement = typeElement;
              console.log("✅ 通过块类型找到DOM元素");
            }
          }
        } else {
          console.log("❌ 无法获取光标位置信息");
        }
      } catch (e) {
        console.log("❌ getTextCursorPosition 异常:", e);
      }

      console.log("🎯 最终目标元素:", targetElement);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        console.log("📐 目标元素位置:", {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        });

        // 计算菜单位置
        const menuHeight = 300;
        const menuWidth = 400;

        // 在目标元素下方显示菜单
        let top = rect.bottom - editorRect.top + 10; // 在块下方 10px
        let left = rect.left - editorRect.left;

        console.log("🧮 初始计算位置:", { top, left });
        console.log("📏 菜单尺寸:", { menuHeight, menuWidth });
        console.log("📏 编辑器尺寸:", {
          width: editorRect.width,
          height: editorRect.height,
        });

        // 边界检查 - 确保菜单不会超出编辑器容器
        const editorHeight = editorRect.height;
        const editorWidth = editorRect.width;

        // 如果菜单会超出编辑器底部，则显示在块的上方
        if (top + menuHeight > editorHeight) {
          const newTop = rect.top - editorRect.top - menuHeight - 10;
          console.log("⬆️ 菜单超出底部，调整到上方:", { oldTop: top, newTop });
          top = newTop;
        }

        // 如果菜单会超出编辑器右侧，则向左调整
        if (left + menuWidth > editorWidth) {
          const newLeft = editorWidth - menuWidth - 20;
          console.log("⬅️ 菜单超出右侧，向左调整:", { oldLeft: left, newLeft });
          left = newLeft;
        }

        // 确保不会超出编辑器左侧
        if (left < 20) {
          console.log("➡️ 菜单超出左侧，调整到最小位置:", {
            oldLeft: left,
            newLeft: 20,
          });
          left = 20;
        }

        const finalPosition = { top, left };
        console.log("🎯 最终菜单位置:", finalPosition);
        setPosition(finalPosition);
      } else {
        // 如果无法获取位置，使用编辑器中心位置
        const fallbackPosition = {
          top: editorRect.height / 2,
          left: editorRect.width / 2 - 200, // 菜单宽度的一半
        };
        console.log(
          "⚠️ 无法获取目标元素，使用编辑器中心位置:",
          fallbackPosition
        );
        setPosition(fallbackPosition);
      }
    } catch (error) {
      console.error("❌ 获取光标位置时发生错误:", error);
      // 如果无法获取位置，使用默认位置
      const defaultPosition = { top: 100, left: 100 };
      console.log("🔄 使用默认位置:", defaultPosition);
      setPosition(defaultPosition);
    }
  };

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === triggerCharacter) {
        // 先获取当前光标位置和 Block ID
        try {
          const cursorPos = editor?.getTextCursorPosition();
          if (cursorPos && cursorPos.block) {
            setCurrentBlockId(cursorPos.block.id);
            console.log("🎯 触发菜单，保存 Block ID:", cursorPos.block.id);
          }
        } catch (e) {
          console.log("❌ 获取 Block ID 时发生错误:", e);
        }

        updateMenuPosition();
        setIsOpen(true);
        setQuery("");
        setSelectedIndex(0);
        setLoadingState("loading-initial");
        getItems("").then((items) => {
          setItems(items);
          setLoadingState("loaded");
        });
      } else if (isOpen) {
        if (event.key === "Escape") {
          setIsOpen(false);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (items[selectedIndex]) {
            handleItemClick(items[selectedIndex]);
          }
        } else if (event.key === "Backspace") {
          const newQuery = query.slice(0, -1);
          setQuery(newQuery);
          setLoadingState("loading");
          getItems(newQuery).then((filteredItems) => {
            setItems(filteredItems);
            setSelectedIndex(0);
            setLoadingState("loaded");
          });
        } else if (event.key.length === 1) {
          const newQuery = query + event.key;
          setQuery(newQuery);
          setLoadingState("loading");
          getItems(newQuery).then((filteredItems) => {
            setItems(filteredItems);
            setSelectedIndex(0);
            setLoadingState("loaded");
          });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [triggerCharacter, isOpen, query, items, selectedIndex, getItems]);

  // 监听窗口滚动和大小变化，更新菜单位置
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      updateMenuPosition();
    };

    const handleResize = () => {
      updateMenuPosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, editor]);

  // 监听光标位置变化，检查是否还在当前 Block 中
  useEffect(() => {
    if (!isOpen || !editor) return;

    const checkCursorPosition = () => {
      if (!checkCursorInCurrentBlock()) {
        console.log("📝 光标不在当前 Block 中，关闭菜单");
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
        setCurrentBlockId(null);
      }
    };

    // 定期检查光标位置
    const interval = setInterval(checkCursorPosition, 100);

    // 监听键盘和鼠标事件
    const handleCursorChange = () => {
      setTimeout(checkCursorPosition, 10); // 稍微延迟以确保光标位置已更新
    };

    document.addEventListener("keydown", handleCursorChange);
    document.addEventListener("click", handleCursorChange);
    document.addEventListener("selectionchange", handleCursorChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleCursorChange);
      document.removeEventListener("click", handleCursorChange);
      document.removeEventListener("selectionchange", handleCursorChange);
    };
  }, [isOpen, editor, currentBlockId]);

  // 监听自定义的 Slash Menu 触发事件
  useEffect(() => {
    const handleTriggerSlashMenu = (event: CustomEvent) => {
      console.log(
        "➕ 自定义 Add Block 按钮被点击，触发 Slash Menu",
        event.detail
      );
      triggerMenu();
    };

    // 监听自定义事件
    document.addEventListener(
      "triggerSlashMenu",
      handleTriggerSlashMenu as EventListener
    );

    return () => {
      document.removeEventListener(
        "triggerSlashMenu",
        handleTriggerSlashMenu as EventListener
      );
    };
  }, [editor]);

  const handleItemClick = (item: DefaultReactSuggestionItem) => {
    if (item.onItemClick) {
      item.onItemClick();
    }
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
    setCurrentBlockId(null);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="slash-menu-wrapper"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <SlashMenu
        items={items}
        selectedIndex={selectedIndex}
        onItemClick={handleItemClick}
        loadingState={loadingState}
      />
    </div>
  );
};
