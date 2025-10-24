// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SimpleLineIcons, FontAwesome5 } from "@expo/vector-icons";
// import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
// import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useTravelTimes from "@/src/hooks/useTravelTimes";
import LoadingPage from "../appwide/spinner/LoadingPage";

const LocationTravelTimes = ({
  // userId,
  // friendId,
  location,
  userAddress,
  friendAddress,
  iconSize = 20,
  themeColors,
  primaryColor = "orange",
}) => {
  
  // const userAddress =
  //   userAddresses?.chosen || userAddresses?.saved?.[0] || null;
  // console.log(`in travel componentent`, userAddress);

  // // const friendAddress =
  // //   friendAddresses?.chosen || friendAddresses?.saved?.[0] || null;

  // console.log(`in travel componentent`, friendAddress);
  // console.log(`DESTINATION in travel component`, location);
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
 
  const handleGoToCalculateTravelTimesScreen = () => {
    //disabled at least for now because of the address selectors
    // navigation.navigate("CalculateTravelTimes", {
    //   location: location,
    //   currentLocation: currentLocationDetails || null,
    // });
  };

 
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
          maxWidth: 40,
          backgroundColor: 'hotpink'
        }}
        onPress={handlePress}
      >
        <View style={{ position: "absolute", left: 0 }}>
          <FontAwesome5 name="user-clock" size={iconSize-5} color={primaryColor} />
        </View>
        <View style={{ position: "absolute", right: 0, top: 10-5 }}>
          <FontAwesome5
            name="user-clock"
            size={iconSize-5}
            color={themeColors.lightColor}
          />
        </View> 
      </Pressable>
    ),
    [themeColors, handlePress]
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
          color={themeColors.lightColor}
        />
      </Pressable>
    ),
    [SPACER_MARGIN_AFTER_CLOCK_ICON, iconSize, themeColors, handlePress]
  );

  return (
    <View style={styles.container}>
      {location && !String(location.id).startsWith("temp") && (
        <>
          {isTravelTimesLoading && (
            <View style={styles.loadingFriendProfileButtonWrapper}>
              <LoadingPage
                loading={true}
                color={themeColors.darkColor}
                spinnerType="flow"
                spinnerSize={20}
                includeLabel={false}
              />
            </View>
          )}

          {!isTravelTimesLoading && (
            <>
              {!travelTimeResults &&
                !cachedData &&
                userAddress?.id &&
                friendAddress?.id && (
                  <>
                    <RenderFetchTimesButton />
                  </>
                )}
              {(travelTimeResults || cachedData) &&
                userAddress?.id &&
                friendAddress?.id && (
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
                        style={[styles.travelTimeText, { color: primaryColor }]}
                      >
                        {travelTimeResults?.compare_directions?.Me?.duration ||
                          cachedData?.compare_directions?.Me?.duration ||
                          "N/A"}
                      </Text>
                      <Text
                        style={[
                          styles.travelTimeText,
                          { color: themeColors.lightColor },
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
    minWidth: 80,
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
