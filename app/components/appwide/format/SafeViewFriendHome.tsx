import React, { useEffect, ReactElement, useMemo, useRef } from "react";
import { DimensionValue, ViewStyle, StyleSheet, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../display/GradientBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
const LeafImage = require("@/app/styles/pngs/leaf.png");

type Props = {
  children: ReactElement;
  style?: ViewStyle;
  useOverlay?: boolean;
  primaryBackground?: boolean;
  backgroundOverlayHeight?: DimensionValue;
  header?: React.ComponentType;
  reverseOverlayValue?: SharedValue<boolean>;
  friendColorLight?: string;
  friendColorDark?: string;
  backgroundOverlayColor?: string;
  friendId?: number;
};

const SafeViewFriendHome = ({
  children,
  friendColorLight = "white",
  friendColorDark = "red",
  backgroundOverlayColor,
  friendId,
  reverseOverlayValue,
}: Props) => {
  const opacityValue = useSharedValue(0);

  const prevLightRef = useRef(friendColorLight);
  const prevDarkRef = useRef(friendColorDark);

  if (friendColorLight && friendColorLight !== "white") {
    prevLightRef.current = friendColorLight;
  }
  if (friendColorDark && friendColorDark !== "red") {
    prevDarkRef.current = friendColorDark;
  }

  const stableLightColor = friendColorLight || prevLightRef.current;
  const stableDarkColor = friendColorDark || prevDarkRef.current;

  useEffect(() => {
    if (friendId) {
      opacityValue.value = withTiming(0.46, { duration: 800 });
    }
  }, [friendId]);

  useDerivedValue(() => {
    if (reverseOverlayValue?.value) {
      opacityValue.value = withTiming(0, { duration: 600 });
    } else if (friendId) {
      opacityValue.value = withTiming(0.46, { duration: 800 });
    }
  });

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const useFriendColors = useMemo(() => friendId, [friendId]);

  return (
    <GradientBackground
      useFriendColors={useFriendColors}
      additionalStyles={{ flex: 1 }}
      friendColorDark={stableLightColor}
      friendColorLight={stableDarkColor}
    >
      <SafeAreaView style={styles.safeAreaStyle}>
        <>
          <Animated.View
            style={[
              fadeStyle,
              styles.solidOverlayContainer,
              {
                backgroundColor: backgroundOverlayColor,
              },
            ]}
          />

          <Image
            source={LeafImage}
            style={styles.leafContainer}
            tintColor={stableLightColor}
          />

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

export default SafeViewFriendHome;