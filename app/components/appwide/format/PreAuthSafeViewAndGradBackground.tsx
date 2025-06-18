import React from "react";
import { View } from "react-native"; 
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
import { useRoute } from "@react-navigation/native";
import GradientBackground from "../display/GradientBackground";

export const PreAuthSafeViewAndGradientBackground = ({
  children,
  style,
  includeCustomStatusBar = true,
  includeBackgroundOverlay = false, 
  primaryBackground = false,
  backgroundOverlayHeight = '100%', 
  backgroundOverlayBottomRadius = 0,
  header: Header,
}) => {   
  const { selectedFriend } = useSelectedFriend();

  const route = useRoute(); 
 


  const standardizedHeaderHeight = 44;

  const { themeStyles } =
    useGlobalStyle();

  const isSettingsScreen =
    route.name === "UserDetails" || route.name === "FriendFocus";
  const isHomeScreen = route.name === "hellofriend";
 

  return (
    <GradientBackground
      useFriendColors={selectedFriend && !isSettingsScreen && !isHomeScreen}
 
      additionalStyles={[
        { 
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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

export default PreAuthSafeViewAndGradientBackground;
