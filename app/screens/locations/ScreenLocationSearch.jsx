import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

import LocationsMapView from "@/app/components/locations/LocationsMapView";
import MapScreenFooter from "@/app/components/headers/MapScreenFooter";
import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

// import {
//   useGeolocationWatcher,
// } from "@/src/hooks/useCurrentLocationAndWatcher";

import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
 
import { useRoute } from "@react-navigation/native";
 
import useMenues from "@/src/hooks/useMenues";

const ScreenLocationSearch = () => {
  const route = useRoute();
  const { getDefaultAddress, getDefaultUserAddress } = useMenues();
  // const userAddress = route?.params?.userAddress ?? null;
  // const friendAddress = route?.params?.friendAddress ?? null;
  // useGeolocationWatcher();
  const { getCurrentDay } = useLocationDetailFunctions();
  const { faveLocations, nonFaveLocations, pastHelloLocations } =
    useFriendLocationsContext();

  const { bermudaCoords } = useLocationHelloFunctions();
  4;
  const { userAddresses } = useStartingUserAddresses();
  const { friendAddresses } = useStartingFriendAddresses();

  const [userAddress, setUserAddress] = useState({
    address: "Loading",
    id: "",
  });

  const [friendAddress, setFriendAddress] = useState({
    address: "Loading",
    id: "",
  });
  useEffect(() => {
    if (userAddresses && userAddresses.length > 0) {
      const defaultUserAddress = getDefaultUserAddress(userAddresses);
      setUserAddress({
        address: defaultUserAddress?.address ?? "No address selected",
        id: defaultUserAddress?.id ?? "",
      });
    } else {
      setUserAddress({
              address: "No address selected",
      id: "",
      })
    }
  }, [userAddresses]);

  // Update when defaultAddress becomes available
  useEffect(() => {
    if (friendAddresses && friendAddresses.length > 0) {
  
      const defaultFriendAddress = getDefaultAddress(friendAddresses);
      // console.log(`default friend`, defaultFriendAddress);
      setFriendAddress({
        address: defaultFriendAddress?.address ?? "No address selected",
        id: defaultFriendAddress?.id ?? "",
      });
    } else {
      setFriendAddress({
        address: "No address selected",
        id: "",
      });
    }
  }, [friendAddresses]);

 
  //   useFocusEffect(
  //     useCallback(() => {
  //       if (!defaultAddress || !defaultUserAddress) {

  // Alert.alert(
  //         "Warning!",
  //         `Some features will not be available to you unless both addresses are set.`,
  //         [
  //           {
  //             text: "Got it",
  //             onPress: () => {},
  //             style: "cancel",
  //           },
  //           {
  //             text: "Open address settings",
  //             onPress: () => console.log('open modal here'),
  //           },
  //         ]
  //       );

  //       }

  //     }, []));

  const renderMapScreenFooter = useCallback(() => {
    return (
      <MapScreenFooter
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        friendAddress={friendAddress}
        setFriendAddress={setFriendAddress}
      />
    );
  }, [userAddress, setUserAddress, friendAddress, setFriendAddress]);

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    <SafeViewAndGradientBackground
      includeBackgroundOverlay={true}
      primaryBackground={true}
      style={{ flex: 1 }}
    >
      {pastHelloLocations && (
        <>
          <View style={styles.mapContainer}>
            <LocationsMapView
              userAddress={userAddress}
              friendAddress={friendAddress}
              pastHelloLocations={pastHelloLocations}
              faveLocations={faveLocations}
              nonFaveLocations={nonFaveLocations}
              currentDayDrilledOnce={getCurrentDay()}
              bermudaCoordsDrilledOnce={bermudaCoords}
            />
          </View>
        </>
      )}
      {renderMapScreenFooter()}
    </SafeViewAndGradientBackground>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1, // This ensures it takes up available space
    justifyContent: "flex-start",
  },
});

export default ScreenLocationSearch;
