//<SwitchSvg
//      width={24}
//    height={24}
//  style={styles.switchIcon}
//  color={themeStyles.genericTextBackgroundShadeTwo.backgroundColor}
// />

//TO TRY LATER TO FLIP THE BUTTON?
//const lizardHandsFlip = position.interpolate({
//  inputRange: [-screenHeight / 20, 0],
//  outputRange: [-1, 1],  // Flip horizontally when the position is negative
//  extrapolate: "clamp",
//});
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SwitchSvg from "@/app/assets/svgs/switch.svg";
import SearchBarGoogleAddress from "./SearchBarGoogleAddress";
import SearchBarSavedLocations from "./SearchBarSavedLocations";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SearchBarAnimationWrapper from "../foranimations/SearchBarAnimationWrapper";

const DualLocationSearcher = ({
  onPress,
  isFavoritesList = false,
  locationListDrilledOnce,
}) => {
    const HEADER_HEIGHT = 60;
  const { themeStyles, manualGradientColors, appFontStyles } = useGlobalStyle();
  const searchStringRef = useRef(null);
  const [savedLocationsSearchIsVisible, setSavedLocationsVisibility] =
    useState(false);
  const [mountingText, setMountingText] = useState("");
  const [searchString, setSearchString] = useState("");

  const updateSearchString = (text) => {
    setSearchString(text);

    if (searchStringRef && searchStringRef.current) {
      searchStringRef.current.setText(text);
    }
  };

  const switchViews = () => {
    setMountingText(searchString);
    setSavedLocationsVisibility(!savedLocationsSearchIsVisible);
  };



  return (
    <View style={[styles.container, {}]}>
      <>
        <View
          style={{
            width: "100%",
            padding: 10,
            paddingBottom: 0,
            position: "absolute",
            top: 0,
            flex: 1,
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
            height: HEADER_HEIGHT,
          }}
        >
        {savedLocationsSearchIsVisible && <Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: appFontStyles.welcomeText.fontSize - 6}]}>
           Saved locations </Text>}
                   {!savedLocationsSearchIsVisible && <Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: appFontStyles.welcomeText.fontSize - 6}]}>
           Google maps </Text>}
        </View>
        {!savedLocationsSearchIsVisible && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              position: "absolute",
              justifyContent: "flex-end",
              right: 0,
              left: 0,
              top: HEADER_HEIGHT,
            }}
          >
            <View style={[styles.googleSearchContainer, themeStyles.primaryBackground]}>
              <SearchBarAnimationWrapper>
                <SearchBarGoogleAddress
                  ref={searchStringRef}
                  mountingText={mountingText}
                  onPress={onPress}
                  visible={true}
                  onTextChange={updateSearchString}
                />
              </SearchBarAnimationWrapper>
            </View>
          </View>
        )}

        {savedLocationsSearchIsVisible && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              height: 48,
              position: "absolute",
              justifyContent: "flex-end",
              width: "100%",
              top: HEADER_HEIGHT,
            }}
          >
            <View style={[styles.savedLocationsContainer, themeStyles.primaryBackground, {backgroundColor: themeStyles.primaryBackground.backgroundColor}]}>
              <SearchBarAnimationWrapper>
                <SearchBarSavedLocations
                  locationListDrilledTwice={locationListDrilledOnce}
                  ref={searchStringRef}
                  mountingText={mountingText}
                  triggerAnimation={savedLocationsSearchIsVisible}
                  onTextChange={updateSearchString}

                  onPress={onPress}
                  searchStringRef={searchStringRef}
                />
              </SearchBarAnimationWrapper>
            </View>
          </View>
        )}

        <View style={[styles.buttonContainer, themeStyles.primaryBackground]}> 
          <TouchableOpacity
            onPress={switchViews}
            style={[
              styles.circleButton,
              //themeStyles.footerIcon,
              { backgroundColor: manualGradientColors.homeDarkColor },
            ]}
          >
            {!savedLocationsSearchIsVisible && !isFavoritesList && (
              <SwitchSvg
                width={24}
                height={24}
                color={manualGradientColors.lightColor}
              />
            )}
            {!savedLocationsSearchIsVisible && isFavoritesList && (
              <SwitchSvg
                width={24}
                height={24}
                color={manualGradientColors.lightColor}
              />
            )}
            {savedLocationsSearchIsVisible && (
              //<GoogleLogoSvg width={24} height={24} />
              <SwitchSvg
                width={24}
                height={24}
                color={manualGradientColors.lightColor}
              />
            )}
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",

    zIndex: 1000,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    right: 0, 
    zIndex: 6000,
    marginBottom: 2,
    height: "auto",
    width: 54,

    justifyContent: "flex-end",
    zIndex: 4000,
  },
  switchIcon: {
    position: "absolute",
    zIndex: 5000,
    width: "100%",
    top: 0,
    right: 36,
    borderRadius: 20,
    padding: "8%",
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    backgroundColor: "transparent",
    width: "100%",
    marginTop: 0,
    paddingRight: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: "100%",
    borderRadius: 30,
    height: 48,
  },
  searchIcon: {
    position: "absolute",
    right: 14,
    top: "18%",
  },
  searchInput: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    textAlign: "left",
    overflow: "hidden",
    paddingHorizontal: 12,
    height: "auto",
  },
  listView: {
    backgroundColor: "white",
    marginTop: -4,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "white",
    maxHeight: 300,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  iconStyle: {
    marginRight: 0,
  },
  savedLocationsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%", 
    zIndex: 2200,
    elevation: 2200, 
  },
  googleSearchContainer: {
    justifyContent: "center",
    width: "100%", 
    //backgroundColor: 'pink',
    // flex: 1, 

    zIndex: 3000,
  },
});

export default DualLocationSearcher;
