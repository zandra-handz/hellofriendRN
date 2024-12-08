
//removed midpoint searcher and whatever else it did for right now:  <ButtonGoToFindLocation /> 
// <LocationHeartSolidSvg height={30} width={30} color="red" />
// <ButtonGoToLocationFunctions /> 
//<Image source={require('../assets/shapes/coffeecupnoheart.png')} style={{ height: 35, width: 35 }}/>
import React, { useState, useEffect,  useRef, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Keyboard, Text, Dimensions, Animated, Image } from 'react-native';
import MapView, { AnimatedRegion, MarkerAnimated, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useColorScheme } from 'react-native';
import LocationOverMapButton from '../components/LocationOverMapButton';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext'; 

import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';

import { useMessage } from '../context/MessageContext';
import SlideUpToOpen from '../components/SlideUpToOpen';
import SlideDownToClose from '../components/SlideDownToClose';

//import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';
import useLocationFunctions from '../hooks/useLocationFunctions';
import useCurrentLocation from '../hooks/useCurrentLocation'; 
import ExpandableUpCard from '../components/ExpandableUpCard';
import DualLocationSearcher from '../components/DualLocationSearcher';
import HorizontalScrollAnimationWrapper from '../components/HorizontalScrollAnimationWrapper';
import FadeInOutWrapper from '../components/FadeInOutWrapper'; //pass in isVisible prop
import LocationDetailsBody from '../components/LocationDetailsBody';


const LocationsMapView = ({ sortedLocations, currentDayDrilledOnce, bermudaCoordsDrilledOnce }) => {
  const mapRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showMessage } = useMessage();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { locationList } = useLocationFunctions();
  const { currentLocationDetails, currentRegion  } = useCurrentLocation();
  const navigation = useNavigation();
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();  
  const [focusedLocation, setFocusedLocation ] = useState(null);
  const [locationDetailsAreOpen, setLocationDetailsAreOpen ] = useState(false);
  const colorScheme = useColorScheme();

  const [ noModalsOpen, setNoModalsOpen ] = useState(true);

  const [ expandStateFromParent, setExpandStateFromParent ] = useState(false);
  
  const [ appOnlyLocationData, setAppOnlyLocationData ] = useState(null);
  
  const toggleCardWithSlider = () => { 
    setExpandStateFromParent(prev => !prev); 
   
  };
 
  

  const toggleLocationDetailsState = () => {
    setLocationDetailsAreOpen(prev => !prev);
  };

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

  matchedLocation = sortedLocations.find(location => String(location.address) === String(locationDetails.address));
  
  if (matchedLocation === undefined) {
    matchedLocation = locationList.find(location => String(location.address) === String(locationDetails.address));
    locationIsOutsideFaves = true;
    }
  showMessage(matchedLocation && addMessage && locationIsOutsideFaves, null, 'Location already in list!');
  setFocusedLocation(matchedLocation || locationDetails);
 
};
 



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

const handleGoToLocationSendScreen = (item) => { 
  navigation.navigate('LocationSend', { location: item, weekdayTextData: null, selectedDay: null});

}; 

//i had taken this out but brought it back in because if i use sorted
//list for the bottom scroll, it doesn't update when a new favorite is added;
//i don't like having both sortedLocations passed in AND using the locationFuctions
//for this
const faveLocations = useMemo(() => {
  //console.log('Filtering favorite locations');
  return locationList.filter(location =>
    friendDashboardData[0].friend_faves.locations.includes(location.id)
  );
}, [locationList, friendDashboardData]);


