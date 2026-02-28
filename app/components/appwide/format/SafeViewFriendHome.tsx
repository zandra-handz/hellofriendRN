import React, { useEffect, useState, ReactElement, useMemo } from "react";
import { DimensionValue, ViewStyle, StyleSheet, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../display/GradientBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const LeafImage = require("@/app/styles/pngs/leaf.png");
 

type Props = {
  children: ReactElement;
  style?: ViewStyle;
  useOverlay: boolean;
  primaryBackground: boolean;
  backgroundOverlayHeight: DimensionValue;
  header?: React.ComponentType;
};

const SafeViewFriendHome = ({
  children,
  friendColorLight = "white",
  friendColorDark = "red",
  backgroundOverlayColor,
  friendId,
 
}: Props) => {
  const opacityValue = useSharedValue(0);

  // console.log('SAFE VIEW RERENDERED');
  //rerenders twice when returning to home screen from selected friend
  //haven't debugged yet

  useEffect(() => {
    if (friendId) {
      opacityValue.value = withTiming(0.46, { duration: 800 });
    }
    // could use this for deselect if there's any time left on this screen in between
    // else {
    //   opacityValue.value = withTiming(1, { duration: 300 });
    // }
  }, [friendId]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const useFriendColors = useMemo(() => friendId, [friendId]);

  return (
    // <>
    <GradientBackground
      useFriendColors={useFriendColors}
      additionalStyles={{ flex: 1 }}
      friendColorDark={friendColorLight}
      friendColorLight={friendColorDark}
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
          ></Animated.View>


        <Image
          source={LeafImage}
          style={styles.leafContainer}
          tintColor={friendColorLight}
        />






          {children}
        </>
      </SafeAreaView>
    </GradientBackground>
    // </>
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
    top: -654, // 740
    left: -410,
    opacity: 0.8,

    width: 1100,
    height: 1100,
    resizeMode: "contain",
    transform: [{ rotate: "200deg" }, { scaleX: -1 }],
  },
});

export default SafeViewFriendHome;
