import React, { useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";

type Props = {
  friend: { id: number; name: string };
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

const OptionFriendButton = ({
  friend,
  primaryColor,
  backgroundColor,
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

  // For unselected buttons: own press feedback
  const staticBorderColor = pressed ? selectedBorderColor : fadedBorder;

  // For selected button: animates based on isExiting (driven by sibling presses)
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
            // backgroundColor, // only use if filling in full background with friend color(s)
            fontFamily: isSelected ? "Poppins_700Bold" : "Poppins_400Regular",
          },
        ]}
      >
        {friend.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
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
  },
});

export default OptionFriendButton;