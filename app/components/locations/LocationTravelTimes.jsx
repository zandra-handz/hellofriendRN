// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, {  useRef, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  SimpleLineIcons, 
  FontAwesome5,
} from "@expo/vector-icons";   
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useTravelTimes from "@/src/hooks/useTravelTimes";
import LoadingPage from "../appwide/spinner/LoadingPage";

const LocationTravelTimes = ({
  userId,
  friendId,
  location,
  userAddress,
  friendAddress, 
  iconSize = 34,
  themeAheadOfLoading,
  primaryColor = 'orange',
}) => {   
  const { defaultUserAddress } = useStartingUserAddresses({userId: userId});
  const { defaultAddress } = useStartingFriendAddresses({userId: userId, friendId: friendId});

  const {
    travelTimeResults,
    isTravelTimesPending,
    isTravelTimesLoading,
    cachedData,
    toggleFetch,
  } = useTravelTimes(userAddress, friendAddress, location, false); // true to enable fetching automatically

 

  const DOUBLE_PRESS_DELAY = 300;

  const SPACER_MARGIN_AFTER_CLOCK_ICON = 7;

  const lastPress = useRef(0);
  const pressTimeout = useRef(null);

 

  const handleSinglePress = () => {
    handleGoToCalculateTravelTimesScreen();
  };

  const handleDoublePress = () => {
    toggleFetch();
    // triggerFetch();
    //navigateToAddMoment();
  };

  // useEffect(() => {
  //   if (triggerFetch && location && userAddress && friendAddress) {
  //     try {
  //       //console.log(location);
  //       //console.log(defaultUserAddress);
  //       //console.log(defaultAddress);

  //       const locationData = {
  //         address_a_address: userAddress.address,
  //         address_a_lat: parseFloat(userAddress.lat),
  //         address_a_long: parseFloat(userAddress.lng),
  //         address_b_address: friendAddress.address,
  //         address_b_lat: parseFloat(friendAddress.lat),
  //         address_b_long: parseFloat(friendAddress.lng),
  //         destination_address: location.address,
  //         destination_lat: parseFloat(location.latitude),
  //         destination_long: parseFloat(location.longitude),
  //         perform_search: false,
  //       };

  //       // Trigger the mutation with the prepared location data
  //       travelTimesMutation.mutate(locationData);

  //       //console.log("Travel comparisons requested successfully");
  //     } catch (error) {
  //       console.error("Error getting travel comparisons:", error);
  //     }

  //     // Reset the trigger
  //     setTriggerFetch(false);
  //   }
  // }, [triggerFetch, userAddress, friendAddress, location, travelTimesMutation]);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) {
      clearTimeout(pressTimeout.current);
      handleDoublePress();
    } else {
      pressTimeout.current = setTimeout(() => {
        handleSinglePress();
      }, DOUBLE_PRESS_DELAY);
    }
    lastPress.current = now;
  };

  // useEffect(() => {
  //   if (travelTimeResults) {
  //     setCachedTravelTimes(travelTimeResults);
  //   }
  // }, [travelTimeResults]);

  const handleGoToCalculateTravelTimesScreen = () => {
    //disabled at least for now because of the address selectors
    // navigation.navigate("CalculateTravelTimes", {
    //   location: location,
    //   currentLocation: currentLocationDetails || null,
    // }); 
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (location && defaultUserAddress && defaultAddress && !isModalVisible) {
  //       setCachedTravelTimes(
  //         checkCache(defaultUserAddress, defaultAddress, location)
  //       );
  //       //setIsCached(cachedData);
  //     }
  //   }, [location, defaultUserAddress, defaultAddress, isModalVisible])
  // );

  const RenderFetchTimesButton = useCallback(
    () => (
      <Pressable
        style={{
          flexDirection: "row",
          flex: 1,
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "ceter",
          maxWidth: 50,
        }}
        onPress={handlePress}
      >
        <View style={{ position: "absolute", left: 0 }}>
          <FontAwesome5
            name="user-clock"
            size={20}
            color={primaryColor}
          />
        </View>
        <View style={{ position: "absolute", right: 0, top: 10 }}>
          <FontAwesome5
            name="user-clock"
            size={20}
            color={themeAheadOfLoading.lightColor}
          />
        </View>
        {/* <View  >
                    <SimpleLineIcons
            name="directions"
            size={iconSize}
            color={themeAheadOfLoading.lightColor}
          />

        </View> */}
      </Pressable>
    ),
    [themeAheadOfLoading, handlePress]
  );

  const RenderClockButton = useCallback(
    () => (
      <Pressable
        onPress={handlePress}
        style={{
          marginRight: SPACER_MARGIN_AFTER_CLOCK_ICON,
          width: iconSize,
        }}
      >
        <SimpleLineIcons
          name={"clock"}
          size={iconSize}
          color={themeAheadOfLoading.lightColor}
        />
      </Pressable>
    ),
    [SPACER_MARGIN_AFTER_CLOCK_ICON, iconSize, themeAheadOfLoading, handlePress]
  );

  return (
    <View style={styles.container}>
      {location && !String(location.id).startsWith("temp") && (
        <>
          {isTravelTimesLoading && (
            <View style={styles.loadingFriendProfileButtonWrapper}>
              <LoadingPage
                loading={true}
                color={themeAheadOfLoading.darkColor}
                spinnerType="flow"
                spinnerSize={30}
                includeLabel={false}
              />
            </View>
          )}

          {!isTravelTimesLoading && (
            <>
              {((!travelTimeResults && !cachedData && defaultUserAddress?.id && defaultAddress?.id)) && (
                <>
                  <RenderFetchTimesButton />
                </>
              )}
              {(travelTimeResults || cachedData) &&
                defaultUserAddress &&
                defaultAddress && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "auto",
                      flexShrink: 1,
                    }}
                  >
                    <RenderClockButton />

                    <View style={styles.travelTimesTextContainer}>
                      <Text
                        style={[styles.travelTimeText, {color: primaryColor}]}
                      >
                        {travelTimeResults?.compare_directions?.Me?.duration ||
                          cachedData?.compare_directions?.Me?.duration ||
                          "N/A"}
                      </Text>
                      <Text
                        style={[
                          styles.travelTimeText,
                          { color: themeAheadOfLoading.lightColor },
                        ]}
                      >
                        {travelTimeResults?.compare_directions?.friend
                          ?.duration ||
                          cachedData?.compare_directions?.friend?.duration ||
                          "N/A"}
                      </Text>
                    </View>
                  </View>
                )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexSrink: 1,
    width: "auto",
    alignItems: "center",
    height: "100%",
    overflow: "hidden",
  },
    loadingFriendProfileButtonWrapper: {
    flex: 0.4,
    paddingRight: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  saveText: {
    marginLeft: 8,
  },
  travelTimesTextContainer: {
    textAlign: "flex-end",
    flexDirection: "column",
  },
  travelTimeText: {
    fontSize: 11,
    fontWeight: "bold",
    alignSelf: "flex-end", //OH YAY THIS WORKS
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  textContainer: {
    padding: 20,
  },
  containerTitle: {
    fontSize: 16,
    marginBottom: "4%",
  },
  textInput: {
    textAlign: "top",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default LocationTravelTimes;
