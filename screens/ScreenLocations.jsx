import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons'; 
import LocationsFriendFavesList from '../components/LocationsFriendFavesList';
import LocationsSavedList from '../components/LocationsSavedList';
import CustomTabBar from '../components/CustomTabBar'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import useLocationFunctions from '../hooks/useLocationFunctions';

import { useNavigation, useNavigationState } from '@react-navigation/native';

import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import MomentsSearchBar from '../components/MomentsSearchBar';

import { LinearGradient } from 'expo-linear-gradient';
 

const Tab = createBottomTabNavigator();

const ScreenLocations = ({   }) => {
  const { themeStyles } = useGlobalStyle();
  const { locationList } = useLocationFunctions();
  const [ viewingAllLocations, setViewingAllLocations ] = useState(false);
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendDashboardData } = useSelectedFriend(); 

  const [ locationIdToScrollTo, setLocationIdToScrollTo ] = useState(null);
  const [faveLocationIdToScrollTo, setFaveLocationIdToScrollTo] = useState(null);
const [savedLocationIdToScrollTo, setSavedLocationIdToScrollTo] = useState(null);

  const handleGoToLocationViewScreen = (item) => { 
    console.log(item);
    navigation.navigate('Location', { location: item, favorite: false }); //false as default, receiving screen should still detect
  
  }; 

  const navigation = useNavigation();
 

  const faveLocations = useMemo(() => {
    console.log('Filtering favorite locations');
    return locationList.filter(location =>
      friendDashboardData[0].friend_faves.locations.includes(location.id)
    );
  }, [locationList, friendDashboardData]);

//const faveLocations = filterLocations();

 

  const FavoritesScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsFriendFavesList locationList={faveLocations} scrollTo={faveLocationIdToScrollTo} />
    </View>
  );

  const SavedLocationsScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsSavedList locationList={locationList} scrollTo={locationIdToScrollTo}/>
    </View>
  ); 

  const iconMapping = {
    [selectedFriend.name]: 'star',
    Others: 'location',
    Recent: 'time',
  };


  const handleScrollToFavoriteLocation = (locationItem) => {
    console.log('location id!', locationItem.id);
    setFaveLocationIdToScrollTo(locationItem.id);

  };

 
  const handleScrollToLocation = (locationItem) => {
    console.log('location id!', locationItem.id);
    setLocationIdToScrollTo(locationItem.id);

  };

  const triggerScrollToLocation = (locationId) => {
    console.log('location id sent to list component: ', locationId);
  };

  
  const handleTabChange = (tabIndex) => {
    console.log('Active Tab Index:', tabIndex);
    setLocationIdToScrollTo(null);
    setViewingAllLocations(tabIndex === 1); //index 1 is second tab all locations
    // Perform any actions needed in the parent when the tab changes
    // For example, set locationIdToScrollTo based on the tab or update other state
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



                  <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              paddingHorizontal: "3%",
            }}
          >
            {viewingAllLocations && (
              
            <MomentsSearchBar
              data={ locationList}
              height={30}
              width={"27%"}
              borderColor={"transparent"}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={handleScrollToLocation}
              searchKeys={["address", "title"]}
            />
            
          )}
          {!viewingAllLocations && (
            
                        <MomentsSearchBar
              data={ faveLocations }
              height={30}
              width={"27%"}
              borderColor={"transparent"}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={handleScrollToFavoriteLocation}
              searchKeys={["address", "title"]}
            />
            
          )}
          </View>   
      </View>
              <View
                style={[
                  styles.backColorContainer,
                  themeStyles.genericTextBackground,
                  { borderColor: themeAheadOfLoading.lightColor },
                ]}
              > 
          <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} onTabChange={handleTabChange} />}
       
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
        </View>
 
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
    zIndex: 2000,
},
backColorContainer: {
  height: "96%",
  alignContent: "center",
  //paddingHorizontal: "4%",
  paddingTop: "6%",
  //flex: 1,
  width: "101%",
  alignSelf: "center",
  borderWidth: 1,
  borderTopRightRadius: 30,
  borderTopLeftRadius: 30,
  borderRadius: 30,
  flexDirection: "column",
  justifyContent: "space-between",
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
