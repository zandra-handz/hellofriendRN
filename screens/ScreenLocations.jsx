import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ButtonSearchGoogleMap from '../components/ButtonSearchGoogleMap';
import ButtonFindMidpoints from '../components/ButtonFindMidpoints';
import ItemLocationFaveMulti from '../components/ItemLocationFaveMulti';
import ItemLocationSavedMulti from '../components/ItemLocationSavedMulti';
import ItemLocationTempMulti from '../components/ItemLocationTempMulti';

import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

// Create the Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

const ScreenLocations = ({ route, navigation }) => {
  const { themeStyles } = useGlobalStyle();
  const { locationList } = useLocationList();
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend();
  const [isLocationListReady, setIsLocationListReady] = useState(false);


  const showBottomButtons = false;

  
    const RecentlyViewedScreen = () => (
        <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
        <ItemLocationTempMulti containerHeight={80} />
    </View>
    );

    const FavoritesScreen = () => (
        <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
        <ItemLocationFaveMulti containerHeight={100} />
    </View>
    );

    const SavedLocationsScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
        <ItemLocationSavedMulti  horizontal={false} containerHeight={'100%'} />
    </View>
    );


  const navigateToLocationSearchScreen = () => {
    navigation.navigate('LocationSearch');
  };

  useEffect(() => {
    if (locationList.length > 0) {
      setIsLocationListReady(true);
    }
  }, [locationList]);

  return (
    <View style={[styles.container]}>
      {isLocationListReady && (
        <> 
            <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { 
                fontSize: 16, 
                fontFamily: 'Poppins-Bold',
                textTransform: 'capitalize',
                },
                tabBarStyle: { 
                    backgroundColor: calculatedThemeColors.darkColor, // Tab bar background color
                    elevation: 0, 
                    paddingTop: 10,
                    shadowOpacity: 0, // Remove shadow on iOS
                    borderTopWidth: 0, // Remove bottom border if any
                    
                  },
                tabBarIndicatorStyle: {
                backgroundColor: calculatedThemeColors.fontColor , // Tab indicator color
                },
                tabBarActiveTintColor: calculatedThemeColors.fontColor, // Active tab label color
                tabBarInactiveTintColor: calculatedThemeColors.fontColor, // Inactive tab label color
            }}
            >
            <Tab.Screen name={`${selectedFriend.name}`} component={FavoritesScreen} />
            <Tab.Screen name="Others" component={SavedLocationsScreen} />
            <Tab.Screen name="Recent" component={RecentlyViewedScreen} />
          </Tab.Navigator>

          <ButtonGoToFindLocation />
         {showBottomButtons && ( 
          <View style={[themeStyles.genericTextBackground, {width: '100%', height: 120}]}>
            <ButtonSearchGoogleMap onPress={navigateToLocationSearchScreen} />
            <ButtonFindMidpoints />
          </View>
        )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    
  },
  recentlyViewedContainer: {
    width: '100%', 
  },
  sectionContainer: {
    width: '100%', 
    flex: 1, 
  },
});

export default ScreenLocations;
