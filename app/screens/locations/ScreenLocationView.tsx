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
import { manualGradientColors } from "@/src/hooks/StaticColors";
import { appFontStyles } from "@/src/hooks/StaticFonts";
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


  // console.log(userAddress);
  // console.log(friendAddress);
  // const now = new Date();
  // const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  const navigation = useNavigation();
  // const [currentIndex, setCurrentIndex] = useState(0);

  // const {
  //   faveLocations,
  //   nonFaveLocations,
  //   stickToLocation,
  //   setStickToLocation,
  // } = useFriendLocationsContext();

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
  // console.log(`current day: `, currentDay.day);
  // const numberOfDays = 14;
  // console.log(
  //   `${numberOfDays} days from now: `,
  //   getNumOfDaysFrom(numberOfDays).day
  // );

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
    console.log("removin functino in parent");
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
            manualGradientColors={manualGradientColors}
            primaryColor={lightDarkTheme.primaryText}
            primaryBackground={lightDarkTheme.primaryBackground}
            welcomeTextStyle={appFontStyles.welcomeText}
            subWelcomeTextStyle={appFontStyles.subWelcomeText}
          />
        )}
        type={"location"}
        footerData={{ userAddress, friendAddress }}
        onRightPressSecondAction={handleNavToSendText}
        primaryColor={lightDarkTheme.primaryText}
        overlayColor={lightDarkTheme.overlayBackground}
        dividerStyle={lightDarkTheme.divider}
        welcomeTextStyle={appFontStyles.welcomeText}
        themeAheadOfLoading={themeAheadOfLoading}
        manualGradientColors={manualGradientColors}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationView;
