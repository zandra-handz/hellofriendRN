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
import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
} from "react-native";
import ListDownSvg from "../assets/svgs/list-down.svg";
import SwitchSvg from "../assets/svgs/switch.svg";
import GoogleLogoSvg from "../assets/svgs/google-logo.svg";
import SearchBarGoogleAddress from "../components/SearchBarGoogleAddress";
import SearchBarSavedLocations from "../components/SearchBarSavedLocations";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import SearchBarAnimationWrapper from "../components/SearchBarAnimationWrapper";

const DualLocationSearcher = ({
  onPress,
  isFavoritesList = false,
  locationListDrilledOnce,
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
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
    <View style={styles.container}>
      <>
        {!savedLocationsSearchIsVisible && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              position: "absolute",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <View style={styles.googleSearchContainer}>
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
            }}
          >
            <View style={styles.savedLocationsContainer}>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={switchViews}
            style={[
              styles.circleButton,
              themeStyles.footerIcon,
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
    zIndex: 1000,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    right: "1%",
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
    backgroundColor: "pink",
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
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: "100%",
    borderRadius: 30,
    height: 48,
    backgroundColor: "transparent",
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
    marginRight: 10,
  },
  savedLocationsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "86%",
    zIndex: 2200,
    elevation: 2200,
  },
  googleSearchContainer: {
    justifyContent: "flex-start",
    width: "86%",
    backgroundColor: "transparent",
    padding: 0,
    zIndex: 3000,
    position: "absolute",
  },
});

export default DualLocationSearcher;
