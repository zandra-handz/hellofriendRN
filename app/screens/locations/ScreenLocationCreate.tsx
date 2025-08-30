import React, { useEffect, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "@/src/context/UserContext"; 
import useCreateLocation from "@/src/hooks/LocationCalls/useCreateLocation";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import ContentAddLocation from "@/app/components/locations/ContentAddLocation";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
const ScreenLocationCreate = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { manualGradientColors } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();

  const navigation = useNavigation();

  const { createLocationMutation } = useCreateLocation({ userId: user?.id });

  useEffect(() => {
    if (createLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [createLocationMutation]);

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      <ContentAddLocation
        userId={user?.id}
        lightDarkTheme={lightDarkTheme}
        themeAheadOfLoading={themeAheadOfLoading}
        title={location.title}
        address={location.address}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationCreate;
