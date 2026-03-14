import React from "react";
import { StyleSheet, Pressable } from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
import { useLDTheme } from "@/src/context/LDThemeContext";

type Props = {
  onPress: () => void;
  iconSize?: number;
};

const ButtonTrash = ({ onPress, iconSize = 16 }: Props) => {
  const { theme } = useLDTheme();
  const isDark = theme === "dark";

  const borderColor = isDark
    ? "rgba(255,255,255,0.15)"
    : "rgba(0,0,0,0.15)";

  const iconColor = isDark
    ? "rgba(255,255,255,0.85)"
    : "rgba(0,0,0,0.85)";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderColor,
          backgroundColor: pressed
            ? "rgba(255,255,255,0.08)"
            : "transparent",
        },
      ]}
    >
      <SvgIcon name="cancel" size={iconSize} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});

export default ButtonTrash;