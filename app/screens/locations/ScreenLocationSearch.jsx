import React, { useLayoutEffect, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

import LocationsMapView from "@/app/components/locations/LocationsMapView";
// import { useHelloes } from "@/src/context/HelloesContext";

import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
// import {
//   useGeolocationWatcher,
// } from "@/src/hooks/useCurrentLocationAndWatcher";

import { useLocations } from "@/src/context/LocationsContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";

const ScreenLocationSearch = () => {
  // useGeolocationWatcher();

  // const { locationList } = useLocations();
  // const { helloesList } = useHelloes();
  // const { friendDashboardData } = useSelectedFriend();
  const { getCurrentDay } = useLocationDetailFunctions();
  const { faveLocations, nonFaveLocations, pastHelloLocations } =
    useFriendLocationsContext();

  const {  bermudaCoords } =
    useLocationHelloFunctions();
  4;
  // MOVED TO ITS OWN CONTEXT BECAUSE I NEED THIS SAME LIST FOR THE VIEW SCREENS
  // const makeSplitLists = (list, isFaveCondition, helloCheck) => {
  //   return list.reduce(
  //     ([fave, notFave], item) => {
  //       const isFave = isFaveCondition(item);
  //       const matchingHellos = helloCheck(item); // returns an array of matching hellos
  //       const helloCount = matchingHellos.length;

  //       const newItem = {
  //         ...item,
  //         isFave,
  //         isPastHello: helloCount > 0,
  //         helloCount,
  //       };

  //       return isFave
  //         ? [[...fave, newItem], notFave]
  //         : [fave, [...notFave, newItem]];
  //     },
  //     [[], []]
  //   );
  // };

  //   const inPersonHelloes = useMemo(() => {
  //     if (helloesList) {
  //       return helloesList?.filter((hello) => hello.type === "in person");
  //     }
  //   }, [helloesList]);

  // const [faveLocations, nonFaveLocations] = useMemo(() => {
  //   if (
  //     locationList &&
  //     inPersonHelloes &&
  //     friendDashboardData?.[0]?.friend_faves?.locations
  //   ) {
  //     return makeSplitLists(
  //       locationList,
  //       (location) =>
  //         friendDashboardData[0].friend_faves.locations.includes(location.id),
  //       (location) =>
  //         inPersonHelloes.filter((hello) => hello.location === location.id)
  //     );
  //   }
  //   return [[], []];
  // }, [locationList, friendDashboardData, inPersonHelloes]);

  //   const sortedLocations = useMemo(() => {
  //     if (locationList && inPersonHelloes && faveLocations) {
  //       return createLocationListWithHelloes(inPersonHelloes, faveLocations);
  //     }
  //     return [];
  //   }, [locationList, inPersonHelloes, faveLocations]);

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
