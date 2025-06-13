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

    const INPUT_CONTAINER_BORDER_RADIUS = 10;

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
      console.log('handlePress triggered in SearchBarGoogleAddress');
      if (details) {
        const { lat, lng } = details.geometry.location;
        console.log(lat, lng);
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

    // useEffect(() => {
    //   console.log("Current search text:", searchText);
    // }, [searchText]);

    return (
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Search"
        predefinedPlaces={[]}
        keepResultsAfterBlur={true} // if remove, onPress won't work
        textInputProps={{
          autoFocus: mountingText.length > 0 ? true : false,
          placeholderTextColor: themeStyles.genericText.color,
          onChangeText: handleTextInputChange, // Capture typing updates
        }}
        minLength={2}
        numberOfLines={1}
        timeout={1000}
        fetchDetails
        onPress={handlePress}
        nearbyPlacesAPI="GooglePlacesSearch"
        query={{
          key: "AIzaSyAY-lQdQaVSKpPz9h2GiX_Jde47nv3FsNg",
          language: "en",
        }}
        enablePoweredByContainer={false}
        styles={{
          textInputContainer: [
            styles.inputContainer,
            themeStyles.genericTextBackground, {borderRadius: INPUT_CONTAINER_BORDER_RADIUS, borderColor: themeStyles.primaryText.color}
          ],
          textInput: [[ themeStyles.genericText, {paddingHorizontal: 5, height: 24, backgroundColor: 'transparent'}]],
        }}
        renderLeftButton={() => (
          <GoogleLogoSvg width={26} height={26} style={styles.iconStyle} />
        )}
      />
    );
  }
);

const styles = StyleSheet.create({
 
  textInputContainer: {
    backgroundColor: "transparent",
    width: "100%", 
    paddingRight: 2, 
  },
  inputContainer: {
    //flexDirection: "row-reverse", 
    alignItems: "center",
   // width: "80%", // Make input field take up full width
    borderWidth: StyleSheet.hairlineWidth,
     
    backgroundColor: "transparent", // NEED THIS TO OVERRIDE
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
