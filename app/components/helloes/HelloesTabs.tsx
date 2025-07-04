import { View,  StyleSheet } from "react-native";
import React, { useMemo  } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "@/app/components/appwide/CustomTabBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import MomentsSearchBar from "@/app/components/moments/MomentsSearchBar";
import CalendarLightsDataPrepLayer from "@/app/components/foranimations/CalendarLightsDataPrepLayer";
import { BlurView } from "expo-blur";
import HelloesList from "./HelloesList";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer"; 
import { Ionicons } from "@expo/vector-icons";
import BodyStyling from "../scaffolding/BodyStyling";


import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const HelloesTabs = () => {
  const { themeStyles, appContainerStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();
 

  const { helloesList, flattenHelloes  } =
    useHelloes();


      const inPersonHelloesNew = useMemo(() => {
        if (helloesList) {
          return helloesList?.filter((hello) => hello.type === "in person");
        }
      }, [helloesList]);
 

  const belowHeaderIconSize = 28;

  const openHelloesNav = (formattedItem) => {
    const originalItem = findOriginalItem(formattedItem);
    navigation.navigate('HelloView', {hello: originalItem});
    // setSelectedHelloToView(originalItem);
    // setHelloesNavVisible(true);
  };

  const findOriginalItem = (formattedItem) => {
    return helloesList.find((item) => item.id === formattedItem.id);
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
    <View style={appContainerStyles.screenContainer}>
      <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom={4}
        justifyContent="flex-end"
        children={
          <>
            <View
              style={{
                flexDirection: "row",
                height: "100%",
                alignItems: "center",
                width: "50%",
                justifyContent: "flex-end",
                //  overflow: "hidden",
                marginRight: 10,
                height: 30,
              }}
            >
              <View style={{ width: 30, marginHorizontal: 4 }}></View>
              <View style={{ width: 30, marginHorizontal: 4 }}>
                {/* <CalendarLightsDataPrepLayer
                 daySquareBorderRadius={20}
                 //daySquareBorderColor={themeStyles.genericText.color}
                 opacityMinusAnimation={.8}
                 animationColor={themeAheadOfLoading.lightColor}
          /> */}
              </View>
            </View>

            <MomentsSearchBar
              data={flattenHelloes}
              height={25}
              width={"47%"}
              borderColor={themeAheadOfLoading.fontColorSecondary}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={openHelloesNav}
              searchKeys={["capsule", "additionalNotes", "date", "location"]}
              iconSize={belowHeaderIconSize * 0.5}
            />
          </>
        }
      />

      <BodyStyling
        height={"100%"}
        width={"100%"}
        paddingTop={0}
        paddingHorizontal={0}
        paddingBottom={0}
        transparentBackground={true}
        children={
          <Tab.Navigator
           // tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({ 
              //lazy: true,
              // headerShown: false,
              // header: () => {
              //   <View style={{ width: "100%", height: 200 }}></View>;
              // },
headerShown: false,
              tabBarStyle: {
                //backgroundColor: themeStyles.primaryBackground.backgroundColor,
                // flexDirection: "row",
                height: 60,
                top: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
                position: 'absolute',
              },
              tabBarPosition: 'top',

              tabBarBackground: () => (
                <BlurView
                  tint="dark"
                  intensity={100}
                  style={StyleSheet.absoluteFill}
                />
              ),
              tabBarActiveTintColor: manualGradientColors.lightColor,
              tabBarInactiveTintColor: themeStyles.primaryText.color,

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
        }
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 74,
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

export default HelloesTabs;
