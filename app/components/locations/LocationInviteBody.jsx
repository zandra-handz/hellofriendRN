import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";

// import useLocationFunctions from "../hooks/useLocationFunctions";
import { useLocations } from "@/src/context/LocationsContext";

import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
 

import { useQueryClient } from "@tanstack/react-query";
 
import { useUser } from "@/src/context/UserContext";
import LocationDayAndHrsSelector from "./LocationDayAndHrsSelector";

// weekday data passed from LocationHoursOfOperation to ScreenLocationSend to here
const LocationInviteBody = ({
  messageData,
  setMessageData,
  additionalDetails, 
  location,
  handleGetDirections,
  handleSendText,
  weekdayTextData,
  initiallySelectedDay,
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");


  const [editedMessage, setEditedMessage] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [hoursForDay, setHoursForDay] = useState("");



  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

 
  const { checkIfOpen, getCurrentDay } = useLocationDetailFunctions();
 

 

 
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // useEffect(() => {
  //   const updateFromCache = () => {
  //     //console.log('checking cache for location data');

  //     if (locationList && location) {
  //       //console.log('location object', locationObject);
  //       const matchedLocation = locationList.find(
  //         (loc) => loc.id === location.id
  //       );
  //       if (matchedLocation) {
  //         setLocationDetails(matchedLocation);

  //         //      console.log('cached data for location found: ', matchedLocation);
  //       } else {
  //         setLocationDetails(location); //back up if nothing in cache
  //         //      console.log('no data found in cache for this location');
  //       }
  //     }
  //   };

  //   updateFromCache();
  // }, [location, locationList, queryClient]);

  // useEffect(() => {
  //   setIsFetching(false);
  //   //console.log(currentDayDrilledTwice);
  //   if (location == true) {
  //     clearAdditionalDetails();
  //   }
  // }, [location]);

  const renderOpenStatus = (data) => {
    let isOpenNow;
    isOpenNow = checkIfOpen(data);

    return (
      <View
        style={[
          {
            marginRight: "2%",
            borderWidth: 2,
            borderColor: isOpenNow
              ? `lightgreen`
              : isOpenNow === false
                ? `red`
                : "transparent",
            backgroundColor:
              themeStyles.genericTextBackgroundShadeTwo.backgroundColor,

            width: "auto",
            paddingHorizontal: "3%",
            paddingVertical: "1%",
            borderRadius: 20,
          },
        ]}
      >
        <Text
          style={[
            themeStyles.genericText,
            {
              fontSize: 12,
              fontWeight: "bold",
            },
          ]}
        >
          {isOpenNow ? `Open` : isOpenNow === false ? `Closed` : ""}
        </Text>
      </View>
    );
  };


  const handleSetUserMessage = (text) => {
    setMessageData({userMessage: text});
  }
  // useEffect(() => {
  //   if (location && location.address) {
  //     const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
  //     setMessage(directionsLink);
  //     setEditedMessage(
  //       `${user.username} has sent you a meet up site from the hellofriend app!`
  //     ); // Default message for editing
  //   } else {
  //     setMessage("Directions not available.");
  //     setEditedMessage("Plan details are not available.");
  //   }
  // }, [location]);

  const handleDaySelect = (day, hours) => {
    setMessageData({daySelected: day, hours: hours})
    // setSelectedDay(day);
    // setHoursForDay(hours);
  };

  const handleSend = useCallback((editedMessage, selectedDay, hoursForDay) => {
    handleSendText(editedMessage, selectedDay, hoursForDay);
    Linking.openURL(`sms:?body=${encodeURIComponent(finalMessage)}`);
  }, [handleSendText, editedMessage, selectedDay, hoursForDay ]);

  return (
    <View
      style={[
        appContainerStyles.talkingPointCard,
        {
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          height: '100%',
          flexDirection: "column",
          flexWrap: "wrap",
          width: "100%",
          paddingHorizontal: 0,
          paddingTop: 20,
        }}
      >
        <Text
          numberOfLines={2}
          style={[
            themeStyles.primaryText,
            appFontStyles.welcomeText,
            { flexDirection: "row", width: "90%", flexWrap: "wrap" },
          ]}
        >
          {location.title}
        </Text>
        <Text
          numberOfLines={1}
          onPress={handleGetDirections}
          style={[
            themeStyles.primaryText,
            appFontStyles.subWelcomeText,
            { flexDirection: "row", width: "90%", flexWrap: "wrap" },
          ]}
        >
          {" "}
          {location.address}
        </Text>

        {additionalDetails && additionalDetails.hours && (
          <>
            <LocationDayAndHrsSelector
              height={"50%"}
              onDaySelect={handleDaySelect}
              daysHrsData={additionalDetails?.hours?.weekday_text}
              initiallySelectedDay={initiallySelectedDay}
            />
          </>
        )}
        <View style={styles.previewContainer}>
          <Text style={[styles.previewTitle, themeStyles.genericText]}></Text>
          <TextInput
            style={[
              styles.textInput,
              themeStyles.genericText,
              themeStyles.genericTextBackgroundShadeTwo,
            ]}
            value={messageData.userMessage}
            onChangeText={handleSetUserMessage}
            multiline
          />
        </View>
        {/* <ButtonBaseSpecialSave
          label="SEND "
          maxHeight={80}
          onPress={handleSend}
          isDisabled={false}
          fontFamily={"Poppins-Bold"}
          image={require("@/app/assets/shapes/redheadcoffee.png")}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  paddingForElements: {
    paddingHorizontal: "4%",
    flex: 1,
    //backgroundColor: 'pink',
    paddingBottom: "5%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  backColorContainer: {
    height: "96%",
    alignContent: "center",
    //paddingHorizontal: "4%",
    paddingTop: "6%",
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
  selectFriendContainer: {
    width: "100%",
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
  locationDetailsContainer: {
    borderRadius: 8,
    marginVertical: "2%",
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationAddress: {
    fontSize: 16,
  },
  previewContainer: {},
  previewTitle: {
    fontSize: 16,
    marginBottom: "4%",
  },
  textInput: {
    textAlign: "top",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default LocationInviteBody;
