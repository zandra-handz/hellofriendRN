import React, { useMemo } from "react";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import GradientBackgroundStatic from "../display/GradientBackgroundStatic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screenGradients } from "@/app/styles/GradientDirections";
import manualGradientColors from "@/app/styles/StaticColors";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {
  children: React.ReactNode;
  style: object;
  useCustomStatus: boolean;
  customStatusIsDarkMode: boolean;
  backgroundColor0: string | null;
  backgroundColor1: string | null;
};

export const SafeViewHome = ({
  children,
  style,
  useCustomStatus = true,
  customStatusIsDarkMode = false,
  backgroundColor0 = null,
  backgroundColor1 = null,
}: Props) => {
  const insets = useSafeAreaInsets();

  // hard coded instead, to set the status bar light-mode even when phone is in dark-mode, because of background
  //   const includeCustomStatusBar = true;

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const paddingStyle = useMemo(
    () => ({
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      //   backgroundColor: backgroundColor
    }),
    [],
  );

  return (
    <SafeAreaView style={style}>
      {/* {includeCustomStatusBar && <CustomStatusBar manualDarkMode={false} />} */}
      {useCustomStatus && (
        <CustomStatusBar manualDarkMode={customStatusIsDarkMode} />
      )}

      {children}
    </SafeAreaView>
  );
};

export default SafeViewHome;

// THIS HAS THE OLD FADE THAT WAS USED FOR THE MOMENT WRITER I THINK

// import React, { useEffect, useState, ReactElement, useMemo } from "react";
// import { DimensionValue,   ViewStyle, StyleSheet } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";
// import GradientBackground from "../display/GradientBackground";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

// type Props = {
//   children: ReactElement;
//   style?: ViewStyle;
//   useOverlay: boolean;
//   primaryBackground: boolean;
//   backgroundOverlayHeight: DimensionValue;
//   header?: React.ComponentType;
// };

// const SafeViewFriendHome = ({
//   children,
//   friendColorLight = "white",
//   friendColorDark = "red",
//   backgroundOverlayColor,
//   friendId,
//   backgroundTransparentOverlayColor,
//   useSolidOverlay = false,
//   backgroundOverlayHeight = "100%",
// }: Props) => {
//   const opacityValue = useSharedValue(0);

//   // console.log('SAFE VIEW RERENDERED');
//   //rerenders twice when returning to home screen from selected friend
//   //haven't debugged yet

//   useEffect(() => {
//     if (useSolidOverlay) {
//       opacityValue.value = withTiming(0, { duration: 300 });
//     } else if (friendId) {
//       opacityValue.value = withTiming(0.46, { duration: 300 });
//     } else {
//       opacityValue.value = withTiming(1, { duration: 300 });
//     }

//   }, [useSolidOverlay]);

//   const fadeStyle = useAnimatedStyle(() => ({
//     opacity: opacityValue.value,
//   }));

//   const useFriendColors = useMemo(() => friendId, [friendId]);

//   return (
//     // <>
//     <GradientBackground
//       useFriendColors={useFriendColors}

//       additionalStyles={{flex:1}}
//       friendColorDark={friendColorLight}
//       friendColorLight={friendColorDark}
//     >
//       <SafeAreaView style={styles.safeAreaStyle}>
//         <>

//             <Animated.View
//               style={[
//                 fadeStyle,
//                 styles.solidOverlayContainer,
//                 {
//                   height: backgroundOverlayHeight,
//                   backgroundColor: !useSolidOverlay
//                     ? backgroundOverlayColor
//                     : backgroundTransparentOverlayColor,

//                 },
//               ]}
//             ></Animated.View>

//           {children}
//         </>
//       </SafeAreaView>
//     </GradientBackground>
//     // </>
//   );
// };

// const styles = StyleSheet.create({
//   safeAreaStyle: {
//     flex: 1,
//   },
//   solidOverlayContainer: {
//     position: "absolute",
//     zIndex: 0,

//     width: "100%",
//     top: 0,
//     bottom: 0,
//     right: 0,
//     left: 0,
//   },
// });

// export default SafeViewFriendHome;
