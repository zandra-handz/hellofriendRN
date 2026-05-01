import React, { useEffect, ReactElement, useMemo, useRef } from "react";
import { DimensionValue, ViewStyle, StyleSheet, Image } from "react-native";
import GradientBackgroundShared from "../display/GradientBackgroundShared";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientBackground from "../display/GradientBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

type Props = {
  children: ReactElement;
  style?: ViewStyle;
  useOverlay?: boolean;
  primaryBackground?: boolean;
  backgroundOverlayHeight?: DimensionValue;
  header?: React.ComponentType;
  reverseOverlayValue?: SharedValue<boolean>;
  sharedColorLightSV: SharedValue<string>;
  sharedColorDarkSV: SharedValue<string>;
  backgroundOverlayColor?: string;
  friendId?: number;
  frosted?: boolean;
  frostedColor?: string;
  frostedOpacity?: number;
};

const SafeViewSecretGecko = ({
  children,
  sharedColorLightSV,
  sharedColorDarkSV,
  frosted,
  frostedColor,
  frostedOpacity,
  //   backgroundOverlayColor,
  //   friendId,
  //   reverseOverlayValue,
}: Props) => {
  const insets = useSafeAreaInsets();

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
    }),
    [top, bottom, left, right],
  );

  //   const opacityValue = useSharedValue(0);

  //   const prevLightRef = useRef(friendColorLight);
  //   const prevDarkRef = useRef(friendColorDark);

  //   if (friendColorLight && friendColorLight !== "white") {
  //     prevLightRef.current = friendColorLight;
  //   }
  //   if (friendColorDark && friendColorDark !== "red") {
  //     prevDarkRef.current = friendColorDark;
  //   }

  //   const stableLightColor = friendColorLight || prevLightRef.current;
  //   const stableDarkColor = friendColorDark || prevDarkRef.current;

  //   useEffect(() => {
  //     if (friendId) {
  //       opacityValue.value = withTiming(0.46, { duration: 800 });
  //     }
  //   }, [friendId]);

  //   useDerivedValue(() => {
  //     if (reverseOverlayValue?.value) {
  //       opacityValue.value = withTiming(0, { duration: 600 });
  //     } else if (friendId) {
  //       opacityValue.value = withTiming(0.46, { duration: 800 });
  //     }
  //   });

  //   const useFriendColors = useMemo(() => friendId, [friendId]);

  return (
    <GradientBackgroundShared
      useFriendColors={true}
      additionalStyles={[paddingStyle, styles.container]}
      friendColorDark={sharedColorLightSV}
      friendColorLight={sharedColorDarkSV}
    >
      {children}
    </GradientBackgroundShared>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },

  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
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
  leafContainer: {
    position: "absolute",
    top: -654,
    left: -410,
    opacity: 0.8,
    width: 1100,
    height: 1100,
    resizeMode: "contain",
    transform: [{ rotate: "200deg" }, { scaleX: -1 }],
  },
});

export default SafeViewSecretGecko;
