import React, { useState, useMemo, useCallback } from "react";
import { Linking, Text, View, Alert } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useRoute } from "@react-navigation/native";
import LocationInviteBody from "@/app/components/locations/LocationInviteBody";
import Dialog from "react-native-dialog";
import { useUser } from "@/src/context/UserContext";
import ButtonItemFooterStyle from "@/app/components/headers/ButtonItemFooterStyle";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useFetchAdditionalDetails from "@/src/hooks/LocationCalls/useFetchAdditionalDetails";
import AddPhoneNumber from "@/app/components/alerts/AddPhoneNumber";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
const ScreenLocationSend = () => {
  const route = useRoute();
  const { user } = useUser();
  const location = route.params?.location ?? null;
  const username = route.params?.username ?? "A Hellofriend user";
  const selectedDay = route.params?.selectedDay ?? null;
  const { getCurrentDay } = useLocationDetailFunctions();
  const currentDay = getCurrentDay();
  // console.log(`screen location send`, selectedDay);
  const { additionalDetails } = useFetchAdditionalDetails({
    userId: user?.id,
    locationObject: location,
    enabled: true,
  });
  const { selectedFriend } = useSelectedFriend();
  const { friendDash } = useFriendDash();
  //weekdayTextData is coming from LocationHoursOfOperation component
  const { lightDarkTheme } = useLDTheme();

  const { themeAheadOfLoading } = useFriendStyle();
  const phoneNumber = friendDash?.suggestion_settings?.phone_number || null;

  const [messageData, setMessageData] = useState({
    userMessage: `${user.username} has sent you a meet up site from the hellofriend app!`,
    daySelected: selectedDay || "",
    hours: null,
  });

  useMemo(() => {
    if (user && user?.username) {
      setMessageData((prev) => ({
        ...prev,
        userMessage: `${user?.username} has sent you a meet up site from the hellofriend app!`,
      }));
    }
  }, [user]);

  const directionLink = useMemo(() => {
    if (location?.address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
    }
    return null;
  }, [location]);

  const [inputNumberVisible, setInputNumberVisible] = useState(false);
  const handleCloseDialog = () => {
    setInputNumberVisible(false);
  };

  //  change to this if want to always fetch automatically regardless if already cached or not:

  // const {
  //   useFetchAdditionalDetails,
  // } = useLocations();

  // const {
  //   data: additionalDetails,
  //   isLoading,
  //   isError,
  //   error,
  // } = useFetchAdditionalDetails(location, isFetching); //|| locationDetails,

  // also in location view page
  const handleGetDirections = useCallback(() => {
    if (directionLink) {
      Linking.openURL(directionLink);
    }
  }, [location]);

  const FinalMessage = useMemo(
    (style) => {
      let selected;
      if (!messageData.daySelected) {
        selected = `The`;
      } else {
        selected = `On ${messageData.daySelected}, the`;
      }
      if (messageData.hours) {
        return (
          <Text
            style={[
              AppFontStyles.subWelcomeText,
              { color: lightDarkTheme.primaryText },
            ]}
          >
            {messageData.userMessage}{" "}
            <Text style={[{ opacity: 0.5 }]}>
              {selected} hours for {location?.title} are: {messageData.hours}.
              Here are directions: {directionLink}
            </Text>
          </Text>
        );
      }

      return (
        <Text
          style={[
            AppFontStyles.subWelcomeText,
            { color: lightDarkTheme.primaryText },
          ]}
        >
          {messageData.userMessage}{" "}
          <Text style={[{ opacity: 0.5 }]}>
            Here are directions: {directionLink}`;
          </Text>
        </Text>
      );
    },
    [
      messageData,
      messageData.userMessage,
      messageData.hours,
      location,
      directionLink,
    ]
  ); // need to update with just .userMessage too

  const finalMessageString = useMemo(() => {
    let selected = !messageData.daySelected
      ? "The"
      : `On ${messageData.daySelected}, the`;

    if (messageData.hours) {
      return `${messageData.userMessage} ${selected} hours for ${location?.title} are: ${messageData.hours}. Here are directions: ${directionLink}`;
    }

    return `${messageData.userMessage} Here are directions: ${directionLink}`;
  }, [
    messageData,
    messageData.userMessage,
    messageData.hours,
    location,
    directionLink,
  ]);

  const handleSendText = () => {
    if (directionLink && phoneNumber) {
      Linking.openURL(
        `sms:${phoneNumber}?body=${encodeURIComponent(finalMessageString)}`
      );
    }

    if (directionLink && !phoneNumber) {
      setInputNumberVisible(true);

      // Alert.alert(
      //   `You haven't set a phone number for ${selectedFriend.name}`,
      //   `You can set this in ${selectedFriend.name}'s settings to make this faster in the future!`,
      //   [
      //     {
      //       text: "Go back",
      //       onPress: () => console.log("Cancel Pressed"),
      //       style: "cancel",
      //     },

      //     // screen doesn't exist anymore, settings are now in a modal on home screen, should program to open after navigating or provide a new input field here
      //     //  {
      //     //   text: "Settings",
      //     //   onPress: () => navigation.navigate('FriendFocus'),
      //     // },
      //     {
      //       text: "Send",
      //       onPress: () =>
      //         Linking.openURL(
      //           `sms:$?body=${encodeURIComponent(finalMessageString)}`
      //         ),
      //     },
      //   ]
      // );
    }
  };

  const handleDaySelect = (day, hours) => {
    console.log("send screen day select");
    setMessageData((prev) => ({
      ...prev,
      daySelected: day,
      hours: hours,
    }));
  };

  const handleSetUserMessage = (text) => {
    setMessageData((prev) => ({
      ...prev,
      userMessage: text,
    }));
  };

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      {inputNumberVisible && (
        <AddPhoneNumber
        userId={user?.id}
        friendId={selectedFriend?.id}
        isVisible={inputNumberVisible}
        onClose={handleCloseDialog}
        />

      )}
      <LocationInviteBody
        currentDay={currentDay}
        messageData={messageData}
        finalMessage={FinalMessage}
        handleDaySelect={handleDaySelect}
        handleSetUserMessage={handleSetUserMessage}
        location={location}
        additionalDetails={additionalDetails}
        handleGetDirections={handleGetDirections}
        handleSendText={handleSendText}
        initiallySelectedDay={selectedDay}
        themeAheadOfLoading={themeAheadOfLoading}
        welcomeTextStyle={AppFontStyles.welcomeText}
        subWelcomeTextStyle={AppFontStyles.subWelcomeText}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={lightDarkTheme.primaryBackground}
      />

      <ButtonItemFooterStyle
        onPress={handleSendText}
        previewData={FinalMessage}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={lightDarkTheme.primaryBackground}
        welcomeTextStyle={AppFontStyles.welcomeText}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationSend;
