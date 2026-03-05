import React from "react";
import { View, Text, Pressable, StyleSheet, TextStyle } from "react-native";
import ToggleButton from "../appwide/button/ToggleButton";

type Props = {
  label: string;
  value: boolean;
  onPress: () => void;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  icon?: React.ReactElement;
  buttonPadding?: number;
};

const OptionToggle = ({
  label,
  value,
  onPress,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  icon,
  buttonPadding = 4,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      <View style={[styles.inner, { backgroundColor }]}>
        <View style={styles.left}>
          {!!icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              textStyle,
              styles.label,
              {
                color: primaryColor,
                fontFamily: value ? "Poppins_700Bold" : "Poppins_400Regular",
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
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
  toggleWrap: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    height: 28,
  },
});

export default OptionToggle;