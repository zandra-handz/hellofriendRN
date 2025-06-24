import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useRoute } from "@react-navigation/native";
import LocationInviteBody from "@/app/components/locations/LocationInviteBody";
import { useLocations } from "@/src/context/LocationsContext";
import { useUser } from "@/src/context/UserContext";
import ButtonItemFooterStyle from "@/app/components/headers/ButtonItemFooterStyle";
import { Button } from "react-native-paper";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

const ScreenLocationSend = () => {
  const route = useRoute();
  const { user } = useUser();
  const location = route.params?.location ?? null;
  const weekdayTextData = route.params?.weekdayTextData ?? null;
  const selectedDay = route.params?.selectedDay ?? null;
  const { getCachedAdditionalDetails } = useLocations();
const { friendDashboardData } = useSelectedFriend();
  //weekdayTextData is coming from LocationHoursOfOperation component

  const additionalDetails = getCachedAdditionalDetails(location?.id);


  const phoneNumber = friendDashboardData[0]?.suggestion_settings?.phone_number || '';

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


  const [messageData, setMessageData ]= useState({ userMessage: `${user.username} has sent you a meet up site from the hellofriend app!`,
    daySelected: selectedDay || '',
    hours: ''});

  const handleSendText = () => {
       console.log('handleGetDirections pressed');
       console.log(messageData.userMessage);
       console.log(messageData.daySelected);
    if (directionLink) { 
      const finalMessage = `${messageData.userMessage} On ${messageData.daySelected}, ${location?.title} is open ${messageData.hours}. Here are directions: ${directionLink}`;

      Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(finalMessage)}`);
 
 
    }
  };

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <LocationInviteBody
      messageData={messageData}
      setMessageData={setMessageData}
        location={location}
        additionalDetails={additionalDetails}
        handleGetDirections={handleGetDirections}
        handleSendText={handleSendText}
        initiallySelectedDay={selectedDay}
      />

      <ButtonItemFooterStyle onPress={handleSendText} />
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
