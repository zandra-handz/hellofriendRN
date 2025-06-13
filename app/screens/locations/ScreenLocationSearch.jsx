import React from "react";
import { View, StyleSheet } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

import LocationsMapView from "@/app/components/locations/LocationsMapView";

import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
// import {
//   useGeolocationWatcher,
// } from "@/src/hooks/useCurrentLocationAndWatcher";

import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";

const ScreenLocationSearch = () => {
  // useGeolocationWatcher();
  const { getCurrentDay } = useLocationDetailFunctions();
  const { faveLocations, nonFaveLocations, pastHelloLocations } =
    useFriendLocationsContext();

  const { bermudaCoords } = useLocationHelloFunctions();
  4;

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
              pastHelloLocations={pastHelloLocations}
              faveLocations={faveLocations}
              nonFaveLocations={nonFaveLocations}
              currentDayDrilledOnce={getCurrentDay()}
              bermudaCoordsDrilledOnce={bermudaCoords}
            />
          </View>
        </>
      )}
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
