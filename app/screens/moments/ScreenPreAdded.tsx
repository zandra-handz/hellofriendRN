import React from "react";
import { View } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { useFriendDash } from "@/src/context/FriendDashContext";
import PreAddedList from "@/app/components/moments/PreAddedList";
import { useFriendStyle } from "@/src/context/FriendStyleContext";

import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useUser } from "@/src/context/UserContext";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors  from "@/src/hooks/StaticColors";
const ScreenPreAdded = () => {
  const { selectedFriend } = useSelectedFriend();
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
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
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={true}
      style={{ flex: 1 }}
    >
      {selectedFriend && !loadingDash && (
        <View style={{ flex: 1, padding: 10 }}>
          {preAdded && (
            <PreAddedList
              manualGradientColors={manualGradientColors}
              primaryColor={lightDarkTheme.primaryText}
              primaryBackground={lightDarkTheme.primaryBackground}
              updateCapsule={handlePreAddMoment}
              preAdded={preAdded}
              allCapsulesList={allCapsulesList}
              friendId={selectedFriend?.id}
            />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenPreAdded;
