// <SearchBarForFormattedData formattedData={flattenHelloes} originalData={helloesList} placeholderText={'Search'} borderColor={'transparent'} onPress={openHelloesNav} searchKeys={['date', 'locationName',  'capsule',  'additionalNotes']} />

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext"; 
import HelloesSearchBar from "@/app/components/helloes/HelloesSearchBar";
import { Ionicons } from "@expo/vector-icons";
import SafeView from "@/app/components/appwide/format/SafeView";

import HelloesList from "@/app/components/helloes/HelloesList";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CustomTabBar from "@/app/components/appwide/CustomTabBar";
  
import HelloesNavigator from "@/app/components/helloes/HelloesNavigator";
import HeaderHelloes from "@/app/components/headers/HeaderHelloes";
import { LinearGradient } from "expo-linear-gradient"; 
import CalendarLightsDataPrepLayer from "@/app/components/foranimations/CalendarLightsDataPrepLayer";

const Tab = createBottomTabNavigator();

const ScreenHelloes = ({ route, navigation }) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
 
  const [isModalVisible, setIsModalVisible] = useState(false);

  //to transition over to
  const [isHelloesNavVisible, setHelloesNavVisible] = useState(false);
  const [selectedHelloToView, setSelectedHelloToView] = useState(null);

  const [selectedHello, setSelectedHello] = useState(null);
  const { helloesList, flattenHelloes, getCachedInPersonHelloes } =
    useHelloes(); //useHelloesData();

  const inPersonHelloesNew = getCachedInPersonHelloes();
  const openHelloesNav = (hello) => {
    setSelectedHelloToView(hello);
    setHelloesNavVisible(true);
  };

  const closeHelloesNav = () => {
    setHelloesNavVisible(false);
  };

  const onPress = (hello) => {
    if (hello) {
      setSelectedHello(hello);
      setIsModalVisible(true);
    } else {
      console.log("This hello is not in the list.");
    }
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const HelloesScreen = () => (
    <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
      <HelloesList
        onPress={openHelloesNav}
        helloesData={helloesList}
        horizontal={false}
      />
    </View>
  );

  const HelloesInPersonScreen = () => {
    return (
      <View
        style={[styles.sectionContainer, themeStyles.genericTextBackground]}
      >
        {inPersonHelloesNew && (
          <HelloesList
            onPress={openHelloesNav}
            helloesData={inPersonHelloesNew}
            horizontal={false}
          />
        )}
      </View>
    );
  };

  return (
    <SafeView style={{flex: 1}}>
      
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      <HeaderHelloes />
      <>
        <View
          style={[styles.searchBarContent, { backgroundColor: "transparent" }]}
        >
          <CalendarLightsDataPrepLayer
                 daySquareBorderRadius={20}
                 //daySquareBorderColor={themeStyles.genericText.color}
                 opacityMinusAnimation={.8}
                 animationColor={themeAheadOfLoading.lightColor}
          />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              paddingHorizontal: "3%",
            }}
          >
            <HelloesSearchBar
              formattedData={flattenHelloes}
              originalData={helloesList}
              height={30}
              width={"27%"}
              borderColor={"transparent"}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={openHelloesNav}
              searchKeys={["capsule", "additionalNotes", "date", "location"]}
            />
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
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
              //lazy: true, 
              tabBarStyle: {
                backgroundColor: "transparent",
                flexDirection: "row",
                top: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
              },
              tabBarActiveTintColor: themeAheadOfLoading.fontColor,
              tabBarInactiveTintColor: themeAheadOfLoading.fontColor,
              tabBarIcon: ({ color }) => {
                let iconName;
                if (selectedFriend && route.name === `${selectedFriend.name}`) {
                  iconName = "star";
                } else if (route.name === "Others") {
                  iconName = "location";
                } else if (route.name === "Recent") {
                  iconName = "time";
                }
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
            <Tab.Screen name="All" component={HelloesScreen} />
            <Tab.Screen name="In person" component={HelloesInPersonScreen} />
            
          </Tab.Navigator>
        </View>
      </>
      {isHelloesNavVisible && selectedHelloToView && (
        <HelloesNavigator
          onClose={closeHelloesNav}
          hello={selectedHelloToView}
        />
      )}
    </LinearGradient>
    
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
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
    zIndex: 2000,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContent: {
    width: "100%",
    paddingHorizontal: "1%",
    paddingBottom: "2%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
  },
  sectionContainer: {
    paddingTop: 24,
    width: "100%",
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "black",
    justifyContent: "space-around",
    alignContent: "center",
    borderRadius: 0,
    padding: 4,
    paddingTop: 50,
    height: "100%",
    maxHeight: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ScreenHelloes;
