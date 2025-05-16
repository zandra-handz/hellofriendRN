import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";

export const SafeView = ({
  children,
  style,
  includeCustomStatusBar = true,
  useGradientBackground = false,
  primaryBackground = false,
}) => {
  const { themeAheadOfLoading, useGradientInSafeView } = useFriendList();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const route = useRoute();
 // console.log(route.name);

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const { themeStyles, gradientColorsHome } = useGlobalStyle();

  const colorOne =
    route.name !== "hellofriend" &&
    route.name !== "UserDetails" &&
    route.name !== "FriendFocus"
      ? themeAheadOfLoading.darkColor
      : gradientColorsHome.darkColor;
  const colorTwo =
    route.name !== "hellofriend" &&
    route.name !== "UserDetails" &&
    route.name !== "FriendFocus"
      ? themeAheadOfLoading.lightColor
      : gradientColorsHome.darkColor;

  return (
    <LinearGradient
      colors={[colorOne, colorTwo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        {
          paddingTop: user?.authenticated ? top : 0,
          paddingBottom: user?.authenticated ? bottom : 0,
          paddingLeft: user?.authenticated ? left : 0,
          paddingRight: user?.authenticated ? right : 0,
          backgroundColor: primaryBackground
            ? themeStyles.primaryBackground.backgroundColor
            : "transparent",
        },
        style,
      ]}
    >
      {includeCustomStatusBar && <CustomStatusBar />}
      {children}
    </LinearGradient>
  );
};

export default SafeView;
