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
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import DistanceZigZagSvg from "@/app/assets/svgs/distance-zigzag.svg";
import ClockOutlineSvg from "@/app/assets/svgs/clock-outline.svg";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useTravelTimes from "@/src/hooks/useTravelTimes";
import LoadingPage from "../appwide/spinner/LoadingPage";

const LocationTravelTimes = ({
  location, 
  userAddress,
  friendAddress,
  smallClockIconSize=20,
  iconSize=34, 
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const [isModalVisible, setModalVisible] = useState(false);
  const { themeStyles, appContainerStyles } = useGlobalStyle(); 
  const { currentLocationDetails } = useCurrentLocation();
  const { checkCache, travelTimesMutation, travelTimeResults } = useTravelTimes();
  const [cachedTravelTimes, setCachedTravelTimes] = useState([]);
  const { defaultUserAddress } = useStartingUserAddresses();
  const { defaultAddress } = useStartingFriendAddresses();
  const [ triggerFetch, setTriggerFetch ] = useState(false);

  
 
  const navigation = useNavigation();

  const DOUBLE_PRESS_DELAY = 300;

  const SPACER_MARGIN_AFTER_CLOCK_ICON = 7;

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
    if (triggerFetch && location && userAddress && friendAddress) {
      try {
        //console.log(location);
        //console.log(defaultUserAddress);
        //console.log(defaultAddress);
  
        const locationData = {
          address_a_address: userAddress.address,
          address_a_lat: parseFloat(userAddress.lat),
          address_a_long: parseFloat(userAddress.lng),
          address_b_address: friendAddress.address,
          address_b_lat: parseFloat(friendAddress.lat),
          address_b_long: parseFloat(friendAddress.lng),
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
  }, [triggerFetch, userAddress, friendAddress, location, travelTimesMutation]);
  

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
    //disabled at least for now because of the address selectors
    // navigation.navigate("CalculateTravelTimes", {
    //   location: location,
    //   currentLocation: currentLocationDetails || null,
    // });
    //doesn't help
    closeModalAfterDelay();
  };

  useFocusEffect(
    React.useCallback(() => {
      if (location && defaultUserAddress && defaultAddress && !isModalVisible) {
 
        setCachedTravelTimes(
          checkCache(defaultUserAddress, defaultAddress, location)
        ); 
        //setIsCached(cachedData);
      }
    }, [location, defaultUserAddress, defaultAddress, isModalVisible])
  );
 
 
 

  return (
    <View style={styles.container}>
      {location && !String(location.id).startsWith("temp") && (
        <>

              {travelTimesMutation.isPending && (
        <View style={appContainerStyles.loadingFriendProfileButtonWrapper}>
          <LoadingPage
            loading={true}
            color={themeAheadOfLoading.darkColor}
            spinnerType="flow"
            spinnerSize={30}
            includeLabel={false}
          />
        </View>
      )}

      {!travelTimesMutation.isPending && (
        <>
         
            {(!cachedTravelTimes || !defaultUserAddress || !defaultAddress) && (
              <>
                <View style={{ position: "absolute", top: 4 }}>
                  <ClockOutlineSvg
                    width={smallClockIconSize}
                    height={smallClockIconSize}
                    color={themeStyles.genericText.color}
                    onPress={handlePress}
                  />
                </View>
                <DistanceZigZagSvg
                  width={iconSize}
                  height={iconSize}
                  color={themeStyles.genericText.color}
                  onPress={handlePress}
                />
              </>
            )}
            {cachedTravelTimes && defaultUserAddress && defaultAddress && (
              <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', width: 'auto', flexShrink: 1 }}>
               <View style={{ marginRight: SPACER_MARGIN_AFTER_CLOCK_ICON, width: iconSize}}>
                <ClockOutlineSvg
                  width={iconSize}
                  height={iconSize}
                  color={themeAheadOfLoading.lightColor}
                  onPress={handlePress}
                />
                </View>
                
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
    width: 'auto', 
    alignItems: 'center', 
    height: '100%',
    overflow: 'hidden',
     
    
    
     
  }, 
  saveText: {
    marginLeft: 8,
  },
  travelTimesTextContainer: { 
    textAlign: 'flex-end', 
    flexDirection: 'column', 
    
     

  },
  travelTimeText: {
    fontSize: 11,
    fontWeight: 'bold',
    alignSelf: 'flex-end', //OH YAY THIS WORKS


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
