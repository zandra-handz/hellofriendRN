import React, { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useRoute } from "@react-navigation/native";
import GradientBackground from "../display/GradientBackground";

export const SafeViewAndGradientBackground = ({
  children,
  style,
  includeCustomStatusBar = true,
  includeBackgroundOverlay = false,
  primaryBackground = false,
  backgroundOverlayHeight = "100%",
  backgroundOverlayBottomRadius = 0,
  header: Header,
}) => {
  const insets = useSafeAreaInsets();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const route = useRoute();

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const { themeStyles } = useGlobalStyle();

  const paddingStyle = useMemo(
    () => ({
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      backgroundColor: primaryBackground
        ? themeStyles.primaryBackground.backgroundColor
        : "transparent",
    }),
    [top, bottom, left, right, primaryBackground, themeStyles]
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
    () => selectedFriend && !isSettingsScreen, // && !isHomeScreen,
    [selectedFriend, isSettingsScreen, isHomeScreen]
  );

  return (
    <GradientBackground
      useFriendColors={useFriendColors}
      additionalStyles={[paddingStyle, style]}
    >
      {includeBackgroundOverlay && (
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
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
            borderBottomLeftRadius: backgroundOverlayBottomRadius,
            borderBottomRightRadius: backgroundOverlayBottomRadius,
          }}
        ></View>
      )}

      {/* {includeCustomStatusBar && <CustomStatusBar />} */}
      {Header && (
        <View style={{ height: standardizedHeaderHeight }}>
          <Header />
        </View>
      )}

      {children}
    </GradientBackground>
  );
};

export default SafeViewAndGradientBackground;
