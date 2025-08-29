import React from "react";
import ContentAddHello from "@/app/components/helloes/ContentAddHello";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
const ScreenAddHello = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { manualGradientColors, appContainerStyles, appFontStyles } =
    useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      styles={[{ flex: 1 }]}
    >
      <ContentAddHello
        userId={user?.id}
        primaryColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.overlayBackground}
        containerStyle={appContainerStyles.talkingPointCard}
        fontStyle={appFontStyles.welcomeText}
        manualGradientColors={manualGradientColors}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenAddHello;
