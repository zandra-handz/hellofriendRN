//removed midpoint searcher and whatever else it did for right now:  <ButtonGoToFindLocation />
// <LocationHeartSolidSvg height={30} width={30} color="red" />
// <ButtonGoToLocationFunctions />
//<Image source={require('../assets/shapes/coffeecupnoheart.png')} style={{ height: 35, width: 35 }}/>
//midpoints screen is crashing right now so commented out

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  Text,
  Dimensions,
  FlatList,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import LocationOverMapButton from "./LocationOverMapButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";

import FocusedLocationCardUI from "./FocusedLocationCardUI";

import { useMessage } from "@/src/context/MessageContext";

import { useLocations } from "@/src/context/LocationsContext";

import useCurrentLocation from "@/src/hooks/useCurrentLocation";

import DualLocationSearcher from "./DualLocationSearcher";

const LocationsMapView = ({
  pastHelloLocations,
  faveLocations,
  nonFaveLocations,
  currentDayDrilledOnce,
  bermudaCoordsDrilledOnce,
}) => {
  //i think when i put this in the parent screen it starts up faster?
  //useGeolocationWatcher();
  const mapRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showMessage } = useMessage();
  const { locationList } = useLocations();
  const { currentLocationDetails, currentRegion } = useCurrentLocation();
  const navigation = useNavigation();
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [appOnlyLocationData, setAppOnlyLocationData] = useState(null);

  const listItemIconSize = 15;
  const listItemIconPadding = 6;
  const listItemIconDiameter = listItemIconSize + listItemIconPadding * 2;

  const listItemIconTwoSize = 15;
  const listItemIconTwoPadding = 6;
  const listItemIconTwoDiameter = listItemIconSize + listItemIconPadding * 2;

  // use item.isFave (property added when sorting in parent screen) to differentiate UI for saved locations
  const renderLocationItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={{
          height: 60,
          padding: 10,
          width: "100%",
          flexDirection: "row",
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          marginVertical: 0.5,
          justifyContent: "space-between",
        }}
        onPress={() => handlePress(item)}
      >
        <View
          style={{ flexDirection: "column", alignText: "left", flexShrink: 1 }}
        >
          <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
            {item.title}
          </Text>

          <Text style={[themeStyles.primaryText, { fontSize: 11 }]}>
            {item.address}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {item.isPastHello && (
            <View
              style={{
                marginHorizontal: 2, // CAREFUL, switch this if putting this on the outer side again
                padding: listItemIconTwoPadding,
                height: listItemIconTwoDiameter,
                width: listItemIconTwoDiameter,
                borderRadius: listItemIconTwoDiameter / 2,
                backgroundColor: themeStyles.primaryText.color,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {item.helloCount}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="hand-wave-outline"
                //  name="heart"
                size={listItemIconTwoSize}
                color={themeAheadOfLoading.darkColor}
                opacity={0.6}
              />
            </View>
          )}
          {item.isFave && (
            <View
              style={{
                marginLeft: 2,
                padding: listItemIconPadding,
                height: listItemIconDiameter,
                width: listItemIconDiameter,
                borderRadius: listItemIconDiameter / 2,
                backgroundColor: themeStyles.primaryText.color,
              }}
            >
              <MaterialCommunityIcons
                // name="map-marker-star"
                name="heart"
                size={listItemIconSize}
                color={themeAheadOfLoading.darkColor}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [faveLocations, nonFaveLocations]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `location-${index}`;

  useEffect(() => {
    if (currentLocationDetails && currentRegion) {
      handleLocationAlreadyExists(currentLocationDetails);
      //console.log('current location details in map view', currentLocationDetails);
      mapRef.current.animateToRegion(currentRegion, 200);
    }
  }, [currentRegion]);

const handleLocationAlreadyExists = (locationDetails, addMessage) => {
  let matchedLocation;
  let locationIsOutsideFaves = false;

  let index = pastHelloLocations.findIndex(
    (location) => String(location.address) === String(locationDetails.address)
  );

  if (index !== -1) {
    matchedLocation = { ...pastHelloLocations[index], matchedIndex: index };
  } else {
    index = locationList.findIndex(
      (location) => String(location.address) === String(locationDetails.address)
    );

    if (index !== -1) {
      matchedLocation = { ...locationList[index], matchedIndex: index };
      locationIsOutsideFaves = true;
    }
  }

  setFocusedLocation(matchedLocation || locationDetails);

  return {
    matchedLocation: matchedLocation || locationDetails,
    locationIsOutsideFaves,
  };
};

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleGoToLocationSendScreen = () => {
    navigation.navigate("LocationSend", {
      location: focusedLocation,
      weekdayTextData: null,
      selectedDay: currentDayDrilledOnce,
    });
  };

  const handleGoToLocationViewScreen = () => {
    navigation.navigate("LocationView", {
      index: focusedLocation.matchedIndex,
    });
      
  }

  const handleGoToMidpointLocationSearchScreen = () => {
    navigation.navigate("MidpointLocationSearch");
  };

  //i had taken this out but brought it back in because if i use sorted
  //list for the bottom scroll, it doesn't update when a new favorite is added;
  //i don't like having both sortedLocations passed in AND using the locationFuctions
  //for this

  // Moved to parent
  //   const makeSplitLists = (list, condition) => {
  //   return list.reduce(
  //     ([fave, notFave], item) => {
  //       const isFave = condition(item);
  //       const newItem = { ...item, isFave };

  //       return isFave
  //         ? [[...fave, newItem], notFave]
  //         : [fave, [...notFave, newItem]];
  //     },
  //     [[], []]
  //   );
  // };

  // Moved to parent to calculate while calculating the helloes
  // const [faveLocations, nonFaveLocations] = useMemo(() => {
  //   if (locationList) {
  //     return makeSplitLists(locationList, (location) =>
  // friendDashboardData[0].friend_faves.locations.includes(location.id)
  //   );

  //   }
  // }, [locationList, friendDashboardData]);

  // Function to fit all markers
  const fitToMarkers = () => {
    if (mapRef.current && faveLocations && pastHelloLocations.length > 0) {
      const coordinates = faveLocations
        .filter(
          (location) =>
            location.latitude !== 25.0 || location.longitude !== -71.0
        )
        .map((location) => ({
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
        }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  // const findHelloesAtLocation = (singleLocationId) => {
  // if (singleLocationId) {
  // const matchingHelloes = inPersonHelloes.filter(
  // hello => hello.location === singleLocationId
  // );
  // return matchingHelloes.length;
  // }
  // };

  const soonButtonWidth = 190;
  const soonListRightSpacer = Dimensions.get("screen").width - 136;
  const buttonRightSpacer = 6;

  const handlePress = (location) => {
    if (location) {
      handleLocationAlreadyExists(location, true); //true is for addMessage
      const appOnly = pastHelloLocations.find(
        (item) => item.id === location.id
      );
      setAppOnlyLocationData(appOnly || null);
    }
  };

  const renderListItem = useCallback(
    ({ item, index }) => (
      <View
        style={{
          marginRight: buttonRightSpacer,
          paddingVertical: 4,
          height: "90%",
        }}
      >
        <LocationOverMapButton
          height={"100%"}
          friendName={item.title || item.address}
          width={soonButtonWidth}
          onPress={() => handlePress(item)}
        />
      </View>
    ),
    [handlePress]
  );

  useEffect(() => {
    if (focusedLocation) {
      try {
        const { latitude, longitude } = focusedLocation;
        //console.log(latitude, longitude);

        // Validate latitude and longitude are defined and within valid range
        if (
          mapRef.current &&
          latitude !== bermudaCoordsDrilledOnce.latitude &&
          longitude !== bermudaCoordsDrilledOnce.longitude
        ) {
          mapRef.current.animateToRegion(
            {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
            200
          );
        } else {
          console.warn("Invalid latitude or longitude:", {
            latitude,
            longitude,
          });
        }
      } catch (error) {
        console.error("Error animating map region:", error);
      }
    }
  }, [focusedLocation]);

  const darkMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: "#212121" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#212121" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#181818" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1b1b1b" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8a8a8a" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#373737" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#3c3c3c" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#4e4e4e" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#3d3d3d" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#2e2e2e" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3d3d3d" }],
    },
  ];

  const MemoizedMarker = React.memo(({ location }) => {
    if (location.latitude === 25.0 && location.longitude === -71.0) {
      return null; // Skip Bermuda Triangle
    }

    return (
      <Marker
        key={location.id.toString()}
        coordinate={{
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
        }}
        title={location.title}
        description={location.address}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "bold",
                zIndex: 1000,
                position: "absolute",
                top: -12,
                right: -8,
                backgroundColor: "yellow",
                padding: 4,
                borderRadius: 20,
                fontSize: 12,
              }}
            >
              {location.helloCount}
            </Text>
          </View>
          <MaterialCommunityIcons
            // name="map-marker-star"
            name="hand-wave-outline"
            size={35}
            color="red"
          />
        </View>
      </Marker>
    );
  });

  const renderLocationsMap = (locations) => (
    <>
      <MapView
        {...(Platform.OS === "android" && { provider: PROVIDER_GOOGLE })}
        ref={mapRef}
        liteMode={isKeyboardVisible ? true : false}
        style={[styles.map, { height: isKeyboardVisible ? "100%" : "100%" }]}
        initialRegion={currentRegion || null}
        scrollEnabled={isKeyboardVisible ? false : true}
        enableZoomControl={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        //customMapStyle={colorScheme === 'dark' ? darkMapStyle : null}
      >
        {locations?.map((location) => (
          <MemoizedMarker key={location.id.toString()} location={location} />
        ))}
      </MapView>
      {!isKeyboardVisible && (
        <TouchableOpacity
          style={[
            styles.midpointsButton,
            {
              zIndex: 7000,
              backgroundColor:
                themeStyles.genericTextBackground.backgroundColor,
            },
          ]}
          onPress={handleGoToMidpointLocationSearchScreen}
        >
          <Text style={[styles.zoomOutButtonText, themeStyles.genericText]}>
            Midpoints
          </Text>
        </TouchableOpacity>
      )}

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={[
            styles.zoomOutButton,
            {
              zIndex: 7000,
              backgroundColor:
                themeStyles.genericTextBackground.backgroundColor,
            },
          ]}
          onPress={fitToMarkers}
        >
          <Text style={[styles.zoomOutButtonText, themeStyles.genericText]}>
            Show All
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.dualLocationSearcherContainer}>
        <DualLocationSearcher
          onPress={handlePress}
          locationListDrilledOnce={locationList}
        />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* {locationDetailsAreOpen && (
        <FadeInOutWrapper
          isVisible={locationDetailsAreOpen}
          children={
            <LinearGradient
              colors={[
                themeAheadOfLoading.darkColor,
                themeAheadOfLoading.lightColor,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.gradientCover,
                { zIndex: locationDetailsAreOpen ? 4000 : 1000 },
              ]}
            />
          }
        />
      )} */}

      {pastHelloLocations && (
        <>
          {renderLocationsMap(pastHelloLocations)}

          {!isKeyboardVisible && (
            <View
              style={{
                width: "100%",
                // height: 70,
                zIndex: 1200,
                elevation: 1200,
                flexDirection: "column",
                position: "absolute",
                bottom: 0,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
            
              <FocusedLocationCardUI focusedLocation={focusedLocation} onSendPress={handleGoToLocationSendScreen} onViewPress={handleGoToLocationViewScreen} />
              <View
                style={{
                  backgroundColor:
                    themeStyles.overlayBackgroundColor.backgroundColor,
                  // flex: 1,
                  height: 230,
                  width: "100%",
                }}
              >
                {pastHelloLocations && (
                  <FlatList
                    data={[...faveLocations, ...nonFaveLocations]}
                    keyExtractor={extractItemKey}
                    renderItem={renderLocationItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                  />
                )}
              </View>
            </View>
          )}
        </>
      )}

      {/* 
      <ExpandableUpCard
        onPress={() => {
          //handleGoToLocationViewScreen(focusedLocation) //scaffolding during transition to keep build functional
        }}
        useParentButton={true}
        parentTriggerToExpand={expandStateFromParent}
        parentFunctionToTrackOpenClose={toggleLocationDetailsState} //use locationDetailsAreOpen to act on
        content={
          focusedLocation ? (
            <LocationDetailsBody
              locationObject={focusedLocation}
              appOnlyLocationObject={appOnlyLocationData}
              currentDayDrilledTwice={currentDayDrilledOnce}
            />
          ) : null //I'm not sure if this would return error, the LocationDetailsBody has checks in place already
          //and will return an empty container if no focusedLocation
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "orange",
  },
  dualLocationSearcherContainer: {
    position: "absolute",
    top: 0,
    flex: 1,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "pink",
  },
  gradientCover: {
    width: "100%",
    flex: 1,
  },
  gradientBelowFaves: {
    width: "100%",
    flex: 1,
    zIndex: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "37%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    paddingTop: 60,
    zIndex: 3,
  },
  detailsContainer: {
    flexGrow: 1,
    width: "100%",
    padding: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    marginTop: "0%",
  },
  detailsSubtitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  scrollContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    zIndex: 1000,
    justifyContent: "flex-end",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  scrollTitleContainer: {
    width: "100%",
    zIndex: 1000,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "left",
    alignItems: "left",
    textAlign: "left",
    paddingHorizontal: "3%",
    paddingBottom: "1%",
    borderWidth: 0,
    borderColor: "gray",
  },
  friendNameText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  midpointsButton: {
    position: "absolute",
    zIndex: 3000,
    top: 120,
    right: 4,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  zoomOutButton: {
    position: "absolute",
    zIndex: 4,
    right: 4,
    top: 170,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  zoomOutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sliderContainer: {
    width: 40,
    position: "absolute",
    justifyContent: "flex-end",
    flexDirection: "column",
    bottom: 60,
    right: 24,
    height: "90%",
    borderRadius: 20,
    zIndex: 5000,
    elevation: 5000,
    backgroundColor: "transparent",
  },
  sliderStartAtTopContainer: {
    width: 40,
    position: "absolute",
    justifyContent: "flex-start",
    flexDirection: "column",
    bottom: 10,
    right: 24,
    height: "90%",
    borderRadius: 20,
    zIndex: 6000,
    elevation: 6000,
    backgroundColor: "transparent",
  },
});

export default LocationsMapView;
