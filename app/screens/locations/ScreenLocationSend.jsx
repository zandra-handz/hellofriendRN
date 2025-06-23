import React, { useMemo, useCallback } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useRoute } from "@react-navigation/native";
import LocationInviteBody from "@/app/components/locations/LocationInviteBody";
import { useLocations } from "@/src/context/LocationsContext";

import ButtonItemFooterStyle from "@/app/components/headers/ButtonItemFooterStyle";
import { Button } from "react-native-paper";

const ScreenLocationSend = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const weekdayTextData = route.params?.weekdayTextData ?? null;
  const selectedDay = route.params?.selectedDay ?? null;
  const { getCachedAdditionalDetails } = useLocations();

  //weekdayTextData is coming from LocationHoursOfOperation component

  const additionalDetails = getCachedAdditionalDetails(location?.id);

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

  const handleSendText = (userMessage, daySelected, hours) => {
    if (directionLink) {
      const finalMessage = `${userMessage} On ${daySelected}, ${location?.title} is open ${hours}. Here are directions: ${directionLink}`;

      Linking.openURL(`sms:?body=${encodeURIComponent(finalMessage)}`);
 
    }
  };

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <LocationInviteBody
        location={location}
        additionalDetails={additionalDetails}
        handleGetDirections={handleGetDirections}
        handleSendText={handleSendText}
        initiallySelectedDay={selectedDay}
      />

      <ButtonItemFooterStyle onPress={() => console.log("hi!")} />
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
