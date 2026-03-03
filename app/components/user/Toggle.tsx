// Toggle.tsx
import { Text, StyleSheet, Pressable, View } from "react-native";
import React, { useMemo } from "react";
import ToggleButton from "../appwide/button/ToggleButton";
import { useLDTheme } from "@/src/context/LDThemeContext";

interface Props {
  label: string;
  icon?: React.ReactElement;
  value: boolean;
  onPress: () => void;
  primaryColor?: string;
  backgroundColor?: string;

  // Optional: if you want to reuse the exact modal button styling
  // without hardcoding in this file
  buttonPadding?: number; // matches BUTTON_PADDING in GoOptionsModal (default 4)
}

const Toggle: React.FC<Props> = ({
  label,
  icon,
  value,
  onPress,
  primaryColor,
  backgroundColor,
  buttonPadding = 4,
}) => {
  const { theme } = useLDTheme();
  const isDark = theme === "dark";

  // Match your modal button language:
  // - outer container = "button"
  // - inner label area = "text" with its own padding & radius
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

  const textColor = isDark ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.78)";
  const textColorActive = isDark
    ? "rgba(255,255,255,0.95)"
    : "rgba(0,0,0,0.95)";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.buttonOuter,
        {
          padding: buttonPadding, // same idea as GoOptionsModal BUTTON_PADDING
          backgroundColor: rowOuterBg,
          borderColor,
        },
      ]}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      {/* Inner content area like your modal Text background */}
      <View style={[styles.inner, { backgroundColor: rowInnerBg }]}>
        <View style={styles.left}>
          {!!icon && <View style={styles.iconWrap}>{icon}</View>}

          <Text
            style={[
              styles.label,
              {
                color: value ? textColorActive : textColor,
                fontFamily: value ? "Poppins_700Bold" : "Poppins_400Regular",
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>

        {/* Make toggle feel like it “belongs” in a big button row */}
        <View style={styles.toggleWrap}>
          <ToggleButton
            textColor={primaryColor}
            backgroundColor={backgroundColor}
            value={value}
            onToggle={onPress}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // OUTER = like your GlobalPressable "button"
  buttonOuter: {
    width: "100%",
    borderRadius: 10, // matches GoOptionsModal button radius
    borderWidth: 1,
    marginVertical: 0,
  },

  // INNER = like your modal Text "pill" (padding + radius)
  inner: {
    borderRadius: 6, // matches GoOptionsModal text radius
    paddingVertical: 1, // matches GoOptionsModal text padding
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44, // gives consistent button height
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
    flexShrink: 1,
  },

  // Give the toggle a “slot” so the row feels balanced like your other buttons
  toggleWrap: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64, // keeps spacing consistent even if ToggleButton is small
    height: 28,   // visually aligns with the label line-height/padding
  },
});

export default Toggle;