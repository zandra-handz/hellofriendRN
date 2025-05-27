import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useWindowDimensions } from "react-native";

const MomentItem = ({
  index,
  momentData,
  momentDate,
  itemHeight,
  combinedHeight,
  visibilityValue,
  scrollYValue,
  onSend,
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const startingPosition = index * combinedHeight;

  const { height } = useWindowDimensions();

  const containerHeight = height - 410;

  if (!momentData) {
    return;
  }

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
              Extrapolation.CLAMP
            ),
          },
          {
            scale: interpolate(
              scrollYValue.value,
              [pos1, pos2],
              [0.8, 1],
              Extrapolation.CLAMP
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
              Extrapolation.CLAMP
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

  const original = momentData?.typedCategory;

  const truncated =
    original.length > 26 ? original.slice(0, 26) + "..." : original;

  const header = `# ${truncated} • added ${momentDate}`;
  return (
    <Animated.View
      style={[
        themeStyles.genericTextBackground,

        {
          textAlign: "left",
          flexDirection: "column",
          height: itemHeight,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderRadius: 10,
        },
        visibilityStyle,
      ]}
    >
      <View style={{ flexWrap: "wrap", width: "100%", overflow: "hidden" }}>
        <Text
          numberOfLines={1}
          style={[
            themeStyles.genericText,
            appFontStyles.momentHeaderText,
          ]}
        >
          {header && header}
        </Text>
      </View>
      <View style={{ flexWrap: "wrap", width: "100%", overflow: "hidden" }}>
        <Text
          numberOfLines={1}
          style={[themeStyles.genericText, appFontStyles.momentText]}
        >
          {momentData && momentData?.capsule}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onSend(momentData)}
        style={{ position: "absolute", bottom: 10, right: 10 }}
      >
        <Text
          numberOfLines={1}
          style={[
            themeStyles.genericText,
            {
              fontSize: 11,
              lineHeight: 16,
              fontWeight: "bold",
              textTransform: "uppercase",
            },
          ]}
        >
          {" "}
          SEND
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MomentItem;
