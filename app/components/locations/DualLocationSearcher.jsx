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
import { View, Text, StyleSheet, Pressable } from "react-native";
import { manualGradientColors } from "@/src/hooks/StaticColors";

import { Octicons } from "@expo/vector-icons";
import SearchBarGoogleAddress from "./SearchBarGoogleAddress";
import SearchBarSavedLocations from "./SearchBarSavedLocations";
import SearchBarAnimationWrapper from "../foranimations/SearchBarAnimationWrapper";

const DualLocationSearcher = ({
  onPress,
  isFavoritesList = false,
  locationListDrilledOnce,
  primaryColor,
  primaryBackground,  
  savedLocationsDDVisible,
  setSavedLocationsDDVisibility,
}) => {
  const HEADER_HEIGHT = 60;

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
        {!savedLocationsSearchIsVisible && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              position: "absolute",
              justifyContent: "flex-end",
              right: 0,
              left: 0,
              //  top: HEADER_HEIGHT,
            }}
          >
            <View
              style={[
                styles.googleSearchContainer,
                { backgroundColor: primaryBackground },
              ]}
            >
              <SearchBarAnimationWrapper>
                <SearchBarGoogleAddress
                  ref={searchStringRef}
                  mountingText={mountingText}
                  onPress={onPress}
                  visible={true}
                  onTextChange={updateSearchString}
                  primaryColor={primaryColor}
                  primaryBackground={primaryBackground}
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
              // top: HEADER_HEIGHT,
            }}
          >
            <View
              style={[
                styles.savedLocationsContainer,

                {
                  backgroundColor: primaryBackground,
                },
              ]}
            >
              <SearchBarAnimationWrapper>
                <SearchBarSavedLocations
                showFullList={savedLocationsDDVisible}
                setShowFullList={setSavedLocationsDDVisibility}
                  locationListDrilledTwice={locationListDrilledOnce}
                  ref={searchStringRef}
                  mountingText={mountingText}
                  triggerAnimation={savedLocationsSearchIsVisible}
                  onTextChange={updateSearchString}
                  onPress={onPress}
                  searchStringRef={searchStringRef}
                  manualGradientColors={manualGradientColors}
                  primaryColor={primaryColor}
                  primaryBackground={primaryBackground}
                />
              </SearchBarAnimationWrapper>
            </View>
          </View>
        )}

        <View
          style={[
            styles.buttonContainer,
            // { backgroundColor: primaryBackground },
          ]}
        >
          <Pressable
            onPress={switchViews}
            style={[
              styles.circleButton,
              // { backgroundColor: manualGradientColors.homeDarkColor },
            ]}
          >
            {!savedLocationsSearchIsVisible && !isFavoritesList && (
              <Octicons
                name={"arrow-switch"}
                size={24}
                color={primaryColor}
                style={{ opacity: 0.6 }}
              />
            )}
            {!savedLocationsSearchIsVisible && isFavoritesList && (
              <Octicons
                name={"arrow-switch"}
                color={primaryColor}
                style={{ opacity: 0.6 }}
              />
            )}
            {savedLocationsSearchIsVisible && (
              <Octicons
                name={"arrow-switch"}
                size={24}
                color={primaryColor}
                style={{ opacity: 0.6 }}
              />
            )}
          </Pressable>
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
