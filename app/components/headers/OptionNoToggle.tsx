// OptionNoToggle.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, TextStyle } from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
type Props = {
  label: string;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  rightSlot?: React.ReactElement;
  icon?: React.ReactElement;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  buttonPadding?: number;
  onPress?: () => void;
  bold?: boolean;
};

const OptionNoToggle = ({
  label,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  rightSlot,
  iconName = `refresh`,
  iconSize = 20,
  iconColor = "orange",
  buttonPadding = 4,
  onPress,
  bold = false,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.button,
        { padding: buttonPadding, backgroundColor: buttonColor },
      ]}
      // android_ripple={onPress ? { color: "rgba(255,255,255,0.08)" } : undefined}
    
    >
      <View style={[styles.inner, { backgroundColor }]}>
        <View style={styles.left}>
          {!!iconName && (
            <View style={styles.iconWrap}>
              <SvgIcon name={iconName} size={iconSize} color={iconColor} />
            </View>
          )}
          <Text
            style={[
              textStyle,
              styles.label,
              {
                color: primaryColor,
                fontFamily: bold ? "Poppins_700Bold" : "Poppins_400Regular",
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
        {!!rightSlot && <View style={styles.rightSlot}>{rightSlot}</View>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
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
  },
  label: {
    flexShrink: 1,
  },
  rightSlot: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    height: 28,
  },
});

export default OptionNoToggle;
