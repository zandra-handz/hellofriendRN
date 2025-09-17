import React, { useEffect, useState, ReactElement, useMemo } from "react";
import { DimensionValue, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import manualGradientColors from "@/src/hooks/StaticColors";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../display/GradientBackground";

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

  friendColorLight = "white",
  friendColorDark = "red",
  backgroundOverlayColor,
  friendId,
  startColor,
  endColor,
  backgroundTransparentOverlayColor,
  addColorChangeDelay = false,
  includeBackgroundOverlay = false,
  useOverlay = false,
  primaryBackground = false,
  backgroundOverlayHeight = "100%",
  backgroundOverlayBottomRadius = 0,
  header: Header,
}: Props) => {
  const insets = useSafeAreaInsets();

  const route = useRoute();

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const [showColorOverlay, setShowColorOverlay] = useState(
    includeBackgroundOverlay
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (addColorChangeDelay && includeBackgroundOverlay) {
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

  const paddingStyle = useMemo(
    () => ({
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      backgroundColor: primaryBackground
        ? backgroundOverlayColor
        : "transparent",
    }),
    [top, bottom, left, right, primaryBackground, backgroundOverlayColor]
  );

  const standardizedHeaderHeight = 44;

  const isSettingsScreen = useMemo(
    () =>
      route.name === "UserDetails" ||
      route.name === "FriendFocus" ||
      route.name === "SelectFriend",
    [route.name]
  );

  const isHomeScreen = useMemo(
    () => route.name === "hellofriend",
    [route.name]
  );

  const useFriendColors = useMemo(
    () => friendId && !isSettingsScreen, // && !isHomeScreen,
    [friendId, isSettingsScreen, isHomeScreen]
  );

  return (
    <GradientBackground
      useFriendColors={useFriendColors || undefined}
      additionalStyles={[
        // paddingStyle,
        style,
      ]}
      // startColor={startColor}
      // endColor={endColor}
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorDark={friendColorDark}
      friendColorLight={friendColorLight}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <>
        {showColorOverlay && (
          <View
            style={{
              position: "absolute",
              zIndex: 0,
              height: backgroundOverlayHeight,
              width: "100%",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              opacity: 1,
              // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
              backgroundColor: !useOverlay
                ? backgroundOverlayColor
                : backgroundTransparentOverlayColor,
              borderBottomLeftRadius: backgroundOverlayBottomRadius,
              borderBottomRightRadius: backgroundOverlayBottomRadius,
            }}
          ></View>
        )}

        {/* {Header && (
          <View style={{ height: standardizedHeaderHeight }}>
            <Header />
          </View>
        )} */}

        {children}
        
        </>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SafeViewAndGradientBackground;
