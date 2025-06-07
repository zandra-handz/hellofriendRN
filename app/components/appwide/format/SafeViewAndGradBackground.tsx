import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import GradientBackground from "../display/GradientBackground";

export const SafeViewAndGradientBackground = ({
  children,
  style,
  includeCustomStatusBar = true,
  includeBackgroundOverlay = false,
  useGradientBackground = false,
  primaryBackground = false,
  backgroundOverlayHeight = '100%',
  backgroundOverlayBottomRadius = 0,
  header: Header,
}) => {
  const { themeAheadOfLoading, useGradientInSafeView } = useFriendList();
  const { isAuthenticated } = useUser();
  const insets = useSafeAreaInsets();
  const { selectedFriend } = useSelectedFriend();

  const route = useRoute();
  // console.log(route.name);

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;


  const standardizedHeaderHeight = 44;

  const { themeStyles, gradientColorsHome, manualGradientColors } =
    useGlobalStyle();

  const isSettingsScreen =
    route.name === "UserDetails" || route.name === "FriendFocus";
  const isHomeScreen = route.name === "hellofriend";

  // const colorOne =
  //   route.name !== "hellofriend" &&
  //   route.name !== "UserDetails" &&
  //   route.name !== "FriendFocus"
  //     ? themeAheadOfLoading.darkColor
  //     : manualGradientColors.darkColor;
  // const colorTwo =
  //   route.name !== "hellofriend" &&
  //   route.name !== "UserDetails" &&
  //   route.name !== "FriendFocus"
  //     ? themeAheadOfLoading.lightColor
  //     : manualGradientColors.darkColor;

  return (
    <GradientBackground
      useFriendColors={selectedFriend && !isSettingsScreen && !isHomeScreen}
      // colors={['black', colorTwo]}
      // start={{ x: 0, y: 0 }}
      // end={{ x: 1, y: 0 }}
      additionalStyles={[
        {
          // paddingTop: user?.authenticated ? top : 0,
          // paddingBottom: user?.authenticated ? bottom : 0,
          // paddingLeft: user?.authenticated ? left : 0,
          // paddingRight: user?.authenticated ? right : 0,
          paddingTop: isAuthenticated ? top : 0,
          paddingBottom: isAuthenticated ? bottom : 0,
          paddingLeft: isAuthenticated ? left : 0,
          paddingRight: isAuthenticated ? right : 0,
          backgroundColor: primaryBackground
            ? themeStyles.primaryBackground.backgroundColor
            : "transparent",
        },
        style,
      ]}
    >
      {includeBackgroundOverlay && (
        <View
          style={{
            position: "absolute",
            zIndex: 0,
            height: backgroundOverlayHeight,
            with: "100%",
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

      {includeCustomStatusBar && <CustomStatusBar />}
      {Header && (
        <View style={{  height: standardizedHeaderHeight }}>
          <Header />
        </View>
      )}
      {children}
    </GradientBackground>
  );
};

export default SafeViewAndGradientBackground;
