import React from "react";
import ContentAddHello from "@/app/components/helloes/ContentAddHello";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext"; 
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
const ScreenAddHello = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme(); 
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();

  return (
    <SafeViewAndGradientBackground
 
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={true}
      styles={[{ flex: 1 }]}
    >
      <ContentAddHello
        userId={user?.id}
        primaryColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.overlayBackground}
        fontStyle={AppFontStyles.welcomeText} 
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenAddHello;
