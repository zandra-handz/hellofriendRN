import React, { useMemo } from "react";
import { View, DimensionValue } from "react-native";
import CustomStatusBar from "../statusbar/CustomStatusBar"; 
 
import { useRoute } from "@react-navigation/native";
import GradientBackground from "../display/GradientBackground";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style: object;
  includeCustomStatusBar?: boolean;
  includeBackgroundOverlay?: boolean;
  primaryBackground?: boolean;
  backgroundOverlayHeight?: DimensionValue;
  backgroundOverlayBottomRadius?: number;
};

export const PreAuthSafeViewAndGradientBackground = ({
  children,
  style,
  settings,
  startColor,
  endColor,
  friendColorLight,
  friendColorDark,
  backgroundOverlayColor,
  friendId,
  includeCustomStatusBar = true,
  includeBackgroundOverlay = false,
  primaryBackground = false,
  backgroundOverlayHeight = "100%",
  backgroundOverlayBottomRadius = 0,
}: Props) => { 

  const route = useRoute();
 

  const isSettingsScreen = useMemo(
    () => route.name === "UserDetails" || route.name === "FriendFocus",
    [route.name]
  );
  const isHomeScreen = useMemo(
    () => route.name === "hellofriend",
    [route.name]
  );

  const useFriendColors = useMemo(
    () => friendId && !isSettingsScreen && !isHomeScreen,
    [friendId, isSettingsScreen, isHomeScreen]
  );

  const paddingStyle = useMemo(
    () => ({
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: primaryBackground
        ? backgroundOverlayColor
        : "transparent",
    }),
    [primaryBackground, backgroundOverlayColor]
  );

  return (
    <GradientBackground
      useFriendColors={useFriendColors}
      startColor={startColor}
      endColor={endColor}
      friendColorDark={friendColorDark}
      friendColorLight={friendColorLight}
      additionalStyles={[paddingStyle, style]}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
              backgroundColor: backgroundOverlayColor,
              borderBottomLeftRadius: backgroundOverlayBottomRadius,
              borderBottomRightRadius: backgroundOverlayBottomRadius,
            }}
          ></View>
        )}

        {includeCustomStatusBar && <CustomStatusBar manualDarkMode={ settings?.manual_dark_mode} />}

        {children}
      </SafeAreaView>
    </GradientBackground>
  );
};

export default PreAuthSafeViewAndGradientBackground;
