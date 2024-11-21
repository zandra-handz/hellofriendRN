import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons'; 

import ButtonSearchGoogleMap from '../components/ButtonSearchGoogleMap';
import ButtonFindMidpoints from '../components/ButtonFindMidpoints';
import LocationsFriendFavesList from '../components/LocationsFriendFavesList';
import LocationsSavedList from '../components/LocationsSavedList';
 import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';
import CustomTabBar from '../components/CustomTabBar';
import LoadingPage from '../components/LoadingPage';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
 
const Tab = createBottomTabNavigator();

const ScreenLocations = ({ route, navigation }) => {
  const { themeStyles } = useGlobalStyle();
  const { locationList, faveLocationList, isFetching } = useLocationFunctions();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend } = useSelectedFriend();
  
  const showBottomButtons = false;


  const FavoritesScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsFriendFavesList locations={faveLocationList} />
    </View>
  );

  const SavedLocationsScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsSavedList locationList={locationList} />
    </View>
  );

  const navigateToLocationSearchScreen = () => {
    navigation.navigate('LocationSearch');
  };

  const iconMapping = {
    [selectedFriend.name]: 'star',
    Others: 'location',
    Recent: 'time',
  };
  
 

  return (
    <View style={[styles.container, themeStyles.genericTextBackground]}>
      {!isFetching && (
        <>
          <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: themeAheadOfLoading.darkColor,
              //position: 'absolute',
              flexDirection: 'row',
              top: 0, 
              elevation: 0,
              shadowOpacity: 0,
              borderTopWidth: 0, 
              zIndex: 0,
            }, 
            tabBarActiveTintColor: themeAheadOfLoading.fontColor,
            tabBarInactiveTintColor: themeAheadOfLoading.fontColor,
            tabBarIcon: ({ color }) => {
              const iconName = iconMapping[route.name]; // Get the icon name from the mapping
              return <Ionicons name={iconName} size={18} color={themeAheadOfLoading.fontColor} />;
            },
          })}
        >
          <Tab.Screen name={selectedFriend.name} component={FavoritesScreen} />
          
          <Tab.Screen name="All" component={SavedLocationsScreen} /> 
       
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
        
      {isFetching && (
        <View style={styles.loadingWrapper}>
        <LoadingPage
            loading={isFetching} 
            spinnerType='grid'
            color={themeAheadOfLoading.lightColor}
            includeLabel={true}
            label=""
        />
        </View>
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
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  sectionContainer: {
    paddingTop: 24,
    width: '100%',
    flex: 1, 
  },
});

export default ScreenLocations;
