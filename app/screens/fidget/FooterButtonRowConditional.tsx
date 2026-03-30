// FooterButtonRowConditional.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ViewStyle, Animated } from "react-native";
import FooterButtonItem from "./FooterButtomItem";

type ButtonConfig = {
  iconName: string;
  label: string;
  onPress: () => void;
  color?: string;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
};

type FooterButtonRowConditionalProps = {
  primaryButtons: ButtonConfig[];
  secondaryButtons: ButtonConfig[];
  showSecondary: boolean;
  backgroundColor?: string;
  color?: string;
  iconSize?: number;
  fontSize?: number;
  height?: number;
  paddingBottom?: number;
  style?: ViewStyle;
  animationDuration?: number;
};

const FooterButtonRowConditional = ({
  primaryButtons,
  secondaryButtons,
  showSecondary,
  backgroundColor = "rgba(0,0,0,0.3)",
  color = "#fff",
  iconSize = 24,
  fontSize = 11,
  height = 90,
  paddingBottom = 12,
  style,
  animationDuration = 250,
}: FooterButtonRowConditionalProps) => {
  const anim = useRef(new Animated.Value(showSecondary ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: showSecondary ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [showSecondary]);

  const primaryOpacity = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });
  const primaryTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const secondaryOpacity = anim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });
  const secondaryTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const renderButtons = (buttons: ButtonConfig[]) =>
    buttons.map((btn, index) => (
      <FooterButtonItem
        key={`${btn.iconName}-${index}`}
        iconName={btn.iconName}
        label={btn.label}
        onPress={btn.onPress}
        color={btn.color ?? color}
        iconSize={iconSize}
        fontSize={fontSize}
        confirmationRequired={btn.confirmationRequired}
        confirmationTitle={btn.confirmationTitle}
        confirmationMessage={btn.confirmationMessage}
      />
    ));

  return (
    <View
      style={[
        styles.outer,
        { backgroundColor, height, paddingBottom },
        style,
      ]}
    >
      <View style={styles.inner}>
        <Animated.View
          pointerEvents={showSecondary ? "none" : "auto"}
          style={[
            styles.row,
            {
              opacity: primaryOpacity,
              transform: [{ translateY: primaryTranslateY }],
            },
          ]}
        >
          {renderButtons(primaryButtons)}
        </Animated.View>

        <Animated.View
          pointerEvents={showSecondary ? "auto" : "none"}
          style={[
            styles.row,
            styles.absoluteRow,
            {
              opacity: secondaryOpacity,
              transform: [{ translateY: secondaryTranslateY }],
            },
          ]}
        >
          {renderButtons(secondaryButtons)}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  absoluteRow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default FooterButtonRowConditional;