import React, { useEffect, useCallback } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import { useFocusEffect } from "@react-navigation/native";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import LocationViewPage from "@/app/components/locations/LocationViewPage";

const ScreenLocationView = () => {
  const route = useRoute();
  const startingLocation = route.params?.startingLocation ?? null;
  const currentIndex = route.params?.index ?? null; 
    const userAddress = route?.params?.userAddress ?? null;
  const friendAddress = route?.params?.friendAddress ?? null;
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const now = new Date(); 
const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });
 
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { faveLocations, nonFaveLocations, stickToLocation, setStickToLocation } = useFriendLocationsContext();

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

    useEffect(() => {
      console.log(`stickto location`, stickToLocation);
  
    }, [stickToLocation]);
  

  return (
    <PreAuthSafeViewAndGradientBackground includeBackgroundOverlay={true}  style={{ flex: 1 }}>
      <CarouselSlider
        initialIndex={currentIndex}
        scrollToEdit={stickToLocation}
        scrollToEditCompleted={() => setStickToLocation(null)}
        data={[...faveLocations, ...nonFaveLocations]}
        children={LocationViewPage}
        type={'location'}
        footerData={{ userAddress, friendAddress }}
         
 
      
      />
    </PreAuthSafeViewAndGradientBackground>
  );
};

export default ScreenLocationView;
