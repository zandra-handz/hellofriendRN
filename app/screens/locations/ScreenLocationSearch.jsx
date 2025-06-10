import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import LocationsMapView from "@/app/components/locations/LocationsMapView";

import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
// import {
//   useGeolocationWatcher,
// } from "@/src/hooks/useCurrentLocationAndWatcher";

import { useHelloes } from "@/src/context/HelloesContext";
import { useLocations } from "@/src/context/LocationsContext";

const ScreenLocationSearch = () => {
  // useGeolocationWatcher();

  const { locationList } = useLocations();
  const { getCurrentDay } = useLocationDetailFunctions();
  const { getCachedInPersonHelloes } = useHelloes();
  const { createLocationListWithHelloes, bermudaCoords } =
    useLocationHelloFunctions();

  const inPersonHelloes = getCachedInPersonHelloes();

  const [sortedLocations, setSortedLocations] = useState([]);

  useLayoutEffect(() => {
    if (locationList && inPersonHelloes) {
      const newList = createLocationListWithHelloes(
        locationList,
        inPersonHelloes
      );
      setSortedLocations(newList);
    }
  }, [locationList, inPersonHelloes]);

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
      <SafeViewAndGradientBackground includeBackgroundOverlay={true} primaryBackground={true} style={{ flex: 1 }}>
        {sortedLocations && (
          <>
            <View style={styles.mapContainer}>
              <LocationsMapView
                sortedLocations={sortedLocations}
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
