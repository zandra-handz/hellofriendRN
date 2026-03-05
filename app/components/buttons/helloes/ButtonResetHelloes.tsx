import React from "react";
import { Alert, StyleSheet, Pressable } from "react-native";
import { useRemixUpcomingHelloes } from "@/src/hooks/useRemixUpcomingHelloes";
import SvgIcon from "@/app/styles/SvgIcons";
import { useLDTheme } from "@/src/context/LDThemeContext";
import OptionNoToggle from "../../headers/OptionNoToggle";

type Props = {
  userId: number;
  iconSize?: number;
};

const ButtonResetHelloes = ({ userId, iconSize = 16 }: Props) => {
  const { theme } = useLDTheme();
  const isDark = theme === "dark";

  const { handleRemixAllNextHelloes } =
    useRemixUpcomingHelloes({ userId });

  const handleOnPress = () => {
    Alert.alert(
      "Warning!",
      "Reset all suggested hello dates? (You can run this reset three times a day.)",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => handleRemixAllNextHelloes() },
      ]
    );
  };

  const borderColor = isDark
    ? "rgba(255,255,255,0.15)"
    : "rgba(0,0,0,0.15)";

  const iconColor = isDark
    ? "rgba(255,255,255,0.85)"
    : "rgba(0,0,0,0.85)";

  return (
    <Pressable
      onPress={handleOnPress}
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
      <SvgIcon
        name="refresh"
        size={iconSize}
        color={iconColor}
      />
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

export default ButtonResetHelloes;