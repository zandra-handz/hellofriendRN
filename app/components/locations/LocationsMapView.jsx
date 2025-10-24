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
  ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import GlobalPressable from "../appwide/button/GlobalPressable";
import TreeModalBigButtonFocusLocation from "../alerts/TreeModalBigButtonFocusLocation";
import manualGradientColors from "@/app/styles/StaticColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import Animated, { JumpingTransition } from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";

import FindNewLocation from "../headers/FindNewLocation";
import LocationListItem from "./LocationListItem";
import QuickView from "../alerts/QuickView";

const LocationsMapView = ({
  // userAddress,
  // friendAddress,
  userId,
  friendId,
  friendName,
  pastHelloLocations,

  combinedLocationsObject,
  combinedLocationsForList,
  locationCategories,
  // categories,
  faveLocations, //also comes from the object, is here solely for the markers/'Show All' button
  currentDayDrilledOnce,
  handleCategoryPress,
  highlightedCategory,
  bermudaCoordsDrilledOnce,
 
  themeColors,
  primaryColor,
  overlayColor,
  darkerOverlay,
  primaryBackground,
  openAddresses,
  openItems,
  closeItems,
  handleViewLocation,
  quickView,
  nullQuickView,
}) => {
  // const combinedLocationsForList = useMemo(
  //   () => [...faveLocations, ...nonFaveLocations],
  //   [faveLocations, nonFaveLocations]
  // );

  // console.log(`combined: `, combinedLocationsForList.map((location) => location?.id));

  const CARD_HEIGHT = 60;
  const CARD_SAFE_VIEW_PADDING = 50;

  const { navigateBack } = useAppNavigations();

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

  const handleRenderQuickView = useCallback(() => {
    return (
      <>
        {quickView && (
          <QuickView
            topBarText={quickView.topBarText}
            isInsideModal={false}
            message={quickView.message}
            view={quickView.view}
            onClose={nullQuickView}
          />
        )}
      </>
    );
  }, [quickView, nullQuickView]);

  //i think when i put this in the parent screen it starts up faster?
  //useGeolocationWatcher();
  const mapRef = useRef(null);
  const flatListRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const SHARED_SCREEN_MAP_HEIGHT = 406;
  const SHARED_SCREEN_FLATLIST_HEIGHT = 300;

  const { currentLocationDetails, currentRegion } = useCurrentLocation();

  // initial scroll
  useEffect(() => {
    console.log(" USE EFFECT IN MAP VIEW");
    if (currentLocationDetails && currentRegion) {
      if (currentLocationDetails != focusedLocation) {
        handleLocationAlreadyExists(currentLocationDetails);
        mapRef.current.animateToRegion(currentRegion, 200);
      } else {
        console.log("region is the same");
      }
    }
  }, []);

  //   const categories = useMemo(() => {
  //   return Array.from(
  //     new Set(
  //       combinedLocationsForList
  //         .map((item) => item.category)
  //         .filter(Boolean) // remove null/undefined
  //     )
  //   );
  // }, [ combinedLocationsForList]);

  const navigation = useNavigation();
  const [focusedLocation, setFocusedLocation] = useState(null);

  const LIST_ITEM_HEIGHT = 50;
  const LIST_ITEM_PADDING = 4;
  const LIST_ITEM_MARGIN = 1;

  const TOTAL_ITEM_HEIGHT = LIST_ITEM_HEIGHT + LIST_ITEM_MARGIN;

  const [savedLocationsDDVisible, setSavedLocationsDDVisibility] =
    useState(false);

  const renderLocationItem = useCallback(
    ({ item, _index }) => (
      <LocationListItem
        item={item}
        height={LIST_ITEM_HEIGHT}
        padding={LIST_ITEM_PADDING}
        marginTop={LIST_ITEM_MARGIN}
        onPress={handlePress}
        textColor={primaryColor}
        backgroundColor={darkerOverlay}
        friendColor={themeColors.darkColor}
      />
    ),
    [handlePress, combinedLocationsForList] // NEED TO PASS THIS IN TO GET INDEX TO UPDATE IN PRESS FUNCTION
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `location-${index}`;

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: TOTAL_ITEM_HEIGHT,
      offset: TOTAL_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  //pastHelloes is ALL LOCATIONS with the additional helloes data
  const handleLocationAlreadyExists = useCallback(
    (locationDetails) => {
      let matchedLocation;
      let locationIsOutsideFaves = false;

      let index = combinedLocationsForList.findIndex(
        (location) =>
          String(location.address) === String(locationDetails.address)
      );

      // console.log(`LOCATION INDEX`, index);

      if (index !== -1) {
        // console.log("LOCATION EXISTS!");
        if (index <= combinedLocationsForList?.length - 1) {
          scrollToBelowLocation(index + 1);
        } else {
          scrollToBelowLocation(index);
        }
        matchedLocation = {
          ...combinedLocationsForList[index],
          matchedIndex: index,
        };
        setFocusedLocation(matchedLocation);
      } else {
        locationIsOutsideFaves = true;
        setFocusedLocation(locationDetails);
      }
    },
    [combinedLocationsForList]
  );

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

  // const handleGoToLocationViewScreen = () => {
  //   if (
  //     typeof focusedLocation.matchedIndex === "number" &&
  //     focusedLocation.matchedIndex !== -1
  //   ) {
  //     navigation.navigate("LocationView", {
  //       startingLocation: focusedLocation,
  //       index: focusedLocation.matchedIndex,
  //       userAddress: userAddress,
  //       friendAddress: friendAddress,
  //     });
  //   } else {
  //     navigation.navigate("UnsavedLocationView", {
  //       unsavedLocation: focusedLocation,
  //       userAddress: userAddress,
  //       friendAddress: friendAddress,
  //     });
  //   }
  // };

  const handleViewQuickLocation = () => {
    if (!focusedLocation || focusedLocation != undefined) {
      handleViewLocation(focusedLocation);
    }
  };

  const handleGoToMidpointLocationSearchScreen = () => {
    if (!userAddress?.id || !friendAddress?.id) {
      Alert.alert(
        "Missing address",
        "Both you and your friend need to have an address set before searching."
      );
      return;
    }

    navigation.navigate("MidpointLocationSearch", {
      userAddress,
      friendAddress,
    });
  };

  const fitToMarkers = useCallback(() => {
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
  }, [faveLocations]);

  const scrollToBelowLocation = (index) => {
    if (index !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: TOTAL_ITEM_HEIGHT * index,
        animated: true, // disables the "intermediate" rendering problem
      });
    }
  };

  const handlePress = useCallback(
    (location) => {
      console.log("LOCATION PRESSED", location?.id);
      if (location) {
        handleLocationAlreadyExists(location);
      }
    },
    [combinedLocationsForList, handleLocationAlreadyExists]
  );

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

  const renderLocationsMap = (locations) => (
    <>
      <MapView
        {...(Platform.OS === "android" && { provider: PROVIDER_GOOGLE })}
        ref={mapRef}
        liteMode={isKeyboardVisible ? true : false}
        // style={[{ width: "100%", height: isKeyboardVisible ? "100%" : "100%" }]}
        style={[
          {
            width: "100%",
            height: !isKeyboardVisible ? SHARED_SCREEN_MAP_HEIGHT : "100%",
            marginBottom: !isKeyboardVisible
              ? CARD_SAFE_VIEW_PADDING
              : -(CARD_SAFE_VIEW_PADDING - 10), // EYEBALL TO GET MAP TO STAY BELOW DARK TOP OF BACKGROUND
          },
        ]}
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
    </>
  );

  return (
    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
      {handleRenderQuickView()}
      {pastHelloLocations && (
        <>
          <View style={styles.dualLocationSearcherContainer}>
            <View
              style={{
                width: "100%",

                flexGrow: 1,
                padding: 0,
                backgroundColor: primaryBackground,
              }}
            >
              <FindNewLocation
                primaryColor={primaryColor}
                primaryBackground={primaryBackground}
                onPress={handlePress}
              />
            </View>
          </View>

          {!isKeyboardVisible && (
            <View style={styles.outerFlatListWrapper}>
              <ScrollView
                horizontal
                contentContainerStyle={{
                  horizontal: "true",
                  height: 50,
                  paddingBottom: 10,
                  alignItems: "center",
                  //  flexDirection: "row",
                  backgroundColor: primaryBackground,
                }}
                // style={{
                //   width: "100%",
                //   height: 50,
                //   alignItems: "center",
                //   flexDirection: "row",
                //   backgroundColor: "pink",
                // }}
              >
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
                    <Text
                      style={[
                        styles.zoomOutButtonText,
                        { color: primaryColor },
                      ]}
                    >
                      Midpoints
                    </Text>
                  </Pressable>
                )}

                {!isKeyboardVisible && locationCategories != undefined && (
                  <>
                    {locationCategories?.map((category) => (
                      <GlobalPressable
                        key={category}
                        style={[
                          styles.midpointsButton,
                          {
                            padding: 0,
                            height: 30,
                            backgroundColor:
                              highlightedCategory === category
                                ? manualGradientColors.lightColor
                                : primaryBackground,
                          },
                        ]}
                        onPress={() => handleCategoryPress(category)}
                      >
                        <Text
                          style={[
                            styles.zoomOutButtonText,
                            {
                              color:
                                highlightedCategory === category
                                  ? manualGradientColors.homeDarkColor
                                  : primaryColor,
                            },
                          ]}
                        >
                          {category}
                        </Text>
                      </GlobalPressable>
                    ))}
                  </>
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
                    <Text
                      style={[
                        styles.zoomOutButtonText,
                        { color: primaryColor },
                      ]}
                    >
                      Show All
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
              <View
                style={[
                  styles.flatListWrapper,
                  {
                    height: SHARED_SCREEN_FLATLIST_HEIGHT,
                    backgroundColor: overlayColor,
                  },
                ]}
              >
                {/* {pastHelloLocations && ( */}
                <FlatList
                  ref={flatListRef}
                  // itemLayoutAnimation={JumpingTransition} 
                  data={combinedLocationsForList}
                  inverted={true} 
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

                  ListFooterComponent={<View style={{ height: 0 }}></View>}
                />
                {/* )} */}
              </View>
            </View>
          )}
          {renderLocationsMap(pastHelloLocations)}
        </>
      )}
      <View style={{ width: "100%" }}>
        <TreeModalBigButtonFocusLocation
          userId={userId}
          friendId={friendId}
          friendName={friendName}
          height={CARD_HEIGHT + CARD_SAFE_VIEW_PADDING}
          safeViewPaddingBottom={CARD_SAFE_VIEW_PADDING}
          themeColors={themeColors} 
          absolute={true}
          location={
            focusedLocation?.matchedIndex
              ? combinedLocationsForList.find(
                  (location) => location.id === focusedLocation?.id
                )
              : focusedLocation
          }
          label={focusedLocation?.title}
          subLabel={focusedLocation?.address}
          primaryColor={primaryColor}
          labelColor={themeColors.fontColorSecondary}
          backgroundColor={darkerOverlay}
          onLeftPress={navigateBack}
          onRightPress={handleGoToLocationSendScreen}
          // onMainPress={handleGoToLocationViewScreen}
          onMainPress={handleViewQuickLocation}
          openAddresses={openAddresses}
          userAddress={userAddress}
          friendAddress={friendAddress}
          openItems={openItems}
          closeItems={closeItems}
        />
      </View>
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
    zIndex: 10000,
  },
  outerFlatListWrapper: {
    width: "100%",
    zIndex: 1200,
    elevation: 1200,
    flexDirection: "column",
    position: "absolute",
    //bottom: 0,
    top: 0,
    paddingTop: 40,
    justifyContent: "space-between",
    width: "100%",
  },
  flatListWrapper: {
    width: "100%",
  },
  midpointsButton: {
    // position: "absolute",
    zIndex: 3000,
    // top: 346,
    // right: 4,
    padding: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 5,
    width: "auto",
  },
  zoomOutButton: {
    // position: "absolute",
    // zIndex: 4,
    // right: 4,
    // top: 396,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  zoomOutButtonText: {
    // fontWeight: "bold",
    fontSize: 12,
    lineHeight: 20,
  },
});

export default LocationsMapView;
