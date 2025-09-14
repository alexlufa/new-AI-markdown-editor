import {
  SideMenu,
  SideMenuProps,
  useComponentsContext,
} from "@blocknote/react";

// 自定义的 Add Block 按钮，点击时触发 Slash Menu
export function AddBlockButton(props: SideMenuProps) {
  const Components = useComponentsContext()!;

  const handleAddBlockClick = () => {
    // 触发自定义事件来打开 Slash Menu
    const event = new CustomEvent("triggerSlashMenu", {
      detail: { blockId: props.block.id },
    });
    document.dispatchEvent(event);
  };

  return (
    <Components.SideMenu.Button
      label="Add block"
      icon={
        <div
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handleAddBlockClick}
        >
          +
        </div>
      }
    />
  );
}

// 自定义的 Side Menu 组件
export function CustomSideMenu(props: SideMenuProps) {
  return (
    <SideMenu {...props}>
      <AddBlockButton {...props} />
    </SideMenu>
  );
}
