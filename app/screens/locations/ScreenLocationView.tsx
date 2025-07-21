import React, {   useEffect, useRef } from "react";

import { useRoute } from "@react-navigation/native";
 

import { useNavigation } from "@react-navigation/native";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import LocationViewPage from "@/app/components/locations/LocationViewPage";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import PreAuthSafeViewBackground from "@/app/components/appwide/format/PreAuthSafeViewBackground";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
const ScreenLocationView = () => {
  const route = useRoute();
  const startingLocation = route.params?.startingLocation ?? null;
  const currentIndex = route.params?.index ?? null;
  const userAddress = route?.params?.userAddress ?? null;
  const friendAddress = route?.params?.friendAddress ?? null;
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { currentDay, getNumOfDaysFrom } = useLocationDetailFunctions();
  const now = new Date();
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  const navigation = useNavigation();
  // const [currentIndex, setCurrentIndex] = useState(0);
 
  const {
    faveLocations,
    nonFaveLocations,
    stickToLocation,
    setStickToLocation,
  } = useFriendLocationsContext();

  // const renderHeader = useCallback(
  //   () => (
  //     <GlobalAppHeader
  //       title={"LOCATIONS"}
  //       navigateTo={"Locations"}
  //       icon={LeavesTwoFallingOutlineThickerSvg}
  //       altView={false}
  //     />
  //   ),
  //   [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  // );

  // useEffect(() => {
  //   console.log(`stickto location`, stickToLocation);

  // }, [stickToLocation]);

  console.log(`current day: `, currentDay.day);
  const numberOfDays = 14;
  console.log(
    `${numberOfDays} days from now: `,
    getNumOfDaysFrom(numberOfDays).day
  );

const selectedDay = useRef({'index': null, 'day': ''});

useEffect(() => {
  if (currentDay?.index !== undefined && currentDay?.day !== undefined) {
    selectedDay.current = {
      index: currentDay.index,
      day: currentDay.day,
    };
  }
}, [currentDay]);
  //  const [selectedDay, setSelectedDay ] = useState(null);

  const handleSelectedDay = (object) => {
    if (object) {
      // console.log(object);
      // console.log("handleSelectedDay in parent: ", object.day, object.index);
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
    // <PreAuthSafeViewAndGradientBackground includeBackgroundOverlay={true}  style={{ flex: 1 }}>
 
    // <PreAuthSafeViewBackground>


    <SafeViewAndGradientBackground  style={{ flex: 1 }}>

      

      <CarouselSlider
        initialIndex={currentIndex}
        scrollToEdit={stickToLocation}
        scrollToEditCompleted={() => setStickToLocation(null)}
        data={[...faveLocations, ...nonFaveLocations]}
        // children={LocationViewPage}
        children={(props) => (
          <LocationViewPage
            {...props}
            currentDay={currentDay}
            selectedDay={selectedDay}
            handleSelectedDay={handleSelectedDay}
          />
        )}
        type={"location"}
        footerData={{ userAddress, friendAddress }}
        onRightPressSecondAction={handleNavToSendText}
      />
      {/* </PreAuthSafeViewAndGradientBackground> */}

{/* 
    </PreAuthSafeViewBackground>
    // </SafeViewAndGradientBackground> */}


    
    </SafeViewAndGradientBackground>

  );
};

export default ScreenLocationView;
