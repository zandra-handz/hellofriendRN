import React from "react"; 
import ContentAddHello from "@/app/components/helloes/ContentAddHello"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useUser } from "@/src/context/UserContext";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
const ScreenAddHello = () => {
const { user } = useUser();
   const { themeStyles, manualGradientColors } = useGlobalStyle();
   const { selectedFriend } = useSelectedFriend();
   const { themeAheadOfLoading } = useFriendStyle();

  return (
    <SafeViewAndGradientBackground
         startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
    
    
    styles={[{ flex: 1 }]}>
      <ContentAddHello userId={user?.id} /> 
    </SafeViewAndGradientBackground>
  );
};
 

export default ScreenAddHello;
