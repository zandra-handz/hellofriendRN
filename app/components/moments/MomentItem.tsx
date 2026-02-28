import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { Moment } from "@/src/types/MomentContextTypes";
import manualGradientColors from "@/app/styles/StaticColors";
import CategoryTooltip from "../headers/CategoryTooltip";

import SvgIcon from "@/app/styles/SvgIcons";

interface MomentItemsProps {
  index: number;
  momentData: Moment;
  momentDate: Date; //JS date object calculated in MomentsList.tsx
  itemHeight: number;
  combinedHeight: number;
  visibilityValue: SharedValue<number>;
  scrollYValue: SharedValue<number>;
  pressedIndexValue: SharedValue<number | null>;
  pulseValue: SharedValue<number>;
  onSend: (moment: Moment) => void;
  categoryColorsMap: Record<string, string>;
}

const MomentItem: React.FC<MomentItemsProps> = ({
  friendColor,
  index,
  momentData,
  categorySide,

  momentDate,
  itemHeight,
  combinedHeight,
  visibilityValue,
  scrollYValue,
  pressedIndexValue,
  pulseValue,
  onSend,
  categoryColorsMap,

  primaryColor,
  primaryBackgroundColor,
  darkerOverlayColor,
  lighterOverlayColor,
}) => {
  const startingPosition = index * combinedHeight;
  const { height } = useWindowDimensions();
  const containerHeight = height - 410;
  const sendButtonWidth = 50; // use as right padding for card content too because this button is absolute positioned

  const textContainerRightPadding = sendButtonWidth - 10;

  if (!momentData || !categoryColorsMap || !momentData.user_category) {
    return null; // or a fallback component
  }
  const categoryColor = momentData?.user_category
    ? (categoryColorsMap[String(momentData.user_category)] ?? "#ccc")
    : "#ccc";

  const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const handleSave = () => {
    onSend(momentData);
    pressedIndexValue.value = null;
  };

  const animatedStyle = useAnimatedStyle(() => {
    const isPressed = pressedIndexValue.value === index;

    const backgroundColor = isPressed
      ? interpolateColor(
          pulseValue.value,
          [0, 1],
          [manualGradientColors.lightColor, friendColor],
        )
      : "transparent"; // manualGradientColors.homeDarkColor;

    const iconColor = isPressed
      ? manualGradientColors.homeDarkColor
      : primaryColor;

    return {
      backgroundColor,
      // transform: [{ scale }],
      color: iconColor,
    };
  });

  const visibilityStyle = useAnimatedStyle(() => {
    const pos1 = startingPosition - containerHeight;
    const pos2 = startingPosition + combinedHeight - containerHeight;

    if (visibilityValue.value >= 1) {
      return {
        transform: [
          {
            translateY: interpolate(
              scrollYValue.value,
              [pos1, pos2],
              [-itemHeight / 2, 0],
              Extrapolation.CLAMP,
            ),
          },
          {
            scale: interpolate(
              scrollYValue.value,
              [pos1, pos2],
              [0.8, 1],
              Extrapolation.CLAMP,
            ),
          },
        ],
        opacity: interpolate(scrollYValue.value, [pos1, pos2], [0, 1]),
      };
    } else {
      return {
        transform: [
          {
            translateY: interpolate(
              visibilityValue.value,
              [0, 1],
              [1000 - startingPosition, 0],
              Extrapolation.CLAMP,
            ),
          },

          {
            scale: interpolate(visibilityValue.value, [0, 1], [0.8, 1]),
          },
        ],
        opacity: visibilityValue.value,
      };
    }
  });

  const original = momentData?.user_category_name || "No category";

  const truncated =
    original.length > 26 ? original.slice(0, 26) + "..." : original;

  const header = `${truncated}`;// • ${momentDate}`;
  return (
    <Animated.View
      style={[
        primaryBackgroundColor,

        {
          flexDirection: "row",
          height: itemHeight,
          width: "100%",
          justifyContent: "center",

          paddingHorizontal: 0, // adjust this/remove from View directly below to give padding to send button
          paddingVertical: 20, // adjust this/remove from View directly below to give padding to send button

          paddingHorizontal: 0,
        
          //borderRadius: 999, //cardBorderRadius,

        //  backgroundColor: "orange",
          overflow: "hidden", // needed here to hide corners of send button when send button has no padding
        },
        visibilityStyle,
      ]}
    >
      <CategoryTooltip
        label={header}
        color={primaryColor}
        borderColor={categoryColor}
        backgroundColor={darkerOverlayColor}
        containerStyle={{
          zIndex: 5,
          position: "absolute",
          top: 10,
          width: "auto",
          ...(categorySide === "right" ? { right: 0 } : { left: 0 }),
        }}
        labelStyle={{
          fontSize: 14,
          fontWeight: "bold",
          textShadowColor: categoryColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 2,
        }}
      />

      <View
        style={{
        
          flexDirection: "column",
        
          marginTop: 0,
          justifyContent: "center",
          width: "94%",
          borderWidth: 4,
          borderColor: categoryColor,
      backgroundColor: categoryColor,
          borderRadius: 999, 
          // paddingRight: textContainerRightPadding,
        }}
      >
        <View style={{ padding: 27 }}>
       
          <Text
            numberOfLines={1}
            style={[
              AppFontStyles.subWelcomeText,
              {
                color: primaryColor,
                fontSize: 14,
                lineHeight: 28,
                fontFamily: "Poppins-Regular",
                backgroundColor: darkerOverlayColor ,
                padding: 3,
                paddingHorizontal: 10,
                borderRadius: 8,
              },
            ]}
          >
            {momentData?.capsule?.replace(/\s*\n\s*/g, " ")}
          </Text>
        </View>
      </View>

      <AnimatedPressable
        hitSlop={20}
        onPress={() => handleSave()}
        style={[
          animatedStyle,
          {
            position: "absolute",
            right: 0,
            top: 0,
            borderRadius: 0,
            height: "100%",
            overflow: "hidden",
            // backgroundColor: themeStyles.primaryBackground.backgroundColor,
            height: "100%",
            textAlign: "center",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            width: sendButtonWidth,
          },
        ]}
        onPressIn={() => {
          pressedIndexValue.value = index;
          console.log(index);
          pulseValue.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            true,
          );
        }}
        onPressOut={() => {
          pressedIndexValue.value = null;
          pulseValue.value = 0;
        }}
      ></AnimatedPressable>
    </Animated.View>
  );
};

export default MomentItem;
