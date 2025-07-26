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
  const talkingPointNumberOfLines = 3;
  const cardBorderRadius = 999;
  // const sendButtonWidth = `${100 - Number(textContainerWidth.slice(0, -1))}%`;
  const sendButtonWidth = 30; // use as right padding for card content too because this button is absolute positioned

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
      : "transparent"; // manualGradientColors.homeDarkColor;

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

  const original = momentData?.user_category_name || "No category";

  const truncated =
    original.length > 26 ? original.slice(0, 26) + "..." : original;

  const header = `${truncated} • ${momentDate}`;
  return (
    <Animated.View
      style={[
        themeStyles.genericTextBackground,

        {
          textAlign: "left",
          flexDirection: "row",
         // justifyContent: "space-between",
          height: itemHeight,
          //  width: "100%",
          width: "auto",
  
         //  backgroundColor: 'pink',
          paddingHorizontal: 0, // adjust this/remove from View directly below to give padding to send button
          paddingVertical: 2, // adjust this/remove from View directly below to give padding to send button

          paddingHorizontal: 10,
          borderRadius: 999, //cardBorderRadius,

          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
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

        
        size={34}
        style={{ position: "absolute", bottom: 5, right: 5 }}
        color={themeStyles.lighterOverlayBackgroundColor.backgroundColor}
      />
      <View
        style={{
          flexDirection: "column",
          paddingLeft: 20,
       
          padding: 10, 
         // flex: 1,
          width: 'auto',
        //  backgroundColor: 'orange',
          paddingRight: textContainerRightPadding,
        }}
      >
        <View
          style={{
          //  flexWrap: "wrap",
            flexDirection: 'column',
            //  width: textContainerWidth,
            width: "auto",

            overflow: "hidden",
          }}
        >
          <Text
            numberOfLines={1}
            // style={[themeStyles.genericText, appFontStyles.momentHeaderText]}
            style={[
              themeStyles.primaryText,
           
              { fontSize: 13, fontWeight: 'bold', opacity: .6}, //, fontWeight: "bold" },
            ]}
          >
            {header && header}

          </Text>
                      <Text
        //    numberOfLines={talkingPointNumberOfLines}
            numberOfLines={1}
            // style={[themeStyles.genericText, appFontStyles.momentText]}
            style={[
              themeStyles.primaryText,
              appFontStyles.subWelcomeText,
              { fontSize: 12, fontFamily: 'Poppins-Regular'},
            ]}
          >
            {/* {momentData && momentData?.capsule} */}
              {momentData?.capsule?.replace(/\s*\n\s*/g, ' ')}
          </Text>
          
        </View>
        {/* <View
          style={{
            flexWrap: "flex",
            width: textContainerWidth,
            overflow: "hidden",
            height: "100%",
          }}
        >
          <Text
            numberOfLines={talkingPointNumberOfLines}
            // style={[themeStyles.genericText, appFontStyles.momentText]}
            style={[
              themeStyles.primaryText,
              appFontStyles.subWelcomeText,
              { fontSize: 12, fontFamily: 'Poppins-Regular', lineHeight: 20, },
            ]}
          >
            {momentData && momentData?.capsule}
          </Text>

        </View> */}
      </View>
      
      <AnimatedPressable
        onPress={() => handleSave()}
        style={[
          animatedStyle,
          {
            position: "absolute",
            right: 0,
            borderRadius: 0,
            overflow: "hidden",
            // backgroundColor: themeStyles.primaryBackground.backgroundColor,
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
          // name="comment-check-outline"
          // name="thought-bubble"
          name="playlist-check"
          name={"progress-upload"}
          size={24}
          style={animatedStyle}
        />
  
      </AnimatedPressable>

    </Animated.View>
  );
};

export default MomentItem;
