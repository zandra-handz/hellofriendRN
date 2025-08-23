import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import CarouselSlider from "@/app/components/appwide/CarouselSlider";

import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import LocationViewPage from "@/app/components/locations/LocationViewPage";

const ScreenUnsavedLocationView = () => {
  const route = useRoute();
  const unsavedLocation = route.params?.unsavedLocation ?? null;
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();

  const { themeStyles, manualGradientColors } = useGlobalStyle();

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
      // includeBackgroundOverlay={true}
      // backgroundOverlayHeight={"120%"}
      style={{ flex: 1 }}
    >
      <CarouselSlider
        initialIndex={0}
        data={[unsavedLocation]}
        children={LocationViewPage}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenUnsavedLocationView;
