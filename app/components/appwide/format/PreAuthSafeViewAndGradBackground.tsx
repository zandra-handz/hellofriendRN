import React, { useMemo } from "react";
import { View, DimensionValue } from "react-native";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
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
  includeCustomStatusBar = true,
  includeBackgroundOverlay = false,
  primaryBackground = false,
  backgroundOverlayHeight = "100%",
  backgroundOverlayBottomRadius = 0,
}: Props) => {
  const { selectedFriend } = useSelectedFriend();

  const route = useRoute();

  const { themeStyles } = useGlobalStyle();

  const isSettingsScreen = useMemo(
    () => route.name === "UserDetails" || route.name === "FriendFocus",
    [route.name]
  );
  const isHomeScreen = useMemo(
    () => route.name === "hellofriend",
    [route.name]
  );

  const useFriendColors = useMemo(
    () => selectedFriend && !isSettingsScreen && !isHomeScreen,
    [selectedFriend, isSettingsScreen, isHomeScreen]
  );

  const paddingStyle = useMemo(
    () => ({
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: primaryBackground
        ? themeStyles.primaryBackground.backgroundColor
        : "transparent",
    }),
    [primaryBackground, themeStyles]
  );

  return (
    <GradientBackground
      useFriendColors={useFriendColors}
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
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
              borderBottomLeftRadius: backgroundOverlayBottomRadius,
              borderBottomRightRadius: backgroundOverlayBottomRadius,
            }}
          ></View>
        )}

        {includeCustomStatusBar && <CustomStatusBar />}

        {children}
      </SafeAreaView>
    </GradientBackground>
  );
};

export default PreAuthSafeViewAndGradientBackground;
