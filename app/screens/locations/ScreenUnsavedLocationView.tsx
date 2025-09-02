import React, { useCallback, useEffect, useRef } from "react";
 
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
// import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { appFontStyles } from "@/src/hooks/StaticFonts";
import CarouselSlider from "@/app/components/appwide/CarouselSlider"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext"; 
import LocationViewPage from "@/app/components/locations/LocationViewPage";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
const ScreenUnsavedLocationView = () => {
  const route = useRoute();
  const unsavedLocation = route.params?.unsavedLocation ?? null;
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();
  const { lightDarkTheme } = useLDTheme(); 
const { user } = useUser();
  // Don't think we need this here
  // const {
  //   stickToLocation,
  //   setStickToLocation,
  // } = useFriendLocationsContext();

  const { currentDay, getNumOfDaysFrom } = useLocationDetailFunctions();

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

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id} 
      style={{ flex: 1 }}
    >
      <CarouselSlider 
        initialIndex={0}
        data={[unsavedLocation]}
        children={(props) => (
          <LocationViewPage
            {...props}
            userId={user?.id}
            friendId={selectedFriend?.id}
            friendName={selectedFriend?.name}
            currentDay={currentDay}
            selectedDay={selectedDay}
            handleSelectedDay={handleSelectedDay} 
            themeAheadOfLoading={themeAheadOfLoading} 
            primaryColor={lightDarkTheme.primaryText}
            primaryBackground={lightDarkTheme.primaryBackground}
            welcomeTextStyle={appFontStyles.welcomeText}
            subWelcomeTextStyle={appFontStyles.subWelcomeText}
          />  )}
        type={"location"}



        // children={LocationViewPage}
        primaryColor={lightDarkTheme.primaryText}
        overlayColor={lightDarkTheme.overlayBackground}
        dividerStyle={lightDarkTheme.divider}
        welcomeTextStyle={appFontStyles.welcomeText}
        themeAheadOfLoading={themeAheadOfLoading} 
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenUnsavedLocationView;
