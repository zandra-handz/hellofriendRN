import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const MomentPulseAnimation = ({
    animatedCardsStyle,
 
  children,
  circleColor,
  flashToColor,
  staticColor,
  circleTextSize,
  minHeight = 80,
  width = "94%",
  pulseDuration = 2000,
  bobbingDuration = 2000,
  bobbingDistance = 5,
}) => { 
  const { appAnimationStyles, appSpacingStyles } = useGlobalStyle();

//   const progress = useSharedValue(0);
//   const translateY = useSharedValue(0);

//   const animatedStyle = useAnimatedStyle(() => {
//     const isVisible = Boolean(
//       viewableItemsArray?.value
//         .slice(0, 1)
//         .filter((arrayItem) => arrayItem.isViewable)
//         .find((viewableItem) => viewableItem.item?.id === item?.id)
//     );

//     if (isVisible) { 
//       progress.value = withRepeat(
//         withTiming(1, { duration: pulseDuration }),
//         -1,
//         true // reverse back to 0
//       );
//             translateY.value = withRepeat(
//               withSequence(
//                 withTiming(-bobbingDistance, { duration : bobbingDuration }),
//                 withTiming(0, { duration : bobbingDuration })
//               ),
//               -1, 
//               false  
//             );
//     } else {
//       progress.value = withTiming(0, { duration: 200 });
//       translateY.value = withTiming(0, { duration: 200 }); 
//     } 

//     const backgroundColor = interpolateColor(
//       progress.value,
//       [0, 1],
//       [isVisible ? staticColor : 'transparent', isVisible? flashToColor : 'transparent'] // red to blue, for example
//     );

//     return {
//       backgroundColor,
//       transform: [{ translateY: translateY.value }],
//       // transform: [{ scale: withTiming(isVisible ? .97 : .7) }, { translateY: translate }],
//       // opacity: withTiming(isVisible ? 1 : .4),
//     };
//   }, []);

  return (
    <Animated.View
      style={[
        appAnimationStyles.flashAnimMomentsContainer,
        appSpacingStyles.momentsScreenPrimarySpacing,
        animatedCardsStyle,
        {
          width: width,
        },
      ]}
    >
      <Animated.Text>{children}</Animated.Text>
    </Animated.View>
  );
};

export default MomentPulseAnimation;
