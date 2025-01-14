import React, { useState, useEffect } from "react";
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
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useFriendList } from "../context/FriendListContext";
import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";

import useLocationFunctions from "../hooks/useLocationFunctions";
import useLocationDetailFunctions from "../hooks/useLocationDetailFunctions";
import { LinearGradient } from "expo-linear-gradient";

import { useQueryClient } from "@tanstack/react-query";

import FriendSelectModalVersionButtonOnly from "../components/FriendSelectModalVersionButtonOnly";

import LocationTitleCard from '../components/LocationTitleCard';
import { useAuthUser } from "../context/AuthUserContext";
import LocationDayAndHrsSelector from "../components/LocationDayAndHrsSelector";

// weekday data passed from LocationHoursOfOperation to ScreenLocationSend to here
const LocationInviteBody = ({
  location,
  weekdayTextData,
  initiallySelectedDay,
}) => {
  const { authUserState } = useAuthUser();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [hoursForDay, setHoursForDay] = useState("");
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  

  const {
    locationList,
    loadingAdditionalDetails,
    useFetchAdditionalDetails,
    clearAdditionalDetails,
    deleteLocationMutation,
  } = useLocationFunctions();

  const { checkIfOpen, getCurrentDay } = useLocationDetailFunctions();
  const [locationDetails, setLocationDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleRefresh = () => {
    setIsFetching(true);
  };

  const {
    data: additionalDetails,
    isLoading,
    isError,
    error,
  } = useFetchAdditionalDetails(location || locationDetails, isFetching);


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

  useEffect(() => {
    const updateFromCache = () => {
      //console.log('checking cache for location data');

      if (locationList && location) {
        //console.log('location object', locationObject);
        const matchedLocation = locationList.find(
          (loc) => loc.id === location.id
        );
        if (matchedLocation) {
          setLocationDetails(matchedLocation);

          //      console.log('cached data for location found: ', matchedLocation);
        } else {
          setLocationDetails(location); //back up if nothing in cache
          //      console.log('no data found in cache for this location');
        }
      }
    };

    updateFromCache();
  }, [location, locationList, queryClient]);

  useEffect(() => {
    setIsFetching(false);
    //console.log(currentDayDrilledTwice);
    if (location == true) {
      clearAdditionalDetails();
    }
  }, [location]);

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

  useEffect(() => {
    if (location && location.address) {
      const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
      setMessage(directionsLink);
      setEditedMessage(
        `${authUserState.user.username} has sent you a meet up site from the hellofriend app!`
      ); // Default message for editing
    } else {
      setMessage("Directions not available.");
      setEditedMessage("Plan details are not available.");
    }
  }, [location]);

  const handleDaySelect = (day, hours) => {
    setSelectedDay(day);
    setHoursForDay(hours);
  };

  const handleSend = () => {
    const finalMessage = `${editedMessage} On ${selectedDay}, ${location?.title} is open ${hoursForDay}. Here are directions: ${message}`;

    Linking.openURL(`sms:?body=${encodeURIComponent(finalMessage)}`);
  };

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, themeStyles.signinContainer]}
    >
          <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
      <>
      <View
          style={{
            width: "100%",

            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.selectFriendContainer, { marginBottom: "2%" }]}>
            {/* <FriendSelectModalVersionButtonOnly
              includeLabel={true}
              width="100%"
            /> */}
          </View>


          <View
            style={[
              styles.backColorContainer,
              themeStyles.genericTextBackground,
              { borderColor: themeAheadOfLoading.lightColor },
            ]}
          >
          {/* <View style={{flex: 1, width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
           */}

       
          <View style={styles.locationDetailsContainer}>
          {!isKeyboardVisible && (
              <>
          <LocationTitleCard location={location} height={110} />
        {!additionalDetails && (
          
            <TouchableOpacity
              onPress={handleRefresh}
              style={themeStyles.genericText}
            >
              <Text style={[themeStyles.genericText, { fontWeight: "bold", paddingVertical: '4%' }]}>
                GET MORE INFO
              </Text>
            </TouchableOpacity>
            
        )}
            
          </>
          )}

            {additionalDetails && additionalDetails.hours && (
              <> 
                <LocationDayAndHrsSelector
                height={'50%'}
                  onDaySelect={handleDaySelect}
                  daysHrsData={additionalDetails?.hours?.weekday_text}
                  initiallySelectedDay={initiallySelectedDay}
                />
              </>
            )}
            <KeyboardAvoidingView>
              <View style={styles.previewContainer}>
                <Text style={[styles.previewTitle, themeStyles.genericText]}>
                  
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    themeStyles.genericText,
                    themeStyles.genericTextBackgroundShadeTwo,
                  ]}
                  value={editedMessage}
                  onChangeText={setEditedMessage}
                  multiline
                />
              </View>
            </KeyboardAvoidingView>
          </View>
          <ButtonBaseSpecialSave
            label="SEND "
            maxHeight={80}
            onPress={handleSend}
            isDisabled={false}
            fontFamily={"Poppins-Bold"}
            image={require("../assets/shapes/redheadcoffee.png")}
          />
        </View>
        </View>
      </>
      </KeyboardAvoidingView>
    </LinearGradient>
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
