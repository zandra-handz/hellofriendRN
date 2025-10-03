//removed midpoint searcher and whatever else it did for right now:  <ButtonGoToFindLocation />
// <LocationHeartSolidSvg height={30} width={30} color="red" />
// <ButtonGoToLocationFunctions />
//<Image source={require('../assets/shapes/coffeecupnoheart.png')} style={{ height: 35, width: 35 }}/>
//midpoints screen is crashing right now so commented out

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Keyboard,
  Text,
  FlatList,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import FocusedLocationCardUI from "./FocusedLocationCardUI";
import { useLocations } from "@/src/context/LocationsContext";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import DualLocationSearcher from "./DualLocationSearcher";
import Animated, { JumpingTransition } from "react-native-reanimated";
import LocationListItem from "./LocationListItem";

const LocationsMapView = ({
  // userAddress,
  // friendAddress,
  userId,
  friendId,
  pastHelloLocations,
  faveLocations,
  nonFaveLocations,
  currentDayDrilledOnce,
  bermudaCoordsDrilledOnce,
  themeAheadOfLoading,
  primaryColor,
  overlayColor,
  darkerOverlay,
  primaryBackground,
}) => {
  const combinedLocations = [...faveLocations, ...nonFaveLocations];

  const { userAddresses } = useStartingUserAddresses({ userId: userId });
  const { friendAddresses } = useStartingFriendAddresses({
    userId: userId,
    friendId: friendId,
  });

  const userAddress =
    userAddresses?.chosen || userAddresses?.saved?.[0] || null;

  // console.log(userAddress);

  const friendAddress =
    friendAddresses?.chosen || friendAddresses?.saved?.[0] || null;

  //i think when i put this in the parent screen it starts up faster?
  //useGeolocationWatcher();
  const mapRef = useRef(null);
  const flatListRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { locationList } = useLocations();
  const { currentLocationDetails, currentRegion } = useCurrentLocation();
  const navigation = useNavigation();
  const [focusedLocation, setFocusedLocation] = useState(null);

  const LIST_ITEM_HEIGHT = 50;
  const LIST_ITEM_PADDING = 4;
  const LIST_ITEM_MARGIN = 1;

  const TOTAL_ITEM_HEIGHT = LIST_ITEM_HEIGHT + LIST_ITEM_MARGIN;

  const [savedLocationsDDVisible, setSavedLocationsDDVisibility] =
    useState(false);

  // use item.isFave (property added when sorting in parent screen) to differentiate UI for saved locations
  const renderLocationItem = useCallback(
    ({ item, _index }) => (
      <LocationListItem
        item={item}
        height={LIST_ITEM_HEIGHT}
        padding={LIST_ITEM_PADDING}
        marginTop={LIST_ITEM_MARGIN}
        onPress={handlePress}
        textColor={primaryColor}
        // backgroundColor={overlayColor}
        backgroundColor={darkerOverlay}
        friendColor={themeAheadOfLoading.darkColor}
      />
    ),
    [faveLocations, nonFaveLocations]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `location-${index}`;

  useEffect(() => {
    if (currentLocationDetails && currentRegion) {
      console.log("current region!!!");
      if (currentLocationDetails != focusedLocation) {
        handleLocationAlreadyExists(currentLocationDetails);
        mapRef.current.animateToRegion(currentRegion, 200);
      } else {
        console.log("region is the same");
      }
    }
  }, [currentRegion]);

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: TOTAL_ITEM_HEIGHT,
      offset: TOTAL_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  //pastHelloes is ALL LOCATIONS with the additional helloes data
  const handleLocationAlreadyExists = (locationDetails) => {
    let matchedLocation;
    // let locationIsOutsideFaves = false;

    let index = combinedLocations.findIndex(
      (location) => String(location.address) === String(locationDetails.address)
    );

    if (index !== -1) {
      console.log("LOCATION EXISTS!");
      if (index <= combinedLocationsForList?.length - 1) {
        scrollToBelowLocation(index + 1);
      } else {
        scrollToBelowLocation(index);
      }
      matchedLocation = { ...combinedLocations[index], matchedIndex: index };
      setFocusedLocation(matchedLocation);
    } else {
      locationIsOutsideFaves = true;
      setFocusedLocation(locationDetails);
    }
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
    if (
      typeof focusedLocation.matchedIndex === "number" &&
      focusedLocation.matchedIndex !== -1
    ) {
      navigation.navigate("LocationView", {
        startingLocation: focusedLocation,
        index: focusedLocation.matchedIndex,
        userAddress: userAddress,
        friendAddress: friendAddress,
      });
    } else {
      navigation.navigate("UnsavedLocationView", {
        unsavedLocation: focusedLocation,
        userAddress: userAddress,
        friendAddress: friendAddress,
      });
    }
  };
  const handleGoToMidpointLocationSearchScreen = () => {
    if (!userAddress?.id || !friendAddress?.id) {
      Alert.alert(
        "Missing address",
        "Both you and your friend need to have an address set before searching."
      );
      return; // stop here
    }

    navigation.navigate("MidpointLocationSearch", {
      userAddress,
      friendAddress,
    });
  };

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

  const scrollToBelowLocation = (index) => {
    if (index !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: TOTAL_ITEM_HEIGHT * index,
        animated: true, // disables the "intermediate" rendering problem
      });
    }
  };

  const handlePress = (location) => {
    if (location) {
      handleLocationAlreadyExists(location, true);

      //true is for addMessage
      // const appOnly = pastHelloLocations.find(
      //   (item) => item.id === location.id
      // );
      // setAppOnlyLocationData(appOnly || null); // this is just the id... ??????????
    }
  };

  useEffect(() => {
    if (focusedLocation) {
      try {
        const { latitude, longitude } = focusedLocation;
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

  // const darkMapStyle = [
  //   {
  //     elementType: "geometry",
  //     stylers: [{ color: "#212121" }],
  //   },
  //   {
  //     elementType: "labels.icon",
  //     stylers: [{ visibility: "off" }],
  //   },
  //   {
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#757575" }],
  //   },
  //   {
  //     elementType: "labels.text.stroke",
  //     stylers: [{ color: "#212121" }],
  //   },
  //   {
  //     featureType: "administrative",
  //     elementType: "geometry",
  //     stylers: [{ color: "#757575" }],
  //   },
  //   {
  //     featureType: "administrative.country",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#9e9e9e" }],
  //   },
  //   {
  //     featureType: "administrative.land_parcel",
  //     stylers: [{ visibility: "off" }],
  //   },
  //   {
  //     featureType: "administrative.locality",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#bdbdbd" }],
  //   },
  //   {
  //     featureType: "poi",
  //     elementType: "labels.text",
  //     stylers: [{ visibility: "off" }],
  //   },
  //   {
  //     featureType: "poi",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#757575" }],
  //   },
  //   {
  //     featureType: "poi.park",
  //     elementType: "geometry",
  //     stylers: [{ color: "#181818" }],
  //   },
  //   {
  //     featureType: "poi.park",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#616161" }],
  //   },
  //   {
  //     featureType: "poi.park",
  //     elementType: "labels.text.stroke",
  //     stylers: [{ color: "#1b1b1b" }],
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "geometry.fill",
  //     stylers: [{ color: "#2c2c2c" }],
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#8a8a8a" }],
  //   },
  //   {
  //     featureType: "road.arterial",
  //     elementType: "geometry",
  //     stylers: [{ color: "#373737" }],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "geometry",
  //     stylers: [{ color: "#3c3c3c" }],
  //   },
  //   {
  //     featureType: "road.highway.controlled_access",
  //     elementType: "geometry",
  //     stylers: [{ color: "#4e4e4e" }],
  //   },
  //   {
  //     featureType: "road.local",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#616161" }],
  //   },
  //   {
  //     featureType: "transit",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#757575" }],
  //   },
  //   {
  //     featureType: "transit.line",
  //     elementType: "geometry",
  //     stylers: [{ color: "#3d3d3d" }],
  //   },
  //   {
  //     featureType: "transit.station",
  //     elementType: "geometry",
  //     stylers: [{ color: "#2e2e2e" }],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "geometry",
  //     stylers: [{ color: "#000000" }],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#3d3d3d" }],
  //   },
  // ];

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
        <View style={styles.markerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.markerText}>{location.helloCount}</Text>
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

  const combinedLocationsForList = useMemo(
    () => [...faveLocations, ...nonFaveLocations],
    [faveLocations, nonFaveLocations]
  );

  const renderLocationsMap = (locations) => (
    <>
      <MapView
        {...(Platform.OS === "android" && { provider: PROVIDER_GOOGLE })}
        ref={mapRef}
        liteMode={isKeyboardVisible ? true : false}
        // style={[{ width: "100%", height: isKeyboardVisible ? "100%" : "100%" }]}
         style={[{ width: "100%", height: 400 }]}
        initialRegion={currentRegion || null}
        //
        scrollEnabled={
          isKeyboardVisible || savedLocationsDDVisible ? false : true
        }
        enableZoomControl={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={savedLocationsDDVisible ? false : true}
        //customMapStyle={colorScheme === 'dark' ? darkMapStyle : null}
      >
        {locations?.map((location) => (
          <MemoizedMarker key={location.id.toString()} location={location} />
        ))}
      </MapView>

      {/* 
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
      </View> */}
    </>
  );

  // COMPONENT RETURN
  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      {pastHelloLocations && (
        <>
          <View style={styles.dualLocationSearcherContainer}>
            <DualLocationSearcher
              savedLocationsDDVisible={savedLocationsDDVisible}
              setSavedLocationsDDVisibility={setSavedLocationsDDVisibility}
              onPress={handlePress}
              locationListDrilledOnce={locationList}
              primaryColor={primaryColor}
              primaryBackground={primaryBackground}
            />
          </View>
          {!isKeyboardVisible && (
            <Pressable
              style={[
                styles.midpointsButton,
                {
                  zIndex: 7000,
                  backgroundColor: primaryBackground,
                },
              ]}
              onPress={handleGoToMidpointLocationSearchScreen}
            >
              <Text style={[styles.zoomOutButtonText, { color: primaryColor }]}>
                Midpoints
              </Text>
            </Pressable>
          )}

          {!isKeyboardVisible && (
            <Pressable
              style={[
                styles.zoomOutButton,
                {
                  zIndex: 8000,
                  backgroundColor: primaryBackground,
                },
              ]}
              onPress={fitToMarkers}
            >
              <Text style={[styles.zoomOutButtonText, { color: primaryColor }]}>
                Show All
              </Text>
            </Pressable>
          )}

          {renderLocationsMap(pastHelloLocations)}

          {!isKeyboardVisible && (
            <View style={styles.focusCardWrapper}>
              <FocusedLocationCardUI
                focusedLocation={focusedLocation}
                onSendPress={handleGoToLocationSendScreen}
                onViewPress={handleGoToLocationViewScreen}
                primaryColor={primaryColor}
                primaryBackground={primaryBackground}
              />
              <View
                style={[
                  styles.flatListWrapper,
                  {
                    backgroundColor: overlayColor,
                  },
                ]}
              >
                {/* {pastHelloLocations && ( */}
                <FlatList 
                  ref={flatListRef}
                  data={combinedLocationsForList}
                  //    itemLayoutAnimation={JumpingTransition}
                  // scrollEventThrottle={16}
                  keyExtractor={extractItemKey}
                  renderItem={renderLocationItem}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews={true}
                  getItemLayout={getItemLayout}
                  decelerationRate="normal"
                  keyboardDismissMode="on-drag"
                 // snapToInterval={TOTAL_ITEM_HEIGHT}
                  // decelerationRate="fast"
                  //  decelerationRate={0.5}

                  ListFooterComponent={<View style={{ height: 260 }}></View>}
                />
                {/* )} */}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
    width: "auto",
    flex: 1,
  },
  markerText: {
    fontWeight: "bold",
    zIndex: 1000,
    position: "absolute",
    top: -12,
    right: -20,
    backgroundColor: "yellow",
    padding: 4,
    borderRadius: 20,
    fontSize: 12,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dualLocationSearcherContainer: {
    position: "absolute",
    top: 0,
    flex: 1,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "pink",
  },
  focusCardWrapper: {
    width: "100%",
    // height: 70,
    zIndex: 1200,
    elevation: 1200,
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    justifyContent: "space-between",
    width: "100%",
  },
  flatListWrapper: {
    // flex: 1,
    height: 370,
    width: "100%",
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
 
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 20,
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
