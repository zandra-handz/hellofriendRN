import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  DimensionValue,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  interpolateColor,
  Extrapolation,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useWindowDimensions } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useFriendList } from "@/src/context/FriendListContext";

import { Moment } from "@/src/types/MomentContextTypes";

// interface Moment {
//   typedCategory: string;  // string value should always exist here per backend, I am like 90% sure
//   capsule: string;
//   created: string;
// }

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
}

const MomentItem: React.FC<MomentItemsProps> = ({
  index,
  momentData,
  momentDate,
  itemHeight,
  combinedHeight,
  visibilityValue,
  scrollYValue,
  pressedIndexValue,
  pulseValue,
  onSend,
}) => {
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();

  const startingPosition = index * combinedHeight;
  const { height } = useWindowDimensions();
  const containerHeight = height - 410;
  const { themeAheadOfLoading } = useFriendList();
  const textContainerWidth = "100%";
  const talkingPointNumberOfLines = 2;
  const cardBorderRadius = 30; 
  // const sendButtonWidth = `${100 - Number(textContainerWidth.slice(0, -1))}%`;
    const sendButtonWidth = 50; // use as right padding for card content too because this button is absolute positioned

    const textContainerRightPadding = sendButtonWidth + 10;
  if (!momentData) {
    return;
  }

  const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const handleSave = () => {
    onSend(momentData);
    pressedIndexValue.value = null;
  };
  //const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    const isPressed = pressedIndexValue.value === index;

    // const scale = isPressed
    //   ? interpolate(pulseValue.value, [0, 1], [1, 1.15], Extrapolation.CLAMP)
    //   : 1;

    const backgroundColor = isPressed
      ? interpolateColor(
          pulseValue.value,
          [0, 1],
          [manualGradientColors.lightColor, themeAheadOfLoading.darkColor]
        )
      : manualGradientColors.homeDarkColor;

    const iconColor = isPressed
      ? manualGradientColors.homeDarkColor
      : // interpolateColor(
        //     pulseValue.value,
        //     [0, 1],
        //     [themeStyles.primaryText.color, manualGradientColors.homeDarkColor]
        //   )

        themeStyles.primaryText.color;

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

  const original = momentData?.user_category_name || 'No category';

  const truncated =
    original.length > 26 ? original.slice(0, 26) + "..." : original;

  const header = `# ${truncated} • added ${momentDate}`;
  return (
    <Animated.View
      style={[
        themeStyles.genericTextBackground,

        {
          textAlign: "left",
          flexDirection: "row",
          justifyContent: "space-between",
          height: itemHeight,
          width: "100%",
          paddingHorizontal: 0, // adjust this/remove from View directly below to give padding to send button
          paddingVertical: 0, // adjust this/remove from View directly below to give padding to send button

          borderRadius: cardBorderRadius,
          overflow: "hidden", // needed here to hide corners of send button when send button has no padding
        },
        visibilityStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          paddingLeft: 24,
          flex: 1,
          paddingVertical: 24,  
          paddingRight: textContainerRightPadding,
        }}
      >
        <View
          style={{
            flexWrap: "wrap",
            width: textContainerWidth,
           
           
            overflow: "hidden",
          }}
        >
          <Text
            numberOfLines={1}
            // style={[themeStyles.genericText, appFontStyles.momentHeaderText]}
             style={[themeStyles.primaryText, appFontStyles.welcomeText, { fontSize: 18}]}
          >
            {header && header}
          </Text>
        </View>
        <View
          style={{
            flexWrap: "flex",
            width: textContainerWidth,
            overflow: "hidden",
            height: '100%', 
          }}
        >
          <Text
            numberOfLines={talkingPointNumberOfLines}
            // style={[themeStyles.genericText, appFontStyles.momentText]}
             style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}
          > 
            {momentData && momentData?.capsule}
            
          </Text>
        </View>
      </View>
      <AnimatedPressable
        onPress={() => handleSave()}
        style={[
          animatedStyle,
          {
            position: 'absolute',
            right: 0,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: manualGradientColors.homeDarkColor,
            height: "100%",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            width: sendButtonWidth,
          },
        ]}
        onPressIn={() => {
          pressedIndexValue.value = index;
          console.log(index);
          pulseValue.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            true
          );
        }}
        onPressOut={() => {
          pressedIndexValue.value = null;
          pulseValue.value = 0;
        }}
      >
        <AnimatedIcon
          name="comment-check-outline"
          size={24}
          style={animatedStyle}
        />
                {/* <MaterialCommunityIcons
          name="comment-check-outline"
          size={24}
          color={themeStyles.genericText.color}
         
        /> */}
      </AnimatedPressable>
      {/* <TouchableHighlight
        //testOnly_pressed={true}
        underlayColor={manualGradientColors.lightColor}
        onPress={() => onSend(momentData)}
        onShowUnderlay={iconColorOnPress}
        onHideUnderlay={iconColorOnRelease}
        style={{
          backgroundColor: manualGradientColors.homeDarkColor,
          height: "100%",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          width: sendButtonWidth,
        }}
      >
        <MaterialCommunityIcons
          name="comment-check-outline"
          size={24}
          // color={themeStyles.primaryText.color}
          color={iconColor}
          opacity={0.5}
        /> 
      </TouchableHighlight> */}
    </Animated.View>
  );
};

export default MomentItem;
