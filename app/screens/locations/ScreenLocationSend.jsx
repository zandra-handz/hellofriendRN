import React, { useEffect, useState, useMemo, useCallback } from "react";
import { StyleSheet, Linking, Text, Alert } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useRoute } from "@react-navigation/native";
import LocationInviteBody from "@/app/components/locations/LocationInviteBody";
import { useLocations } from "@/src/context/LocationsContext";
import { useUser } from "@/src/context/UserContext";
import ButtonItemFooterStyle from "@/app/components/headers/ButtonItemFooterStyle";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";

const ScreenLocationSend = () => {
  const route = useRoute();
  const { user } = useUser();
  const location = route.params?.location ?? null;
  const username = route.params?.username ?? "A Hellofriend user";
  const selectedDay = route.params?.selectedDay ?? null;
  const { getCachedAdditionalDetails } = useLocations();
  const { friendDashboardData, selectedFriend } = useSelectedFriend();
  //weekdayTextData is coming from LocationHoursOfOperation component
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const additionalDetails = getCachedAdditionalDetails(location?.id);
const navigation = useNavigation();
  const phoneNumber =
    friendDashboardData[0]?.suggestion_settings?.phone_number || null;

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
          <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
            {messageData.userMessage}{" "}
            <Text style={[{ opacity: 0.5 }]}>
              {selected} hours for {location?.title} are: {messageData.hours}.
              Here are directions: {directionLink}
            </Text>
          </Text>
        );
      }

      return (
        <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
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
      Alert.alert(
        `You haven't set a phone number for ${selectedFriend.name}`,
        `You can set this in ${selectedFriend.name}'s settings to make this faster in the future!`,
        [
                   
          {
            text: "Go back",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
           {
            text: "Settings",
            onPress: () => navigation.navigate('FriendFocus'),
          },
          {
            text: "Send",
            onPress: () =>
              Linking.openURL(
                `sms:$?body=${encodeURIComponent(finalMessageString)}`
              ),
          },
        ]
      );
    }
  };

  const handleDaySelect = (day, hours) => {
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
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <LocationInviteBody
        messageData={messageData}
        finalMessage={FinalMessage}
        handleDaySelect={handleDaySelect}
        handleSetUserMessage={handleSetUserMessage}
        location={location}
        additionalDetails={additionalDetails}
        handleGetDirections={handleGetDirections}
        handleSendText={handleSendText}
        initiallySelectedDay={null}
      />

      <ButtonItemFooterStyle
        onPress={handleSendText}
        previewData={FinalMessage}
      />
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ScreenLocationSend;
