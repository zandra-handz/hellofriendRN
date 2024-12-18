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
  header = "", //'SELECTED'
  height = "100%",
  maxHeight = 100,
  borderRadius = 20,
  borderColor = "transparent",
  imageSize = 0,
  image = require("../assets/shapes/fairymagic.png"),
  imagePositionHorizontal = 0,
  imagePositionVertical = 70,
  darkColor = "#4caf50",
  lightColor = "rgb(160, 241, 67)",
}) => {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyle();
  const { gradientColorsHome } = useGlobalStyle();
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

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
    }),
  });

  return (
    <View style={{ borderRadius: borderRadius }}>
      <EclipseAnim
        color={gradientColorsHome.lightColor}
        innerColor={gradientColorsHome.darkColor}
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
                <LoadingPage loading={isPending} spinnerType="flow" />
              </View>
            </>
          )}

          {!loadingNewFriend && friendLoaded && (
            <View
              style={{
                paddingRight: "4%",
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={styles.textContainer}>
                <TouchableOpacity onPress={onPress}>
                  <>
                    <Text
                      style={[
                        {
                          fontFamily: "Poppins-Regular",
                          fontSize: 30,
                          fontColor: "#000002",
                        },
                      ]}
                    >
                      {selectedFriend && friendDashboardData
                        ? selectedFriend.name
                        : "None"}
                    </Text>

                    <Text style={styles.subtitleText}>
                      {friendDashboardData
                        ? `Suggested: Say hi on ${friendDashboardData[0].future_date_in_words}`
                        : "No date available"}
                    </Text>
                  </>
                </TouchableOpacity>
              </View>
              {image && (
                <Image
                  source={image}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    top: imagePositionVertical,
                    right: imagePositionHorizontal,
                  }}
                  resizeMode="contain"
                />
              )}
              <View
                style={{
                  paddingVertical: "0%",
                  marginLeft: "8%",
                  borderRadius: 20,
                  height: "100%",
                  maxWidth: "50%",
                  minWidth: "40%",
                  flexGrow: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: "46%",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <View style={{ width: "74%" }}>
                    <ButtonIconMoments
                      iconSize={60}
                      onPress={onPress}
                      circleColor={"orange"}
                      countTextSize={14}
                      countColor={themeAheadOfLoading.fontColorSecondary}
                    />
                  </View>
                </View>

                <View
                  style={{
                    height: "46%",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <View style={{ width: "74%" }}>
                    <ButtonIconImages
                      iconSize={60}
                      onPress={navigateToImages}
                      circleColor={"orange"}
                      countTextSize={14}
                      countColor={themeAheadOfLoading.fontColorSecondary}
                    />
                  </View>
                </View>
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
    padding: "5%",
    paddingRight: "0%",
    alignContent: "center",
    marginVertical: "1%",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  textContainer: {
    zIndex: 5,
    position: "relative",
    paddingLeft: "2%",
    flexDirection: "column",
    width: "58%",
    justifyContent: "space-around",
  },
  headerText: {
    fontFamily: "Poppins-Regular",
    fontSize: 22,
    fontColor: "#000002",
  },
  subtitleText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  loadingWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeButtonSelectedFriend;
