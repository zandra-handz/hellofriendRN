import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LocationsFriendFavesList from "../components/LocationsFriendFavesList";
import LocationsSavedList from "../components/LocationsSavedList";
import CustomTabBar from "../components/CustomTabBar";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useLocations } from '../context/LocationsContext'; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigation, useNavigationState } from "@react-navigation/native";

import { useFriendList } from "../context/FriendListContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";

import MomentsSearchBar from "../components/MomentsSearchBar";

import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();

const ScreenLocations = ({}) => {
  const { themeStyles } = useGlobalStyle();
  const { locationList, handleAddToFaves, handleRemoveFromFaves } =
    useLocations();
  const [viewingAllLocations, setViewingAllLocations] = useState(false);
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const queryClient = useQueryClient();
  const [locationIdToScrollTo, setLocationIdToScrollTo] = useState(null);
  const [faveLocationIdToScrollTo, setFaveLocationIdToScrollTo] =
    useState(null);
  const [savedLocationIdToScrollTo, setSavedLocationIdToScrollTo] =
    useState(null);
  const [locationCategories, setLocationCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Coffee");

  const getLocationCategories = () => {
    const categories = queryClient.getQueryData(["locationCategories"]);
    return categories;
  };

  useEffect(() => {
    if (locationList) {
      setLocationCategories(getLocationCategories);
    }
  }, [locationList]);



  const handleGoToLocationViewScreen = (item) => {
    console.log(item);
    navigation.navigate("Location", { location: item, favorite: false }); //false as default, receiving screen should still detect
  };

  const navigation = useNavigation();

  const faveLocations = useMemo(() => {
    console.log("Filtering favorite locations");
    return locationList.filter((location) =>
      friendDashboardData[0].friend_faves.locations.includes(location.id)
    );
  }, [locationList, friendDashboardData]);

  const renderCategoriesButtons = () => {
    return (
      <FlatList
        data={locationCategories}
        horizontal={true}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => `${item}_${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item)}
            key={item}
            style={{
              width: 100,
              paddingHorizontal: '3%',
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              textAlign: 'center',
              justifyContent: 'center',
              backgroundColor: 'gray',
              height: "100%",
              justifyContent: "center",
              flex: 1,
              marginRight: "2%",
            }}
          >
            {" "}
            <Text style={[styles.categoryButtonText, themeStyles.genericText, {alignSelf: 'center', color: themeAheadOfLoading.lightColor}]}>{item}</Text>
          </TouchableOpacity>
        )}
           ListFooterComponent={() => (
                                  <View style={{ width: 400 }} />
                                )}
      />
    );
  };

  //const faveLocations = filterLocations();

  //drilling down the addToFaves and removeFromFaves to the LocationSavingActionsForCard component
  //Accessing this hook inside the component itself causes the card to rerender infinitely

  const FavoritesScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <LocationsFriendFavesList
        addToFavoritesFunction={handleAddToFaves}
        removeFromFavoritesFunction={handleRemoveFromFaves}
        locationList={faveLocations}
        scrollTo={faveLocationIdToScrollTo}
      />
    </View>
  );

  const SavedLocationsScreen = () => {
    const filteredLocationList = locationList.filter(
      (loc) => loc.category === selectedCategory || !selectedCategory
    );

    return (
      <View
        style={[styles.sectionContainer, themeStyles.genericTextBackground]}
      >
        <LocationsSavedList
          addToFavoritesFunction={handleAddToFaves}
          removeFromFavoritesFunction={handleRemoveFromFaves}
          locationList={filteredLocationList}
          scrollTo={locationIdToScrollTo}
        />
      </View>
    );
  };

  const iconMapping = {
    [selectedFriend.name]: "star",
    Others: "location",
    Recent: "time",
  };

  const handleScrollToFavoriteLocation = (locationItem) => {
    console.log("location id!", locationItem.id);
    setFaveLocationIdToScrollTo(locationItem.id);
  };

  const handleScrollToLocation = (locationItem) => {
    console.log("location id!", locationItem.id);
    setLocationIdToScrollTo(locationItem.id);
  };

 

  const handleTabChange = (tabIndex) => {
    console.log("Active Tab Index:", tabIndex);
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
        <View
          style={[styles.searchBarContent, { backgroundColor: "transparent" }]}
        >
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
                data={locationList}
                height={30}
                width={"27%"}
                borderColor={"transparent"}
                placeholderText={"Search"}
                textAndIconColor={themeAheadOfLoading.fontColorSecondary}
                backgroundColor={"transparent"}
                onPress={handleScrollToLocation}
                searchKeys={[
                  "address",
                  "title",
                  "parking_score",
                  "personal_experience_info",
                ]}
              />
            )}
            {!viewingAllLocations && (
              <MomentsSearchBar
                data={faveLocations}
                height={30}
                width={"27%"}
                borderColor={"transparent"}
                placeholderText={"Search"}
                textAndIconColor={themeAheadOfLoading.fontColorSecondary}
                backgroundColor={"transparent"}
                onPress={handleScrollToFavoriteLocation}
                searchKeys={[
                  "address",
                  "title",
                  "parking_score",
                  "personal_experience_info",
                ]}
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
          {locationCategories && viewingAllLocations && <View style={{position: 'absolute', zIndex: 3000, top: 78}}>{renderCategoriesButtons()}</View>}
          <Tab.Navigator
            tabBar={(props) => (
              <CustomTabBar {...props} onTabChange={handleTabChange} />
            )}
            screenOptions={({ route }) => ({
              tabBarStyle: {
                backgroundColor: themeAheadOfLoading.darkColor,
                flexDirection: "row",
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
                return (
                  <Ionicons
                    name={iconName}
                    size={18}
                    color={themeAheadOfLoading.fontColor}
                  />
                );
              },
            })}
          >
            <Tab.Screen
              name={selectedFriend.name}
              component={FavoritesScreen}
            />

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
    width: "100%",
    zIndex: 1,
  },
  searchBarContent: {
    width: "100%",
    paddingHorizontal: "1%",
    paddingVertical: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    width: "100%",
    flex: 1,
    zIndex: 1,
  },
});

export default ScreenLocations;
