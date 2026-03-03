import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useLDTheme } from "@/src/context/LDThemeContext";

interface Props {
  label: string;
  icon?: React.ReactElement;
  onPress: () => void;
}

const NoToggle: React.FC<Props> = ({ label, icon, onPress }) => {
  const { theme } = useLDTheme();
  const isDark = theme === "dark";

  const rowBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const borderColor = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const pressedBg = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? pressedBg : rowBg,
          borderColor,
        },
      ]}
    >
      <View style={styles.left}>
        {!!icon && <View style={styles.iconWrap}>{icon}</View>}

        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontFamily: "Poppins_500Medium",
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginVertical: 6,
    borderWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    marginRight: 12,
    opacity: 0.9,
  },
  label: {
    fontSize: 14,
    flexShrink: 1,
  },
});

export default NoToggle;