import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Linking,
  Keyboard,
  Pressable,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import MultilineInputModal from "../headers/MultilineInputModal";
// import useLocationFunctions from "../hooks/useLocationFunctions"; 

import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
 
import LocationDayAndHrsSelector from "./LocationDayAndHrsSelector";

// weekday data passed from LocationHoursOfOperation to ScreenLocationSend to here
const LocationInviteBody = ({
  messageData, 
  finalMessage,
  handleSetUserMessage,
  handleDaySelect,
  style,
  additionalDetails,
  location,
  handleGetDirections,
 
  initiallySelectedDay,
}) => { 

  const [multilineInputVisible, setMultilineInputVisible] = useState(false);
 

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



  const currentDay = getCurrentDay();

 
  return (
    <>
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
            height: "100%",
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

          {additionalDetails && additionalDetails.hours && messageData && (
            <>
              <LocationDayAndHrsSelector
                height={"34%"}
                currentDay={currentDay}
                onDaySelect={handleDaySelect}
                daysHrsData={additionalDetails?.hours?.weekday_text}
                initiallySelectedDay={initiallySelectedDay}
              />
            </>
          )}
          <Pressable
            onPress={() => setMultilineInputVisible(true)}
            style={{
              flexDirection: "row",
              height: 40,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: themeAheadOfLoading.lightColor,
              width: "100%",
            }}
          ></Pressable>
          {/* <View
            style={[styles.previewContainer]}
          > 
          {finalMessage}
  
          </View> */}
        </View>
      </View>
      {multilineInputVisible && (
        <MultilineInputModal
          isVisible={multilineInputVisible}
          closeModal={() => setMultilineInputVisible(false)}
          value={messageData.userMessage}
          onChangeText={handleSetUserMessage}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
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
  previewContainer: {
     padding: 20, 
     borderRadius: 10,
    width: '100%',
    height: 'auto',
    flex: 1,
    flexShrink: 1,
    marginBottom: 44, // temp to keep above button
  },
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
