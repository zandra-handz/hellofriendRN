import React from "react";  
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useAuthUser } from "@/src/context/AuthUserContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient";

 

export const SafeView = ({
  children,
  style,
  includeCustomStatusBar = true,
  useGradientBackground = false,
  primaryBackground = false,
}) => {

 
  const { themeAheadOfLoading, useGradientInSafeView } = useFriendList();
  const { authUserState } = useAuthUser();
  const insets = useSafeAreaInsets(); 
 
  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const { themeStyles } = useGlobalStyle();

  const colorOne = useGradientInSafeView ? themeAheadOfLoading.darkColor : 'transparent';
  const colorTwo = useGradientInSafeView ? themeAheadOfLoading.lightColor : 'transparent';

  return (
    <LinearGradient
            colors={[colorOne, colorTwo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      style={[
        {
          paddingTop: authUserState?.authenticated ? top : 0,
          paddingBottom: authUserState?.authenticated ? bottom : 0,
          paddingLeft: authUserState?.authenticated ? left : 0,
          paddingRight: authUserState?.authenticated ? right : 0,
          backgroundColor: primaryBackground ? themeStyles.primaryBackground.backgroundColor : 'transparent',
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