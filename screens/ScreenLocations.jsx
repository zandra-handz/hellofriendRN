import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchBar from '../components/SearchBar';
import { Ionicons } from '@expo/vector-icons'; 
import LocationsFriendFavesList from '../components/LocationsFriendFavesList';
import LocationsSavedList from '../components/LocationsSavedList';
import CustomTabBar from '../components/CustomTabBar'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import { LinearGradient } from 'expo-linear-gradient';
 

const Tab = createBottomTabNavigator();

const ScreenLocations = ({ route, navigation }) => {
  const { themeStyles } = useGlobalStyle();
  const { locationList } = useLocationFunctions();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendDashboardData } = useSelectedFriend(); 
  

  const handleGoToLocationViewScreen = (item) => { 
    console.log(item);
    navigation.navigate('Location', { location: item, favorite: false }); //false as default, receiving screen should still detect
  
  }; 

  const faveLocations = useMemo(() => {
    console.log('Filtering favorite locations');
    return locationList.filter(location =>
      friendDashboardData[0].friend_faves.locations.includes(location.id)
    );
  }, [locationList, friendDashboardData]);

//const faveLocations = filterLocations();




  const FavoritesScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsFriendFavesList locations={faveLocations} />
    </View>
  );

  const SavedLocationsScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsSavedList locationList={locationList} />
    </View>
  ); 

  const iconMapping = {
    [selectedFriend.name]: 'star',
    Others: 'location',
    Recent: 'time',
  };
  
 

  return (
            <LinearGradient
                colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.container]}
            >
<>
      <View style={[styles.searchBarContent, {backgroundColor: 'transparent'}]}>

        <SearchBar data={locationList} placeholderText={'Search'} onPress={handleGoToLocationViewScreen} borderColor={'transparent'}  searchKeys={['address', 'title']} />
            
      </View>
          <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: themeAheadOfLoading.darkColor,
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
 
        </> 
         
    
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', 
    zIndex: 1,
  }, 
  searchBarContent: {
    width: '100%',
    paddingHorizontal: '1%',
    paddingVertical: '2%',
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1000,
},
  
  sectionContainer: {
    paddingTop: 24,
    width: '100%',
    flex: 1, 
    zIndex: 1,
  },
});

export default ScreenLocations;
