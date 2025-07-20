import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
 
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import { useFriendList } from "@/src/context/FriendListContext";
 

import LocationViewPage from "@/app/components/locations/LocationViewPage";

const ScreenUnsavedLocationView = () => {
  const route = useRoute();
  const unsavedLocation = route.params?.unsavedLocation ?? null; 
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { faveLocations, nonFaveLocations } = useFriendLocationsContext();

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title={"LOCATIONS"}
        navigateTo={"Locations"}
        icon={LeavesTwoFallingOutlineThickerSvg}
        altView={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground
      header={renderHeader}
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
