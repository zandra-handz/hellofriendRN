import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
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
  ({ onPress, mountingText, onTextChange, primaryColor, primaryBackground }, ref) => {
 
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
      console.log("handlePress triggered in SearchBarGoogleAddress");
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
        googlePlacesRef.current?.setAddressText("");
      }
      googlePlacesRef.current?.setAddressText("");
    };

    const handleTextInputChange = (text) => {
      setSearchText(text);  
      onTextChange?.(text); // UPDATE PARENT
    };
 

    return (
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Search"
        predefinedPlaces={[]}
        keepResultsAfterBlur={true} // if remove, onPress won't work
        textInputProps={{
          autoFocus: mountingText.length > 0 ? true : false,
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
          textInputContainer: [
            styles.inputContainer,
           
            {
              backgroundColor: primaryBackground,
              borderRadius: 999,//INPUT_CONTAINER_BORDER_RADIUS,
              borderColor: primaryColor,
            },
          ],
          textInput: [
            [ 
              {
                color: primaryColor,
                // paddingLeft: 10,
                // height: 24,
                backgroundColor: "transparent",
              },
            ],
          ],
        }}
        renderLeftButton={() => (
          <GoogleLogoSvg width={16} height={16} style={styles.iconStyle} />
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
      
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    paddingLeft: 10,
    paddingVertical: 1,
 
    alignItems: "center",
    // width: "80%", // Make input field take up full width
    //borderWidth:1,
 
    paddingLeft: 10,
    paddingVertical: 0,
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

    marginRight: 2,
  },
});

export default SearchBarGoogleAddress;
