import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import ButtonResetHelloes from "../../buttons/helloes/ButtonResetHelloes";

interface Props {
  userId: number;
  label: string;
  icon?: React.ReactElement;

  // keep consistent with Toggle
  buttonPadding?: number; // default 4
  onPressRow?: () => void; // optional: if you ever want row press
}

const Reset: React.FC<Props> = ({
  userId,
  label,
  icon,
  buttonPadding = 4,
  onPressRow,
}) => {
  const { theme } = useLDTheme();
  const isDark = theme === "dark";

  const rowOuterBg = useMemo(
    () => (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
    [isDark],
  );

  const rowInnerBg = useMemo(
    () => (isDark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.65)"),
    [isDark],
  );

  const borderColor = useMemo(
    () => (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"),
    [isDark],
  );

  const textColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";

  return (
    <Pressable
      onPress={onPressRow}
      disabled={!onPressRow} // keeps ripple/press only if you use it
      style={[
        styles.buttonOuter,
        {
          padding: buttonPadding,
          backgroundColor: rowOuterBg,
          borderColor,
        },
      ]}
      android_ripple={onPressRow ? { color: "rgba(255,255,255,0.08)" } : undefined}
    >
      <View style={[styles.inner, { backgroundColor: rowInnerBg }]}>
        <View style={styles.left}>
          {!!icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
            {label}
          </Text>
        </View>

        {/* same concept as Toggle's toggleWrap */}
        <View style={styles.actionWrap}>
          <ButtonResetHelloes userId={userId} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 0,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  iconWrap: {
    marginRight: 12,
    opacity: 0.95,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular", // match Toggle default
    flexShrink: 1,
  },
  actionWrap: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    height: 28,
  },
});

export default Reset;