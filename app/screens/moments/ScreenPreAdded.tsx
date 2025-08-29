import React from "react";
import { View } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import PreAddedList from "@/app/components/moments/PreAddedList";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
 
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useUser } from "@/src/context/UserContext";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";

const ScreenPreAdded = () => {
  const { selectedFriend } = useSelectedFriend();
  const { user } = useUser();
const { lightDarkTheme} = useLDTheme();
  const {  appFontStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();
  const { loadingDash } = useFriendDash();
  const { preAdded, allCapsulesList } = useCapsuleList();

  const { handlePreAddMoment } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground
      }
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlay={true}
      style={{ flex: 1 }}
    >
      {selectedFriend && !loadingDash && (
        <View style={{ flex: 1, padding: 10 }}>
          {preAdded && (
            <PreAddedList
              updateCapsule={handlePreAddMoment}
              preAdded={preAdded}
              allCapsulesList={allCapsulesList}
              textStyle={lightDarkTheme.primaryText}
              specialTextStyle={appFontStyles.welcomeText}
              friendId={selectedFriend?.id}
            />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenPreAdded;
