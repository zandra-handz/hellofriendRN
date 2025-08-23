import React from "react";
import { View } from "react-native"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import PreAddedList from "@/app/components/moments/PreAddedList";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

const ScreenPreAdded = () => { 
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();
  const { loadingDash } = useFriendDash();
    const { updateCapsule, preAdded, allCapsulesList } = useCapsuleList();

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
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
            updateCapsule={updateCapsule}
            preAdded={preAdded}
            allCapsulesList={allCapsulesList}
              textStyle={themeStyles.primaryText}
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
