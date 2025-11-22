import React, { useEffect, useState, ReactElement, useMemo } from "react";
import { DimensionValue,   ViewStyle, StyleSheet } from "react-native";
 
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
  useOverlay: boolean;
  primaryBackground: boolean;
  backgroundOverlayHeight: DimensionValue; 
  header?: React.ComponentType;
};

const SafeViewHome = ({
  children, 
  friendColorLight = "white",
  friendColorDark = "red",
  backgroundOverlayColor,
  friendId,
  
  backgroundTransparentOverlayColor,
 
  useSolidOverlay = false, 
  backgroundOverlayHeight = "100%", 
}: Props) => { 
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (useSolidOverlay) { 
      opacityValue.value = withTiming(0, { duration: 300 });
    } else if (friendId) {
      opacityValue.value = withTiming(0.46, { duration: 300 });
    } else {
      opacityValue.value = withTiming(1, { duration: 300 });
    }

 
  }, [useSolidOverlay]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

 

  const useFriendColors = useMemo(() => friendId, [friendId]);

  return (
    <GradientBackground
      useFriendColors={useFriendColors}
      screenname={'home'}
      additionalStyles={{flex:1}}
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
                  height: backgroundOverlayHeight,
                  backgroundColor: !useSolidOverlay
                    ? backgroundOverlayColor
                    : backgroundTransparentOverlayColor,
 
                },
              ]}
            ></Animated.View>
       

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

export default SafeViewHome;
