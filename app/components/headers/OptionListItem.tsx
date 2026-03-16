// app/components/headers/OptionListItem.tsx

import React from "react";
import { View, Text, Pressable, StyleSheet, TextStyle } from "react-native";

type Props = {
  label?: string;
  sublabel?: string;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle?: TextStyle;
  buttonPadding?: number;
  showBorder?: boolean;
  borderColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  icon?: React.ReactElement;
  rightElement?: React.ReactElement;
  children?: React.ReactNode;
};

const DEFAULT_LABEL_STYLE: TextStyle = {
  fontFamily: "SpaceGrotesk-Regular",
  fontSize: 11,
  letterSpacing: 0.3,
};

const DEFAULT_SUBLABEL_STYLE: TextStyle = {
  fontFamily: "SpaceGrotesk-Medium",
  fontSize: 14,
  lineHeight: 20,
};

const OptionListItem: React.FC<Props> = ({
  label,
  sublabel,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  showBorder = true,
  borderColor,
  onPress,
  onLongPress,
  icon,
  rightElement,
  children,
}) => {
  const content = (
    <View
      style={[
        styles.inner,
        {
          backgroundColor,
          borderBottomWidth: showBorder ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: borderColor ?? `${primaryColor}15`,
        },
      ]}
    >
      <View style={styles.row}>
        {!!icon && <View style={styles.iconWrap}>{icon}</View>}

        <View style={styles.textColumn}>
          {!!label && (
            <Text
              style={[
                DEFAULT_LABEL_STYLE,
                textStyle,
                styles.label,
                { color: primaryColor, opacity: 0.45 },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
          {!!sublabel && (
            <Text
              style={[
                DEFAULT_SUBLABEL_STYLE,
                textStyle,
                styles.sublabel,
                { color: primaryColor },
              ]}
              numberOfLines={2}
            >
              {sublabel}
            </Text>
          )}
          {children}
        </View>

        {!!rightElement && (
          <View style={styles.rightWrap}>{rightElement}</View>
        )}
      </View>
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.button, { backgroundColor: 'red', padding: buttonPadding, backgroundColor: buttonColor }]}
        android_ripple={{ color: "rgba(255,255,255,0.08)" }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  iconWrap: {
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
    flexShrink: 1,
    gap: 3,
  },
  label: {
    flexShrink: 1,
  },
  sublabel: {},
  rightWrap: {
    zIndex:10000,
    elevation: 10000,
    marginLeft: 12,
    flexShrink: 0,
  },
});

export default OptionListItem;