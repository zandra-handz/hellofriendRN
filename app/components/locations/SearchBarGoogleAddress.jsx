import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import React, {
  useState,
  useRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import {   StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import GoogleLogoSvg from "@/app/assets/svgs/google-logo.svg"; 

// The component wrapped with forwardRef
const SearchBarGoogleAddress = forwardRef(
  ({ onPress, mountingText, onTextChange }, ref) => {
    const { themeStyles } = useGlobalStyle();
    const googlePlacesRef = useRef();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
      if (googlePlacesRef.current) {
        googlePlacesRef.current.setAddressText(mountingText);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      setText: (text) => {
        if (googlePlacesRef.current) {
          googlePlacesRef.current.setAddressText(text);
          setSearchText(text);
        }
      },
      clearText: () => {
        if (googlePlacesRef.current) {
          googlePlacesRef.current.clear();
          setSearchText("");
        }
      },
    }));

    const generateTemporaryId = () => {
      return `temp_${Date.now()}`;
    };

    const handlePress = (data, details = null) => {
      if (details) {
        const { lat, lng } = details.geometry.location;
        const newLocation = {
          id: generateTemporaryId(),
          address: details.formatted_address,
          latitude: lat,
          longitude: lng,
          notes: "",
          title: details.name || "Search",
          validatedAddress: true,
          friendsCount: 0,
          friends: [],
        };

        onPress(newLocation);
        //handleGoToLocationViewScreen(newLocation);
        googlePlacesRef.current?.setAddressText("");
      }
      googlePlacesRef.current?.setAddressText("");
    };

    const handleTextInputChange = (text) => {
      setSearchText(text); // Update local state
      onTextChange?.(text); // Notify parent of the change
    };

    useEffect(() => {
      console.log("Current search text:", searchText);
    }, [searchText]);

    return (
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Search Google maps"
        textInputProps={{
          autoFocus: mountingText.length > 0 ? true : false,
          placeholderTextColor: themeStyles.genericText.color,
          onChangeText: handleTextInputChange, // Capture typing updates
        }}
        minLength={2}
        fetchDetails
        onPress={handlePress}
        query={{
          key: "AIzaSyAY-lQdQaVSKpPz9h2GiX_Jde47nv3FsNg",
          language: "en",
        }}
        styles={{
          textInputContainer: [
            styles.inputContainer,
            themeStyles.genericTextBackground,
          ],
          textInput: [styles.inputContainer, themeStyles.genericText],
        }}
        renderRightButton={() => (
          <GoogleLogoSvg width={26} height={26} style={styles.iconStyle} />
        )}
      />
    );
  }
);

const styles = StyleSheet.create({
  //moved to parent because animation wrapper goes under this
  //container: {
  //justifyContent: 'flex-start',
  //width: '86%',
  //backgroundColor: 'transparent',
  //padding: 0,
  //zIndex: 1,
  //},
  textInputContainer: {
    backgroundColor: "transparent",
    width: "100%", 
    paddingRight: 2,
  },
  inputContainer: {
    flexDirection: "row-reverse", 
    alignItems: "center",
    width: "100%", // Make input field take up full width
    borderRadius: 30,
    height: 48,
    backgroundColor: "transparent",
    paddingLeft: "4%",
    paddingVertical: '3%',
  }, 
  listView: {
    marginTop: -4,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "white",
    maxHeight: 300,
    width: "100%",
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  iconStyle: { 
  },
});

export default SearchBarGoogleAddress;
