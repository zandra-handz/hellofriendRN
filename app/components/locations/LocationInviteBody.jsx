import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Keyboard, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import MultilineInputModal from "../headers/MultilineInputModal";
// import useLocationFunctions from "../hooks/useLocationFunctions";
import Animated from "react-native-reanimated";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";

import HoursSelector from "./HoursSelector";

// weekday data passed from LocationHoursOfOperation to ScreenLocationSend to here
const LocationInviteBody = ({
  messageData,
  currentDay,
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

  const { themeStyles, appContainerStyles, appSpacingStyles, appFontStyles } =
    useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();

 
  const { checkIfOpen } = useLocationDetailFunctions();
 

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

  return (
    <Animated.View // taken from the ViewPages to match the spacing/style. could add an animation here I suppose
      style={[
        // cardScaleAnimation,
        {
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,
          borderWidth: 0,
          width: "100%",
        },
      ]}
    >
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
              <HoursSelector
                buttonHightlightColor={themeAheadOfLoading.lightColor}
                currentDay={currentDay}
                onDaySelect={handleDaySelect}
                daysHrsData={additionalDetails?.hours?.weekday_text}
                initiallySelectedDay={initiallySelectedDay.index}
              />
            </>
          )}
          <Pressable
            onPress={() => setMultilineInputVisible(true)}
            style={{
              flexDirection: "row",
              height: 'auto',
              borderWidth: StyleSheet.hairlineWidth,
              padding: 10,
              borderRadius: 10,
              borderColor: themeAheadOfLoading.lightColor,
              width: "100%",
              
            }}
          >
            <MaterialCommunityIcons
              name={"pencil"}
              size={appSpacingStyles.modalHeaderIconSize}
              color={themeStyles.footerIcon.color}
              style={{marginRight: 10}}
            />

            <Text
              style={[themeStyles.primaryText, appFontStyles.welcomeText, { fontSize: 20}]}
            >
              Edit message
            </Text>
          </Pressable>
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
    </Animated.View>
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
    width: "100%",
    height: "auto",
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
