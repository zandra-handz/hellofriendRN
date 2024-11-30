//removed midpoint searcher and whatever else it did for right now:  <ButtonGoToFindLocation /> 
// <LocationHeartSolidSvg height={30} width={30} color="red" />
        
//<Image source={require('../assets/shapes/coffeecupnoheart.png')} style={{ height: 35, width: 35 }}/>
import React, { useState, useEffect,  useRef, useMemo } from 'react';
import { View, StyleSheet, Platform, Keyboard, Text, Dimensions, Animated, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import LocationOverMapButton from '../components/LocationOverMapButton';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext'; 
//import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import useLocationFunctions from '../hooks/useLocationFunctions';
import ButtonGoToLocationFunctions from '../components/ButtonGoToLocationFunctions';
import useCurrentLocation from '../hooks/useCurrentLocation'; 
import ExpandableUpCard from '../components/ExpandableUpCard';
import DualLocationSearcher from '../components/DualLocationSearcher';

const MapWithLocations = ({ sortedLocations, bermudaCoordsDrilledOnce }) => {
  const mapRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { locationList } = useLocationFunctions();
  const { currentLocationDetails, currentRegion  } = useCurrentLocation();
  const navigation = useNavigation();
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList(); 
  const { initialRegion, setInitialRegion } = useState(null);
  const [focusedLocation, focusOnLocation  ] = useState(null);
 

 useEffect(() => {
  if (currentLocationDetails && currentRegion) { 
  focusOnLocation(currentLocationDetails);
  console.log(currentLocationDetails);
  mapRef.current.animateToRegion(currentRegion, 200);
}  

}, [currentRegion]);

useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener(
    'keyboardDidShow',
    () => setIsKeyboardVisible(true)
  );
  const keyboardDidHideListener = Keyboard.addListener(
    'keyboardDidHide',
    () => setIsKeyboardVisible(false)
  );

  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);

const handleGoToLocationViewScreen = (item) => { 
  navigation.navigate('Location', { location: item, favorite: false }); //false as default, receiving screen should still detect

}; 

//i had taken this out but brought it back in because if i use sorted
//list for the bottom scroll, it doesn't update when a new favorite is added;
//i don't like having both sortedLocations passed in AND using the locationFuctions
//for this
const faveLocations = useMemo(() => {
  console.log('Filtering favorite locations');
  return locationList.filter(location =>
    friendDashboardData[0].friend_faves.locations.includes(location.id)
  );
}, [locationList, friendDashboardData]);

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
      focusOnLocation(location);
      console.log('focus on location pressed!');

    };
  }

  const renderBottomScrollList = () => {
    return ( 
      <Animated.FlatList
      data={faveLocations}
      horizontal={true}
      keyExtractor={(item, index) => `fl-${index}`}
      getItemLayout={(data, index) => (
        {length: soonButtonWidth, offset: soonButtonWidth * index, index }
      )}

      renderItem={({ item }) => (
            <View style={{marginRight: buttonRightSpacer, paddingVertical: 4, height: '90%'}}>
            <LocationOverMapButton 
              height={'100%'} 
              friendName={item.title || item.address}  
              width={soonButtonWidth} 
              onPress={() => (handlePress(item))} /> 
              
          </View>

      )}
      showsHorizontalScrollIndicator={false}
      scrollIndicatorInsets={{ right: 1 }}
      initialScrollIndex={0}
      ListFooterComponent={() => <View style={{ width: soonListRightSpacer }} />}
      
      snapToInterval={soonButtonWidth + buttonRightSpacer}  // Set the snapping interval to the height of each item
      snapToAlignment="start"  // Align items to the top of the list when snapped
      decelerationRate="fast" 
    />

    )
  }

  useEffect(() => {
    if (focusedLocation) { 
        try {
            const { latitude, longitude } = focusedLocation;
            console.log(latitude, longitude);

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
                console.warn('Invalid latitude or longitude:', { latitude, longitude });
            }
        } catch (error) {
            console.error('Error animating map region:', error);
        }
    }
}, [focusedLocation]);


   
  const renderLocationsMap = (locations) => (
    <> 
<MapView
  {...(Platform.OS === 'android' && { provider: PROVIDER_GOOGLE })}
  ref={mapRef}
  style={[styles.map, {height: isKeyboardVisible? '100%' : '63%'}]}
  initialRegion={currentRegion || null} 
  enableZoomControl={true}
  showsUserLocation={true}
  showsMyLocationButton={true}
  zoomEnabled={true}
>
  {locations
    .filter(location => 
      location.latitude !== 25.0000 || location.longitude !== -71.0000 // Exclude Bermuda Triangle coordinates
    )
    .map(location => (
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
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'flex-start', 
            padding: 5, 
          }}
        >  
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: 'bold',
                zIndex: 1000,
                position: 'absolute',
                top: -12,
                right: -8,
                backgroundColor: 'yellow',
                padding: 4,
                borderRadius: 20,
                fontSize: 12,
              }}
            >
              {location && location.helloCount}
            </Text> 
          </View>
          <Image source={require('../assets/shapes/coffeecupnoheart.png')} style={{ height: 35, width: 35 }}/>
         
        </View> 
      </Marker>
    ))}
