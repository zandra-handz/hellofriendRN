import React, { useEffect, useRef, useState } from "react";

import { useRoute } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";
// import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import { useUser } from "@/src/context/UserContext";
import LocationViewPage from "@/app/components/locations/LocationViewPage";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import LocationCarouselSlider from "@/app/components/appwide/LocationCarouselSlider";
import { useHelloes } from "@/src/context/HelloesContext";
import { useLocations } from "@/src/context/LocationsContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendLocations from "@/src/hooks/FriendLocationCalls/useFriendLocations";
import useAddToFaves from "@/src/hooks/FriendLocationCalls/useAddToFaves";
import useRemoveFromFaves from "@/src/hooks/FriendLocationCalls/useRemoveFromFaves";
import { useLDTheme } from "@/src/context/LDThemeContext"; 
const ScreenLocationView = () => {
  const route = useRoute();
  const { user } = useUser();
  // const startingLocation = route.params?.startingLocation ?? null;
  const currentIndex = route.params?.index ?? null;
  const userAddress = route?.params?.userAddress ?? null;
  const friendAddress = route?.params?.friendAddress ?? null;
  const { lightDarkTheme } = useLDTheme();
  const { themeAheadOfLoading } = useFriendStyle();
  const { selectedFriend } = useSelectedFriend();
  const { currentDay, getNumOfDaysFrom } = useLocationDetailFunctions();
  const navigation = useNavigation();

  const { friendDash } = useFriendDash();
  const friendFaveIds = friendDash?.friend_faves?.locations;
  const { locationList } = useLocations();

  const { helloesList } = useHelloes();
  const inPersonHelloes = helloesList?.filter(
    (hello) => hello.type === "in person"
  );

  const { faveLocations, nonFaveLocations } = useFriendLocations({
    inPersonHelloes: inPersonHelloes,
    locationList: locationList,
    friendFaveIds: friendFaveIds,
  });

  useEffect(() => {
    if (!friendDash) {
      return;
    }

    if (locationId) {
      setStickToLocation(locationId);
    }
  }, [friendDash, locationId]);

  const { handleAddToFaves } = useAddToFaves({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });
  const { handleRemoveFromFaves } = useRemoveFromFaves({
    userId: user?.id,
    friendId: selectedFriend?.id,
  }); 
  
  const [stickToLocation, setStickToLocation] = useState(null);
  const [locationId, setLocationId] = useState(null);

  const handleAddToFavesAndStick = ({ locationId }) => {
    console.log("adding!");
    if (!locationId) {
      return;
    }

    handleAddToFaves({ locationId: locationId });
    // setStickToLocation(locationId);
    setLocationId(locationId);
  };

  const handleRemoveFromFavesAndStick = ({ locationId }) => {
 
    if (!locationId) {
      return;
    }

    handleRemoveFromFaves({ locationId: locationId });
    setLocationId(locationId);
    // setStickToLocation(locationId);
  };

  const selectedDay = useRef({ index: null, day: "" });

  useEffect(() => {
    if (currentDay?.index !== undefined && currentDay?.day !== undefined) {
      selectedDay.current = {
        index: currentDay.index,
        day: currentDay.day,
      };
    }
  }, [currentDay]);

  const handleSelectedDay = (object) => {
    if (object) {
      if (selectedDay.current) {
        selectedDay.current.day = object.day;
        selectedDay.current.index = object.index;
      }
    }
  };

  const handleNavToSendText = (locationItem) => {
    navigation.navigate("LocationSend", {
      location: locationItem,
      weekdayTextData: null,
      selectedDay: selectedDay.current,
    });
  };

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlay={true}
      style={{ flex: 1 }}
    >
      <LocationCarouselSlider
        userId={user?.id}
        friendId={selectedFriend?.id}
        stickToLocation={stickToLocation}
        setStickToLocation={setStickToLocation}
        initialIndex={currentIndex}
        scrollToEdit={stickToLocation}
        scrollToEditCompleted={() => setStickToLocation(null)}
        data={[...faveLocations, ...nonFaveLocations]}
        children={(props) => (
          <LocationViewPage
            {...props}
            userId={user?.id}
            friendId={selectedFriend?.id}
            friendName={selectedFriend?.name}
            currentDay={currentDay}
            selectedDay={selectedDay}
            handleSelectedDay={handleSelectedDay}
            onAddPress={handleAddToFavesAndStick}
            onRemovePress={handleRemoveFromFavesAndStick}
            themeAheadOfLoading={themeAheadOfLoading}
            primaryColor={lightDarkTheme.primaryText}
            primaryBackground={lightDarkTheme.primaryBackground}
            marginBottom={2}
            lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
            darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
          />
        )}
        type={"location"}
        footerData={{ userAddress, friendAddress }}
        onRightPressSecondAction={handleNavToSendText}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={lightDarkTheme.primaryBackground}
        overlayColor={lightDarkTheme.overlayBackground}
        lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
        darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
        dividerStyle={lightDarkTheme.divider} 
        themeAheadOfLoading={themeAheadOfLoading} 
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationView;
