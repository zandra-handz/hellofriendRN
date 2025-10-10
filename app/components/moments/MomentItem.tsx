import React  from "react";
import {
  View,
  Text,
  Pressable, 
} from "react-native";
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
import manualGradientColors  from "@/app/styles/StaticColors";
 
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
  // const textContainerWidth = "100%";
  // const talkingPointNumberOfLines = 3;
  // const cardBorderRadius = 999;
  // const sendButtonWidth = `${100 - Number(textContainerWidth.slice(0, -1))}%`;
  const sendButtonWidth = 50; // use as right padding for card content too because this button is absolute positioned
  // const momentColor = categoryColorMap[momentData.user_category];

  const textContainerRightPadding = sendButtonWidth - 10;
  // if (!momentData) {
  //   return;
  // }

  if (!momentData || !categoryColorsMap || !momentData.user_category) {
    return null; // or a fallback component
  }
  const categoryColor = momentData?.user_category
    ? (categoryColorsMap[String(momentData.user_category)] ?? "#ccc")
    : "#ccc";

  // const categoryId = String(momentData?.user_category);

  // useEffect(() => {
  //   if (categoryId && categoryColorsMap) {
  //     console.log(`category id: `, categoryId);
  //     console.log(categoryColorsMap);
  //     console.log(categoryColorsMap[categoryId]);
  //   }
  // }, [categoryId, categoryColorsMap]);

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
          [manualGradientColors.lightColor, friendColor]
        )
      : "transparent"; // manualGradientColors.homeDarkColor;

    const iconColor = isPressed
      ? manualGradientColors.homeDarkColor
      : // interpolateColor(
        //     pulseValue.value,
        //     [0, 1],
        //     [themeStyles.primaryText.color, manualGradientColors.homeDarkColor]
        //   )

        primaryColor;

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

  const original = momentData?.user_category_name || "No category";

  const truncated =
    original.length > 26 ? original.slice(0, 26) + "..." : original;

  const header = `${truncated} • ${momentDate}`;
  return (
    <Animated.View
      style={[
        primaryBackgroundColor,

        {
          textAlign: "left",
          flexDirection: "row",
          // justifyContent: "space-between",
          height: itemHeight,
          //  width: "100%",
          width: "auto",

          //  backgroundColor: 'pink',
          paddingHorizontal: 0, // adjust this/remove from View directly below to give padding to send button
          paddingVertical: 0, // adjust this/remove from View directly below to give padding to send button

          paddingHorizontal: 16,
          borderRadius: 999, //cardBorderRadius,

          backgroundColor:
            darkerOverlayColor,
          // borderTopLeftRadius: 60,
          // borderTopRightRadius: 10,
          // borderBottomLeftRadius: 10,
          // borderBottomRightRadius: 60,
          overflow: "hidden", // needed here to hide corners of send button when send button has no padding
        },
        visibilityStyle,
      ]}
    >
      <MaterialCommunityIcons
        name={"leaf"}
        size={40}
        style={{ position: "absolute", bottom: 14, right: 8 }}
        color={lighterOverlayColor}
        color={categoryColor}
      />
      <View
        style={{
          flexDirection: "column",
          paddingLeft: 13,

          //  padding: 10,
          justifyContent: "center",
          // flex: 1,
          width: "auto",
          //  backgroundColor: 'orange',
          paddingRight: textContainerRightPadding,
        }}
      >
        <View
          style={{
            //  flexWrap: "wrap",
            flexDirection: "column",
            //  width: textContainerWidth,
            width: "auto",

            overflow: "hidden",
          }}
        >
          <View style={{ position: "relative", alignSelf: "flex-start" }}>
            <Text
              numberOfLines={1}
              style={[ 
                {
                  color: primaryColor,
                  fontSize: 14,
                  fontWeight: "bold",
                  textShadowColor: categoryColor,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 2,
                },
              ]}
            >
              {header}
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 1.6,
                backgroundColor: categoryColor,
                borderRadius: 1,
              }}
            />
          </View>

          <Text
            //    numberOfLines={talkingPointNumberOfLines}
            numberOfLines={1}
            // style={[themeStyles.genericText, appFontStyles.momentText]}
            style={[ 
              AppFontStyles.subWelcomeText,
              { color: primaryColor, fontSize: 13, lineHeight: 28, fontFamily: "Poppins-Regular" },
            ]}
          >
            {/* {momentData && momentData?.capsule} */}
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
            height: '100%',
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
            true
          );
        }}
        onPressOut={() => {
          pressedIndexValue.value = null;
          pulseValue.value = 0;
        }}
      >
        <AnimatedIcon
          // name="comment-check-outline"
          // name="thought-bubble"
          name="playlist-check"
          name={"progress-upload"}
          size={20}
          style={[animatedStyle, { borderRadius: 999, paddingLeft: 10, paddingTop: 12 }]}
        />
      </AnimatedPressable>
    </Animated.View>
  );
};

export default MomentItem;