</MapView>

    </>
  );

  return (
    <LinearGradient
    colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={[styles.container]} 
  > 
    {sortedLocations && ( 
      <>
        {renderLocationsMap(sortedLocations)}


        {!isKeyboardVisible && (
<>
        <View style={styles.scrollTitleContainer}>
          
        <Text style={styles.friendNameText}>Faved for {selectedFriend.name}</Text>

        </View>
       
        <View style={styles.scrollContainer}>
          {renderBottomScrollList()}
        </View>

        </>
          
)}

</>
      )}

<ExpandableUpCard
        onPress={() => {
          handleGoToLocationViewScreen(focusedLocation)
        }}
        content={
          <>
        {focusedLocation && (
          <>
          <View style={{flexDirection: 'row'}}>
          <Text style={[themeStyles.genericText, {fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase', lineHeight: 22}]}>{focusedLocation.title}</Text>

          </View> 
                    <View style={{flexDirection: 'row'}}>
                      <Text style={themeStyles.genericText}>{focusedLocation.address}</Text>
                    </View>  
                    {focusedLocation && focusedLocation.notes && ( 
                      <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.detailsSubtitle, themeStyles.genericText]}>Notes: </Text>
                        <Text style={themeStyles.genericText}>{focusedLocation.notes}</Text>
                      </View>       
                    )}              
                    
                    {focusedLocation && focusedLocation.parking && ( 
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.detailsSubtitle, themeStyles.genericText]}>Parking: </Text>
                      <Text style={themeStyles.genericText}>{focusedLocation.parking}</Text>
                    </View> 
                  )} 
                  {focusedLocation && focusedLocation.helloCount && ( 
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.detailsSubtitle, themeStyles.genericText]}>Helloes here: </Text>
                      <Text style={themeStyles.genericText}>{focusedLocation.helloCount}</Text>
                    </View> 
                  )} 
        </>
        )}
        </>
      }
        /> 
        <DualLocationSearcher onPress={handlePress} locationListDrilledOnce={locationList}/>
    
    <ButtonGoToLocationFunctions /> 
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  map: {  
     width: '100%',  
    height: '63%',
    paddingTop: 60,
    zIndex: 3,
  },
  detailsContainer: {
    flexGrow: 1, 
    width: '100%',
    padding: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    marginTop: '0%',

  },
  detailsSubtitle: {
    fontWeight: 'bold',
    fontSize: 15,

  },
  scrollContainer: {
    width: '100%',  
    height: 60,  
    zIndex: 1000, 
    justifyContent: 'center', 
    alignContent: 'center',
    alignItems: 'center',
  },
  scrollTitleContainer: {
    width: '100%',   
    zIndex: 1000, 
    justifyContent: 'center', 
    alignContent: 'left',
    alignItems: 'left',
    textAlign: 'left',
    paddingHorizontal: '3%',
    borderWidth: 0, 
    borderColor: 'gray',
    paddingVertical: '1%',
  },
  friendNameText: {
    
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',

  },
});

export default MapWithLocations;
