import React, { useEffect, useState, ReactElement, useMemo } from "react";
import { DimensionValue, View, ViewStyle, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import manualGradientColors from "@/src/hooks/StaticColors";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../display/GradientBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  children: ReactElement;
  style?: ViewStyle;
  includeBackgroundOverlay: boolean;
  useOverlay: boolean;
  primaryBackground: boolean;
  backgroundOverlayHeight: DimensionValue;
  backgroundOverlayBottomRadius: number;
  header?: React.ComponentType;
};

const SafeViewAndGradientBackground = ({
  children,
  style,
  screenname = "No screen name provided", //for debugging only
  friendColorLight = "white",
  friendColorDark = "red",
  backgroundOverlayColor,
  friendId,

  forceFullOpacity = false,
  // startColor,
  // endColor,
  backgroundTransparentOverlayColor,
  addColorChangeDelay = false,
  includeBackgroundOverlay = false,
  useSolidOverlay = false,
  useOverlayFade = false,
  backgroundOverlayHeight = "100%",
  backgroundOverlayBottomRadius = 0,
}: Props) => {
  // const insets = useSafeAreaInsets();

  // const route = useRoute();
  console.log(`safe area vuew rerendered on ${screenname}`);
  const opacityValue = useSharedValue(useOverlayFade ? 0 : 1);

  // const top = typeof insets.top === "number" ? insets.top : 0;
  // const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  // const left = typeof insets.left === "number" ? insets.left : 0;
  // const right = typeof insets.right === "number" ? insets.right : 0;

  useEffect(() => {
    if (useSolidOverlay) {
      console.error("use solid overlay triggered");
      opacityValue.value = withTiming(0, { duration: 300 });
    } else if (forceFullOpacity) {
      opacityValue.value = withTiming(1, { duration: 0 });
    } else if (friendId) {
      opacityValue.value = withTiming(0.46, { duration: 300 });
    } else {
      opacityValue.value = withTiming(1, { duration: 300 });
    }

    // if (!useSolidOverlay && useOverlayFade && !friendId) {
    //   // console.log('background1');
    //   opacityValue.value = withTiming(1, {duration: 300});
    // }
    //    if (!useSolidOverlay && useOverlayFade && friendId) {
    //         // console.log('background2');
    //   opacityValue.value = withTiming(.46, {duration: 300});
    // }
  }, [useSolidOverlay]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const [showColorOverlay, setShowColorOverlay] = useState(
    includeBackgroundOverlay
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (addColorChangeDelay && includeBackgroundOverlay) {
      console.error(
        `${screenname} add color change delay or include background overlay triggered thus`
      );
      timeoutId = setTimeout(() => {
        setShowColorOverlay(true);
      }, 100);
    } else {
      setShowColorOverlay(includeBackgroundOverlay);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [includeBackgroundOverlay, addColorChangeDelay]);

  const useFriendColors = useMemo(() => friendId, [friendId]);

  return (
    <GradientBackground
      useFriendColors={useFriendColors}
      screenname={screenname}
      additionalStyles={[style]}
      friendColorDark={friendColorDark}
      friendColorLight={friendColorLight}
    >
      <SafeAreaView style={styles.safeAreaStyle}>
        <>
          {showColorOverlay && (
            <Animated.View
              style={[
                fadeStyle,
                styles.solidOverlayContainer,
                {
                  height: backgroundOverlayHeight,
                  backgroundColor: !useSolidOverlay
                    ? backgroundOverlayColor
                    : backgroundTransparentOverlayColor,

                  borderBottomLeftRadius: backgroundOverlayBottomRadius,
                  borderBottomRightRadius: backgroundOverlayBottomRadius,
                },
              ]}
            ></Animated.View>
          )}

          {children}
        </>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  solidOverlayContainer: {
    position: "absolute",
    zIndex: 0,

    width: "100%",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default SafeViewAndGradientBackground;