// Function to fit all markers
const fitToMarkers = () => {
  if (mapRef.current && faveLocations && sortedLocations.length > 0) {
    const coordinates = faveLocations
      .filter(location => location.latitude !== 25.0000 || location.longitude !== -71.0000)
      .map(location => ({
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
      const appOnly = sortedLocations.find(item => item.id === location.id);
      setAppOnlyLocationData(appOnly || null); 

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
                console.warn('Invalid latitude or longitude:', { latitude, longitude });
            }
        } catch (error) {
            console.error('Error animating map region:', error);
        }
    }
}, [focusedLocation]);

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#181818' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1b1b1b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#373737' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3c3c3c' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#4e4e4e' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#3d3d3d' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{ color: '#2e2e2e' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

   
  const renderLocationsMap = (locations) => (
    <>  
    
      <MapView
        {...(Platform.OS === 'android' && { provider: PROVIDER_GOOGLE })}
        ref={mapRef}
        liteMode={isKeyboardVisible? true : false}
        style={[styles.map, {height: isKeyboardVisible? '100%' : '100%'}]}
        initialRegion={currentRegion || null} 
        scrollEnabled={isKeyboardVisible? false : true}
        enableZoomControl={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        //customMapStyle={colorScheme === 'dark' ? darkMapStyle : null}
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
                  pinColor: 'limegreen', //haven't tested if this works
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
      <TouchableOpacity style={[styles.zoomOutButton, {backgroundColor: themeStyles.genericTextBackground.backgroundColor}]} onPress={fitToMarkers}>
        <Text style={[styles.zoomOutButtonText, themeStyles.genericText]}>Show All</Text>
      </TouchableOpacity>

      
      <DualLocationSearcher onPress={handlePress} locationListDrilledOnce={locationList}/>
    

    </>
  );

  return (
    <View style={styles.container}>
    {locationDetailsAreOpen && (
      
    <FadeInOutWrapper
    isVisible={locationDetailsAreOpen}
    children={
      <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}  
      style={[styles.gradientCover, {zIndex: locationDetailsAreOpen ? 4000 : 1000}]} 
    /> 
    }
    />
    
    
  )}

    {sortedLocations && ( 
      <> 
        {renderLocationsMap(sortedLocations)}
    

        {!isKeyboardVisible && (
            <View style={{width: '100%', height: 70, zIndex: 1200, elevation: 1200,  flexDirection: 'column', position: 'absolute', bottom: '28%', justifyContent: 'space-between', width: '100%'}}>   
              <HorizontalScrollAnimationWrapper>
                <View style={styles.scrollContainer}>
                  <View style={styles.scrollTitleContainer}>
                    <Text style={[styles.friendNameText, {color: themeAheadOfLoading.fontColor}]}>Faved for {selectedFriend.name}</Text>
                  </View>
                      {renderBottomScrollList()}
                </View>
              </HorizontalScrollAnimationWrapper>
             
            </View>
          )}

</>
      )}


    {!isKeyboardVisible && (

        <LinearGradient
          colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}  
          style={styles.gradientBelowFaves} 
        />   
    )}

      <ExpandableUpCard
        onPress={() => {
          //handleGoToLocationViewScreen(focusedLocation) //scaffolding during transition to keep build functional
        }}
        useParentButton={true}
        parentTriggerToExpand={expandStateFromParent}  
        parentFunctionToTrackOpenClose={toggleLocationDetailsState} //use locationDetailsAreOpen to act on
        content={ 
          focusedLocation ? (
            <LocationDetailsBody locationObject={focusedLocation} appOnlyLocationObject={appOnlyLocationData} currentDayDrilledTwice={currentDayDrilledOnce} />
          ) : (
            null //I'm not sure if this would return error, the LocationDetailsBody has checks in place already
                //and will return an empty container if no focusedLocation
          )
          }
        /> 

<Animated.View style={[styles.sliderContainer, { opacity: 1 }]}>

  {!locationDetailsAreOpen && (
    
        <SlideUpToOpen
          onPress={toggleCardWithSlider}
          //onDoubleTap={handleGoToLocationSendScreen(focusedLocation)}
          sliderText='OPEN'  
          targetIcon={CheckmarkOutlineSvg}
          disabled={false}
        />

  )}

        
      </Animated.View>
      {locationDetailsAreOpen && (
     
      <Animated.View style={[styles. sliderStartAtTopContainer, { opacity: 1 }]}>
        <SlideDownToClose
          onPress={toggleCardWithSlider}
          sliderText='CLOSE'  
          targetIcon={CheckmarkOutlineSvg}
          disabled={false}
        />

      </Animated.View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center', 
  },
  gradientCover: {
    width: '100%',
    flex: 1,

  },
  gradientBelowFaves: {
    width: '100%',
    flex: 1,
    zIndex: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '37%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,

  },
  map: {  
    ...StyleSheet.absoluteFillObject,
     width: '100%',  
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
    flex: 1, 
    flexDirection: 'column', 
    zIndex: 1000,     
    justifyContent: 'flex-end', 
    alignContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: '2%',
  },
  scrollTitleContainer: {
    width: '100%',   
    zIndex: 1000,  

    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignContent: 'left',
    alignItems: 'left',
    textAlign: 'left',
    paddingHorizontal: '3%',
    paddingBottom: '1%',
    borderWidth: 0, 
    borderColor: 'gray', 
  },
  friendNameText: {
    
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',

  },
  zoomOutButton: {
    position: 'absolute',
    zIndex: 4,
    width: 'auto',
    paddingHorizontal: '2%',
    bottom: '38%',
    right: 8,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  zoomOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sliderContainer: {
    width: 40, 
    position: 'absolute',
    justifyContent: 'flex-end',
    flexDirection: 'column',
     bottom: 10,
     right: 50,
     height: '90%',
    borderRadius: 20,  
    zIndex: 3000,
    elevation: 3000,
    backgroundColor: 'transparent',  
 },
 sliderStartAtTopContainer: {
  width: 40, 
  position: 'absolute',
  justifyContent: 'flex-start',
  flexDirection: 'column',
   bottom: 10,
   right: 50,
   height: '90%',
  borderRadius: 20,  
  zIndex: 6000,
  elevation: 6000,
  backgroundColor: 'transparent',  
},
});

export default LocationsMapView;
