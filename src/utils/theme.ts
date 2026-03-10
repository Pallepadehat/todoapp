import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    background: "#f2f2f7",
    card: "#ffffff",
    cardCompleted: "#F9F9FB",
    text: "#000000",
    textSecondary: "#8E8E93",
    border: "#C6C6C8",
    borderLight: "rgba(0,0,0,0.1)",
    primary: "#007AFF",
    primaryLight: "rgba(0,122,255,0.1)",
    primaryDisabled: "transparent",
    disabled: "#C7C7CC",
    disabledText: "#666666",
    error: "#FF3B30",
    warning: "#FF9500",
    success: "#34C759",
    avatarBackground: "#D1D1D6",
    avatarText: "#3C3C43",
    skeleton: "#e0e0e0",
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
  dark: {
    background: "#000000",
    card: "#1C1C1E",
    cardCompleted: "#111111", // slightly darker than card
    text: "#ffffff",
    textSecondary: "#8E8E93",
    border: "#38383A",
    borderLight: "rgba(255,255,255,0.1)",
    primary: "#0A84FF",
    primaryLight: "rgba(10,132,255,0.2)",
    primaryDisabled: "transparent",
    disabled: "#555555",
    disabledText: "#999999",
    error: "#FF453A",
    warning: "#FF9F0A",
    success: "#32D74B",
    avatarBackground: "#3A3A3C",
    avatarText: "#EBEBF5",
    skeleton: "#2C2C2E",
    white: "#ffffff", // for text that should always be white, e.g. delete button icon
    black: "#000000",
    transparent: "transparent",
  },
};

export type ThemeColors = typeof Colors.light;

export function useThemeColor() {
  const theme = useColorScheme();
  return Colors[theme === "dark" ? "dark" : "light"];
}

export function useIsDarkTheme() {
  return useColorScheme() === "dark";
}
