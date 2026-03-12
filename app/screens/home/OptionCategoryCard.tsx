import React, { useState } from "react";
import { Text, StyleSheet, Pressable, TextInput, View } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";

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
  onNameConfirm?: (newName: string) => void;
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
  onNameConfirm,
}: Props) => {
  const [pressed, setPressed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(category.name);

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

  const handleConfirm = () => {
    if (!nameValue.trim()) return;
    onNameConfirm?.(nameValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNameValue(category.name);
    setIsEditing(false);
  };

  return (
    <Pressable
      onPress={isEditing ? undefined : onPress}
      onLongPress={isEditing ? undefined : onLongPress}
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

      {/* name display or input */}
      {isEditing ? (
        <TextInput
          style={[
            AppFontStyles.subWelcomeText,
            styles.textInput,
            { color: primaryColor, borderBottomColor: primaryColor },
          ]}
          value={nameValue}
          onChangeText={setNameValue}
          autoFocus
          onSubmitEditing={handleConfirm}
        />
      ) : (
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
          {nameValue}
        </Text>
      )}

      {/* edit controls — only visible when selected */}
      {isSelected && (
        <View style={styles.actions}>
          {isEditing ? (
            <>
              <Pressable onPress={handleCancel} style={styles.actionBtn}>
                <SvgIcon name="cancel" size={16} color={primaryColor} />
              </Pressable>
              <Pressable onPress={handleConfirm} style={styles.actionBtn}>
                <SvgIcon name="check" size={16} color={primaryColor} />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => setIsEditing(true)} style={styles.actionBtn}>
              <SvgIcon name="pencil" size={16} color={primaryColor} />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
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
    flex: 1,
    borderRadius: 6,
    padding: 10,
    textAlign: "left",
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
});

export default OptionCategoryButton;