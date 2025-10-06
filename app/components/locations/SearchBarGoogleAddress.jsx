import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";
import React, {
  useState,
  useRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import GoogleLogoSvg from "@/app/assets/svgs/google-logo.svg";

// The component wrapped with forwardRef
const SearchBarGoogleAddress = forwardRef(
  (
    {
      onPress,
      autoFocus=true,
      mountingText,
      onTextChange,
      primaryColor,
      primaryBackground,
      paddingLeft = 10,
    },
    ref
  ) => {
    const googlePlacesRef = useRef();
    const [searchText, setSearchText] = useState("");

    const INPUT_CONTAINER_BORDER_RADIUS = 10;

    useEffect(() => {
      if (googlePlacesRef.current) {
        googlePlacesRef.current.setAddressText(mountingText);
        googlePlacesRef.current.focus();
      }
    }, [autoFocus]);

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
      console.log(`DETAILS`, details);
      if (details) {
        const { lat, lng } = details.geometry.location;
        // console.log(lat, lng);
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

        googlePlacesRef.current?.setAddressText("");
      }
      // googlePlacesRef.current?.setAddressText("");
    };

    const handleTextInputChange = (text) => { 
      setSearchText(text);
      onTextChange?.(text); // UPDATE PARENT
    };

    return (
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        autoFocus={autoFocus}
        placeholder="Search"
        suppressDefaultStyles={true}
     
        listUnderlayColor="red"
        predefinedPlaces={[]}
        keyboardShouldPersistTaps={'false'} // THIS FIXED THE DOUBLE RENDERING!
       // keepResultsAfterBlur={true} // if remove, onPress won't work // EDIT THIS IS BECAUSE ON PRESS CAUSES EVERYTHNG TO RERENDER THE FIRST TIME
        textInputProps={{
          autoFocus: autoFocus,
          placeholderTextColor: primaryColor,
          onChangeText: handleTextInputChange,
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
          poweredContainer: [
            {
              justifyContent: "flex-end",
              alignItems: "center",
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderColor: "#c8c7cc",
              borderTopWidth: 0.5,
            },
          ],
          description: [{ color: primaryColor }], // ROW LABELS
          row: [
            {
              backgroundColor: primaryBackground,
              opacity: 0.8,
              padding: 13,
              height: 44,
              flexDirection: "row",
            },
          ],
          separator: [
            {
              color: "hotpink",
            },
          ],
          loader: [
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              height: 20,
            },
          ],
          listView: [
            {
              color: "orange",
              backgroundColor: "teal",
              padding: 10,
              // maxHeight: 400,
            },
          ],
          separator: [
            {
              height: 0.5,
              backgroundColor: "tranparent",
            },
          ],

          textInputContainer: [
            // styles.inputContainer,

            {
              width: "100%",
              paddingLeft: paddingLeft,

              backgroundColor: primaryBackground,
              borderColor: "orange",
              borderWidth: 0,

            },
          ],

          textInput: [
            [
              {
                color: primaryColor,
              },
            ],
          ],
        }}
        // renderLeftButton={() => (
        //   <GoogleLogoSvg width={16} height={16} style={styles.iconStyle} />
        // )}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    flexDirection: "row",
    width: "100%",

    borderColor: "orange",
    borderWidth: 3,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
  },
  poweredContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "#c8c7cc",
    borderTopWidth: 0.5,
  },
  powered: {},
  listView: {},
  row: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    height: 44,
    flexDirection: "row",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#c8c7cc",
  },
  description: {},
  loader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 20,
  },
});

export default SearchBarGoogleAddress;
