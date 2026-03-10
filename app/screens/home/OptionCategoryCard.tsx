import React, { useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";

type Props = {
  category: { id: number; name: string };
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  selectedBorderColor: string;
  isSelected?: boolean;
  isExiting?: SharedValue<number>;
  buttonPadding?: number;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
};

const OptionCategoryButton = ({
  category,
  primaryColor, 
  buttonColor,
  selectedBorderColor,
  isSelected = false,
  isExiting,
  buttonPadding = 4,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
}: Props) => {
  const [pressed, setPressed] = useState(false);

  const fadedBorder = `${primaryColor}30`;

  const staticBorderColor = pressed ? selectedBorderColor : fadedBorder;

  const animatedBorderStyle = useAnimatedStyle(() => {
    if (!isExiting) return { borderColor: selectedBorderColor };
    return {
      borderColor: interpolateColor(
        isExiting.value,
        [0, 1],
        [selectedBorderColor, fadedBorder],
      ),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        setPressed(true);
        onPressIn?.();
      }}
      onPressOut={() => {
        setPressed(false);
        onPressOut?.();
      }}
      style={[
        styles.button,
        {
          padding: buttonPadding,
          backgroundColor: buttonColor,
          borderColor: !isSelected ? staticBorderColor : "transparent",
        },
      ]}
    >
      {isSelected && (
        <Animated.View
          style={[styles.selectedBorder, animatedBorderStyle]}
          pointerEvents="none"
        />
      )}
      <Text
        numberOfLines={1}
        style={[
          AppFontStyles.subWelcomeText,
          styles.text,
          {
            color: primaryColor,
            fontFamily: isSelected ? "Poppins_700Bold" : "Poppins_400Regular",
          },
        ]}
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    height: "auto",
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: "visible",
  },
  selectedBorder: {
    position: "absolute",
    top: -1.5,
    left: -1.5,
    right: -1.5,
    bottom: -1.5,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  text: {
    borderRadius: 6,
    padding: 10,
    textAlign: "left",
  },
});

export default OptionCategoryButton;