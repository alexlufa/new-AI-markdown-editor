import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

// 创建自定义 Div Block 规范
export const DivBlockSpec = createReactBlockSpec(
  {
    type: "div",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      backgroundColor: {
        default: "#000000",
        values: [
          "#000000",
          "#ff0000",
          "#00ff00",
          "#0000ff",
          "#ffff00",
          "#ff00ff",
          "#00ffff",
        ],
      },
      height: {
        default: "100px",
        values: ["50px", "100px", "150px", "200px", "300px"],
      },
    },
    content: "none", // Div 块不包含内联内容
  },
  {
    render: (props) => {
      const { block } = props;
      const backgroundColor = block.props.backgroundColor || "#000000";
      const height = block.props.height || "100px";
      const textAlignment = block.props.textAlignment || "left";
      const textColor = block.props.textColor || "#ffffff";

      return (
        <div
          className="custom-div-block"
          style={{
            backgroundColor,
            height,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              textAlignment === "left"
                ? "flex-start"
                : textAlignment === "center"
                ? "center"
                : "flex-end",
            color: textColor,
            padding: "0 16px",
            borderRadius: "4px",
            margin: "8px 0",
            cursor: "pointer",
            userSelect: "none",
          }}
          contentEditable={false}
        >
          <span>
            Div Block - {backgroundColor} - {height}
          </span>
        </div>
      );
    },
    toExternalHTML: (props) => {
      const { block } = props;
      const backgroundColor = block.props.backgroundColor || "#000000";
      const height = block.props.height || "100px";
      const textAlignment = block.props.textAlignment || "left";
      const textColor = block.props.textColor || "#ffffff";

      return (
        <div
          style={{
            backgroundColor,
            height,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              textAlignment === "left"
                ? "flex-start"
                : textAlignment === "center"
                ? "center"
                : "flex-end",
            color: textColor,
            padding: "0 16px",
            borderRadius: "4px",
            margin: "8px 0",
          }}
        >
          <span>
            Div Block - {backgroundColor} - {height}
          </span>
        </div>
      );
    },
  }
);
