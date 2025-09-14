import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

// 创建自定义 Div Block 规范
export const DivBlockSpec = createReactBlockSpec(
  {
    type: "div",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      background: {
        default:
          "https://cdn.midjourney.com/413fb91d-f5a7-4628-8d7a-1140d160cb00/0_0.png",
        // values: [
        //   "https://cdn.midjourney.com/413fb91d-f5a7-4628-8d7a-1140d160cb00/0_0.png",
        //   "#000000",
        //   "#ff0000",
        //   "#00ff00",
        //   "#0000ff",
        //   "#ffff00",
        //   "#ff00ff",
        //   "#00ffff",
        // ],
      },
      height: {
        default: "200px",
        // values: ["50px", "100px", "150px", "200px", "300px"],
      },
    },
    content: "none", // Div 块不包含内联内容
  },
  {
    render: (props) => {
      const { block } = props;
      const background =
        block.props.background ||
        "https://cdn.midjourney.com/413fb91d-f5a7-4628-8d7a-1140d160cb00/0_0.png";
      const height = block.props.height || "200px";
      const textAlignment = block.props.textAlignment || "left";
      const textColor = block.props.textColor || "#ffffff";

      // 判断是否为 URL（以 http 开头）
      const isUrl = background.startsWith("http");
      const backgroundStyle = isUrl
        ? {
            backgroundImage: `url(${background})`,
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
        : {
            backgroundColor: background,
          };

      return (
        <div
          className="custom-div-block"
          style={{
            ...backgroundStyle,
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
            borderRadius: "12px",
            margin: "8px 0",
            cursor: "pointer",
            userSelect: "none",
          }}
          contentEditable={false}
        >
          <div className="banner-title">Div Block</div>
        </div>
      );
    },
    toExternalHTML: (props) => {
      const { block } = props;
      const background =
        block.props.background ||
        "https://cdn.midjourney.com/413fb91d-f5a7-4628-8d7a-1140d160cb00/0_0.png";
      const height = block.props.height || "200px";
      const textAlignment = block.props.textAlignment || "left";
      const textColor = block.props.textColor || "#ffffff";

      // 判断是否为 URL（以 http 开头）
      const isUrl = background.startsWith("http");
      const backgroundStyle = isUrl
        ? {
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
        : {
            backgroundColor: background,
          };

      return (
        <div
          style={{
            ...backgroundStyle,
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
            borderRadius: "12px",
            margin: "8px 0",
          }}
        >
          <div className="banner-title">Div Block</div>
        </div>
      );
    },
  }
);
