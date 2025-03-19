import { useState } from "react";

interface SubtitleStyle {
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  position: "bottom" | "top" | "middle";
  outline: boolean;
  outlineColor: string;
  fontFamily: string;
}

const defaultStyles: SubtitleStyle = {
  fontSize: "1.5rem",
  fontColor: "#FFFFFF",
  backgroundColor: "transparent",
  position: "bottom",
  outline: true,
  outlineColor: "#000000",
  fontFamily: "Arial, sans-serif",
};

export function useSubtitleStyles(isPro: boolean = false) {
  const [subtitleStyles, setSubtitleStyles] =
    useState<SubtitleStyle>(defaultStyles);

  const updateStyle = <K extends keyof SubtitleStyle>(
    key: K,
    value: SubtitleStyle[K],
  ) => {
    if (!isPro && key !== "position") {
      return false; // Only allow position change in free mode
    }
    setSubtitleStyles((prev) => ({
      ...prev,
      [key]: value,
    }));
    return true;
  };

  const resetStyles = () => {
    setSubtitleStyles(defaultStyles);
  };

  const getStyleObject = () => {
    const styles: Record<string, string> = {
      fontSize: subtitleStyles.fontSize,
      color: subtitleStyles.fontColor,
      backgroundColor: subtitleStyles.backgroundColor,
      fontFamily: subtitleStyles.fontFamily,
    };

    if (subtitleStyles.outline) {
      styles.textShadow = `
        -1px -1px 0 ${subtitleStyles.outlineColor},
        1px -1px 0 ${subtitleStyles.outlineColor},
        -1px 1px 0 ${subtitleStyles.outlineColor},
        1px 1px 0 ${subtitleStyles.outlineColor}
      `;
    }

    return styles;
  };

  const getPositionClass = () => {
    switch (subtitleStyles.position) {
      case "top":
        return "top-[10%]";
      case "middle":
        return "top-1/2 -translate-y-1/2";
      case "bottom":
      default:
        return "bottom-[10%]";
    }
  };

  return {
    subtitleStyles,
    updateStyle,
    resetStyles,
    getStyleObject,
    getPositionClass,
  };
}
