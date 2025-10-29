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

const SafeViewAndGradientBackgroundStatic = ({
  children,
  style,
  screenname = "No screen name provided", //for debugging only
  friendColorLight = "white",
  friendColorDark = "red",
  backgroundOverlayColor,
  friendId,

 
  backgroundTransparentOverlayColor,
 
  useSolidOverlay = false,
 
  backgroundOverlayHeight = "100%",
  backgroundOverlayBottomRadius = 0,
}: Props) => {
 

  return (
    <GradientBackground
      useFriendColors={friendId}
      screenname={screenname}
      additionalStyles={[style]}
      friendColorDark={friendColorDark}
      friendColorLight={friendColorLight}
    >
      <SafeAreaView style={styles.safeAreaStyle}>
        <>
         
            <View
              style={[
               
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
            ></View>
     

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

export default SafeViewAndGradientBackgroundStatic;
