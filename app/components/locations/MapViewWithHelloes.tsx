// NOT IN USE, MADE APP CHOKE 

import { View, Text, Platform, StyleSheet } from 'react-native'
import React, { forwardRef, memo, useRef } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface Location {
  id: number;
  title: string;
  latitude: string | number;
  longitude: string | number;
  address: string;
  // Optional and extended fields
  isFave?: boolean;
  isPastHello?: boolean;
  helloCount?: number;
  friendsCount?: number;
  friends?: { id: number; name: string | number }[];
  personal_experience_info?: string;
  parking_score?: string;
  validatedAddress?: boolean;
  zipCode?: string | null;
  category?: string | null;
}
interface MapViewWithHelloesProps {
    locations: Location;
    currentRegion: Region;
    isKeyboardVisible: boolean;
}

const MapViewWithHelloes = memo(
  forwardRef<MapView, MapViewWithHelloesProps>(
    ({ locations, currentRegion, isKeyboardVisible }, ref) => {

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

      return (
        <>
        <MapView
        {...(Platform.OS === "android" && { provider: PROVIDER_GOOGLE })}
          ref={ref}
        liteMode={isKeyboardVisible ? true : false}
        style={[ { width: '100%', height: isKeyboardVisible ? "100%" : "100%" }]}
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
      
        </>
      );
    }
  ),
  (prevProps, nextProps) =>
    prevProps.isKeyboardVisible === nextProps.isKeyboardVisible &&
    prevProps.currentRegion === nextProps.currentRegion &&
    prevProps.locations === nextProps.locations
);

export default MapViewWithHelloes;




// old code in parent component:

//  const renderLocationsMap = useCallback((locations) => (

//   // const renderLocationsMap = (locations) => (
//     <>
//       <MapView
//         {...(Platform.OS === "android" && { provider: PROVIDER_GOOGLE })}
//         ref={mapRef}
//         liteMode={isKeyboardVisible ? true : false}
//         style={[ { height: isKeyboardVisible ? "100%" : "100%" }]}
//         initialRegion={currentRegion || null}
//         scrollEnabled={isKeyboardVisible ? false : true}
//         enableZoomControl={true}
//         showsUserLocation={true}
//         showsMyLocationButton={true}
//         zoomEnabled={true}
//         //customMapStyle={colorScheme === 'dark' ? darkMapStyle : null}
//       >
//         {locations?.map((location) => (
//           <MemoizedMarker key={location.id.toString()} location={location} />
//         ))}
//       </MapView>


//       {!isKeyboardVisible && (
//         <TouchableOpacity
//           style={[
//             styles.midpointsButton,
//             {
//               zIndex: 7000,
//               backgroundColor:
//                 themeStyles.genericTextBackground.backgroundColor,
//             },
//           ]}
//           onPress={handleGoToMidpointLocationSearchScreen}
//         >
//           <Text style={[styles.zoomOutButtonText, themeStyles.genericText]}>
//             Midpoints
//           </Text>
//         </TouchableOpacity>
//       )}

//       {!isKeyboardVisible && (
//         <TouchableOpacity
//           style={[
//             styles.zoomOutButton,
//             {
//               zIndex: 7000,
//               backgroundColor:
//                 themeStyles.genericTextBackground.backgroundColor,
//             },
//           ]}
//           onPress={fitToMarkers}
//         >
//           <Text style={[styles.zoomOutButtonText, themeStyles.genericText]}>
//             Show All
//           </Text>
//         </TouchableOpacity>
//       )}
//       <View style={styles.dualLocationSearcherContainer}>
//         <DualLocationSearcher
//           onPress={handlePress}
//           locationListDrilledOnce={locationList}
//         />
//       </View>
//     </>
// ), [themeStyles, isKeyboardVisible, mapRef, currentRegion]);