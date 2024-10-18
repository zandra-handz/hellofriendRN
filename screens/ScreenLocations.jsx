import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Example icon library

import ButtonSearchGoogleMap from '../components/ButtonSearchGoogleMap';
import ButtonFindMidpoints from '../components/ButtonFindMidpoints';
import ItemLocationFaveMulti from '../components/ItemLocationFaveMulti';
import ItemLocationSavedMulti from '../components/ItemLocationSavedMulti';
import ItemLocationTempMulti from '../components/ItemLocationTempMulti';
import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';
import CustomTabBar from '../components/CustomTabBar';


import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const ScreenLocations = ({ route, navigation }) => {
  const { themeStyles } = useGlobalStyle();
  const { locationList } = useLocationList();
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend();
  const [isLocationListReady, setIsLocationListReady] = useState(false);

  const showBottomButtons = false;

  const RecentlyViewedScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <ItemLocationTempMulti horizontal={false} />
    </View>
  );

  const FavoritesScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <ItemLocationFaveMulti horizontal={false} />
    </View>
  );

  const SavedLocationsScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <ItemLocationSavedMulti horizontal={false} />
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
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: calculatedThemeColors.darkColor,
              position: 'absolute',
              flexDirection: 'row',
              top: 0, 
              elevation: 0,
              shadowOpacity: 0,
              borderTopWidth: 0, 
            },
            tabBarActiveTintColor: calculatedThemeColors.fontColor,
            tabBarInactiveTintColor: calculatedThemeColors.fontColor,
            tabBarIcon: ({ color }) => {
              let iconName;
              if (route.name === `${selectedFriend.name}`) {
                iconName = 'star';
              } else if (route.name === 'Others') {
                iconName = 'location';
              } else if (route.name === 'Recent') {
                iconName = 'time';
              }
              return <Ionicons name={iconName} size={18} color={calculatedThemeColors.fontColor} />;
            },
          })}
        >
            <Tab.Screen name={`${selectedFriend.name}`} component={FavoritesScreen} />
            <Tab.Screen name="Others" component={SavedLocationsScreen} />
            <Tab.Screen name="Recent" component={RecentlyViewedScreen} />
          </Tab.Navigator>

          <ButtonGoToFindLocation />
          {showBottomButtons && ( 
            <View style={[themeStyles.genericTextBackground, { width: '100%', height: 120 }]}>
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
  sectionContainer: {
    paddingTop: 24,
    width: '100%',
    flex: 1,
  },
});

export default ScreenLocations;
