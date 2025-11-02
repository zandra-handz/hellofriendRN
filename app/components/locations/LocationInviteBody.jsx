import React, { useState  } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import MultilineInputModal from "../headers/MultilineInputModal"; 
import Animated from "react-native-reanimated";
// import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";

import HoursSelector from "./HoursSelector";

// weekday data passed from LocationHoursOfOperation to ScreenLocationSend to here
const LocationInviteBody = ({
  messageData,
  currentDay, 
  handleSetUserMessage,
  handleDaySelect,
 themeColors,
  additionalDetails,
  location,
  handleGetDirections,

  initiallySelectedDay, 
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryColor,
  primaryBackground,
}) => {
  const [multilineInputVisible, setMultilineInputVisible] = useState(false);

 
  // const { checkIfOpen } = useLocationDetailFunctions();
 

  // const renderOpenStatus = (data) => {
  //   let isOpenNow;
  //   isOpenNow = checkIfOpen(data);

  //   return (
  //     <View
  //       style={[
  //         {
  //           marginRight: "2%",
  //           borderWidth: 2,
  //           borderColor: isOpenNow
  //             ? `lightgreen`
  //             : isOpenNow === false
  //               ? `red`
  //               : "transparent",
  //           backgroundColor:
  //             themeStyles.genericTextBackgroundShadeTwo.backgroundColor,

  //           width: "auto",
  //           paddingHorizontal: "3%",
  //           paddingVertical: "1%",
  //           borderRadius: 20,
  //         },
  //       ]}
  //     >
  //       <Text
  //         style={[
  //           themeStyles.genericText,
  //           {
  //             fontSize: 12,
  //             fontWeight: "bold",
  //           },
  //         ]}
  //       >
  //         {isOpenNow ? `Open` : isOpenNow === false ? `Closed` : ""}
  //       </Text>
  //     </View>
  //   );
  // };

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
          styles.talkingPointCard,
          {
            backgroundColor: primaryBackground,
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
              welcomeTextStyle,
              { color: primaryColor, flexDirection: "row", width: "90%", flexWrap: "wrap" },
            ]}
          >
            {location.title}
          </Text>
          <Text
            numberOfLines={1}
            onPress={handleGetDirections}
            style={[ 
             subWelcomeTextStyle,
              { color: primaryColor, flexDirection: "row", width: "90%", flexWrap: "wrap" },
            ]}
          >
            {" "}
            {location.address}
          </Text>

          {additionalDetails && additionalDetails.hours && messageData && (
            <>
              <HoursSelector
                buttonHightlightColor={themeColor.lightColor}
                currentDay={currentDay}
                onDaySelect={handleDaySelect}
                daysHrsData={additionalDetails?.hours?.weekday_text}
                initiallySelectedDay={initiallySelectedDay.index}
                welcomeTextStyle={welcomeTextStyle}
                primaryColor={primaryColor}
                primaryBackground={primaryBackground}
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
              borderColor: themeColors.lightColor,
              width: "100%",
              
            }}
          >
            <MaterialCommunityIcons
              name={"pencil"}
              size={30}
              color={primaryColor}
              style={{marginRight: 10}}
            />

            <Text
              style={[ welcomeTextStyle, { color: primaryColor, fontSize: 20}]}
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
          primaryColor={primaryColor}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  talkingPointCard: { // not actually using for large talking point anymore
    // used with: backgroundColor: themeStyles.primaryBackground.backgroundColor,
    padding: 20,
    borderRadius: 40,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
});

export default LocationInviteBody;
