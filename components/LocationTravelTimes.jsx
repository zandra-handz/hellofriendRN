// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text, 
  StyleSheet,
} from "react-native"; 
import { useFriendList } from "../context/FriendListContext";
import { useGlobalStyle } from "../context/GlobalStyleContext"; 
import DistanceZigZagSvg from "../assets/svgs/distance-zigzag.svg";
import ClockOutlineSvg from "../assets/svgs/clock-outline.svg";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useStartingUserAddresses from "../hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "../hooks/useStartingFriendAddresses";
import useTravelTimes from "../hooks/useTravelTimes";
const LocationTravelTimes = ({
  location,
  favorite = false,
  size = 11,
  iconSize = 16,
  family = "Poppins-Bold",
  color = "black",
  style,
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const [isModalVisible, setModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const [isCached, setIsCached] = useState(false);
  const { currentLocationDetails } = useCurrentLocation();
  const { checkCache, fetchTravelTimes, travelTimesMutation, travelTimeResults } = useTravelTimes();
  const [cachedTravelTimes, setCachedTravelTimes] = useState([]);
  const { defaultUserAddress } = useStartingUserAddresses();
  const { defaultAddress } = useStartingFriendAddresses();
  const [ triggerFetch, setTriggerFetch ] = useState(false);

  
 
  const navigation = useNavigation();

  const DOUBLE_PRESS_DELAY = 300;

  const lastPress = useRef(0);
  const pressTimeout = useRef(null);

  const closeModalAfterDelay = () => {
    let timeout;
    timeout = setTimeout(() => {
      setModalVisible(false);
    }, 1000);
  };

  const handleSinglePress = () => {
    handleGoToCalculateTravelTimesScreen();

  };
 
  const handleDoublePress = () => {
    setTriggerFetch(true);
    //navigateToAddMoment();
  };

  useEffect(() => {
    if (triggerFetch && location && defaultUserAddress && defaultAddress) {
      try {
        //console.log(location);
        //console.log(defaultUserAddress);
        //console.log(defaultAddress);
  
        const locationData = {
          address_a_address: defaultUserAddress.address,
          address_a_lat: parseFloat(defaultUserAddress.lat),
          address_a_long: parseFloat(defaultUserAddress.lng),
          address_b_address: defaultAddress.address,
          address_b_lat: parseFloat(defaultAddress.lat),
          address_b_long: parseFloat(defaultAddress.lng),
          destination_address: location.address,
          destination_lat: parseFloat(location.latitude),
          destination_long: parseFloat(location.longitude),
          perform_search: false,
        };
  
        // Trigger the mutation with the prepared location data
        travelTimesMutation.mutate(locationData);
        
  
        //console.log("Travel comparisons requested successfully");
      } catch (error) {
        console.error("Error getting travel comparisons:", error);
      }
  
      // Reset the trigger
      setTriggerFetch(false);
    }
  }, [triggerFetch, defaultUserAddress, defaultAddress, location, travelTimesMutation]);
  

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

  useEffect(() => {
    if (travelTimeResults) {
        setCachedTravelTimes(travelTimeResults);
    }

  }, [travelTimeResults]);
  

  const handleGoToCalculateTravelTimesScreen = () => {
    navigation.navigate("CalculateTravelTimes", {
      location: location,
      currentLocation: currentLocationDetails || null,
    });
    //doesn't help
    closeModalAfterDelay();
  };

  useFocusEffect(
    React.useCallback(() => {
      if (location && defaultUserAddress && defaultAddress && !isModalVisible) {
        //console.log(location);
        //console.log(defaultUserAddress);
        //console.log(defaultAddress);
        setCachedTravelTimes(
          checkCache(defaultUserAddress, defaultAddress, location)
        );
        //console.log(cachedData);
        //setIsCached(cachedData);
      }
    }, [location, defaultUserAddress, defaultAddress, isModalVisible])
  );
 
 
 

  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            {!cachedTravelTimes && (
              <>
                <View style={{ position: "absolute", top: -6 }}>
                  <ClockOutlineSvg
                    width={20}
                    height={20}
                    color={themeStyles.genericText.color}
                    onPress={handlePress}
                  />
                </View>
                <DistanceZigZagSvg
                  width={34}
                  height={34}
                  color={themeStyles.genericText.color}
                  onPress={handlePress}
                />
              </>
            )}
            {cachedTravelTimes && (
              <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <ClockOutlineSvg
                  width={34}
                  height={34}
                  color={themeAheadOfLoading.lightColor}
                  onPress={handlePress}
                />
                <View style={styles.travelTimesTextContainer}>
                <Text style={[styles.travelTimeText, themeStyles.genericText]}>
                  {cachedTravelTimes?.Me?.duration || "N/A"}
                </Text>
                <Text style={[styles.travelTimeText, {color: themeAheadOfLoading.lightColor}]}>
                  {cachedTravelTimes?.friend?.duration || "N/A"}
                </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 2,
  },
  iconContainer: {
    margin: 0,
  },
  saveText: {
    marginLeft: 8,
  },
  travelTimesTextContainer: { 
    textAlign: 'right',
    alignItems: 'flex-end',
    flexDirection: 'column',
    paddingLeft: '16%',

  },
  travelTimeText: {
    fontSize: 11,
    fontWeight: 'bold',

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
