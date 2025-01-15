import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendList } from "../context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../components/LoadingPage";
import ButtonIconMoments from "../components/ButtonIconMoments";
//import ButtonIconLocations from '../components/ButtonIconLocations';
import ButtonIconImages from "../components/ButtonIconImages";

import EclipseAnim from "../animations/EclipseAnim";
// Press function is internal
// HAS DOUBLE TAP PRESS AS WELL :)

//TOOK LOCATION BUTTON OUT FOR RIGHT NOW BECAUSE BAD
//<View style={{height: '26%', flexDirection: 'row', alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', width: '100%' }}>
//<View style={{width: '68%'}}>
//<ButtonIconLocations onPress={navigateToLocations} circleColor={themeAheadOfLoading.lightColor} countColor={themeAheadOfLoading.fontColorSecondary}  />
//</View>
//</View>

const DOUBLE_PRESS_DELAY = 300;

const HomeButtonSelectedFriend = ({ 
  height = "100%",
  maxHeight = 190,
  borderRadius = 20,
  borderColor = "transparent", 
}) => {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyle();
  const { themeStyleSpinners, manualGradientColors } = useGlobalStyle();
  const { darkColor, lightColor, homeDarkColor, homeLightColor } = manualGradientColors;
  const { themeAheadOfLoading } = useFriendList();
  //friendLoaded = dashboard data retrieved successfully
  const {
    selectedFriend,
    friendLoaded,
    friendDashboardData,
    isPending,
    isLoading,
    loadingNewFriend,
  } = useSelectedFriend();

  const lastPress = useRef(0);
  const pressTimeout = useRef(null);

  const navigateToMoments = () => {
    navigation.navigate("Moments");
  };

  //const navigateToLocations = () => {
  //  navigation.navigate('Locations');
  // };

  const navigateToImages = () => {
    navigation.navigate("Images");
  };

  const navigateToAddMoment = () => {
    navigation.navigate("MomentFocus");
  };

  const handleSinglePress = () => {
    navigateToMoments();
  };

  const handleDoublePress = () => {
    console.log("Double press detected");
    navigateToAddMoment();
  };

  const onPress = () => {
    const now = Date.now();
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) {
      clearTimeout(pressTimeout.current);
      handleDoublePress();
    } else {
      pressTimeout.current = setTimeout(() => {
        handleSinglePress();
      }, DOUBLE_PRESS_DELAY);
    }
    lastPress.current = now;
  };
 

  return (
    <View style={{ maxHeight: maxHeight, borderRadius: borderRadius }}>
      <EclipseAnim
        color={homeLightColor ? homeLightColor : 'lightgreen'}
        innerColor={homeDarkColor ? homeDarkColor : 'darkgreen'}
        delay={10}
        speed={100}
      >
        <View
          style={[
            styles.container,
            {
              borderRadius: borderRadius,
              borderColor: borderColor,
              height: height,
              maxHeight: maxHeight,
              minHeight: 180,
            },
          ]}
        >
          <LinearGradient
            colors={[darkColor, lightColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />

          {isLoading && !friendLoaded && (
            <>
              <View style={styles.loadingWrapper}>
                <LoadingPage loading={isPending} spinnerType={themeStyleSpinners.homeScreen} />
              </View>
            </>
          )}

          {!loadingNewFriend && friendLoaded && (
            <View
              style={{ 
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                borderRadius: borderRadius,
                //backgroundColor: 'pink',
                width: "100%",
              }}
            >
              <View style={styles.textContainer}>
                <TouchableOpacity onPress={onPress}>
                  <>
                  <>
                    <Text
                      style={[
                        {
                          fontFamily: "Poppins-Regular",
                          fontSize: 23,
                          fontColor: "#000002",
                        },
                      ]}
                    >
                      {selectedFriend && friendDashboardData
                        ? selectedFriend.name
                        : "None"}
                    </Text>
                    </>
<>
                    <Text style={styles.subtitleText}>
                      {friendDashboardData && friendDashboardData[0] && friendDashboardData[0].future_date_in_words
                        ? `Suggested: Say hi on ${friendDashboardData[0].future_date_in_words}`
                        : "No date available"}
                    </Text>
                    </>
                  </>
                </TouchableOpacity>
              </View> 
              <View
                style={{ 
                  borderRadius: 20,
                  height: "100%",
                  //backgroundColor: 'teal',
                  minWidth: '10%',
                  maxWidth: '12%',  
                  alignItems: 'center',
                  alignContent: 'center',
                  flexDirection: "column",
                  justifyContent: "space-between", //ADJUST POSITION HERE
                  paddingTop: '2%', //ADJUST POSITION HERE
                }} > 
                    <ButtonIconMoments
                    height={'40%'} //ADJUST POSITION HERE
                      iconSize={46}
                      onPress={onPress}
                      circleColor={"orange"}
                      countTextSize={11}
                      countColor={themeAheadOfLoading ? themeAheadOfLoading.fontColorSecondary : 'orange'}
                    />  
                                        <ButtonIconImages
                                         height={'40%'} //ADJUST POSITION HERE
                      iconSize={46}
                      onPress={navigateToImages}
                      circleColor={"orange"}
                      countTextSize={11}
                      countColor={themeAheadOfLoading ? themeAheadOfLoading.fontColorSecondary : 'orange'}
                    />
                </View> 
            </View>
          )}
        </View>
      </EclipseAnim>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",  
    height: 180,
    padding: "5%", 
    alignContent: "center", 
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",  
    backgroundColor: 'teal', 
  
    
  },
  textContainer: {
    zIndex: 5, 
    paddingLeft: "2%",
    flexDirection: "column",
    width: "58%",
    height: '100%',
    justifyContent: "space-between", 
  }, 
  subtitleText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  loadingWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeButtonSelectedFriend;
