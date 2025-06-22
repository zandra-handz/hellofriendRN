import React from "react";
import { StyleSheet } from "react-native"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useRoute } from "@react-navigation/native";
import LocationInviteBody from "@/app/components/locations/LocationInviteBody";
 import { useLocations } from "@/src/context/LocationsContext";
const ScreenLocationSend = () => {
 
  const route = useRoute();
  const location = route.params?.location ?? null;
  const weekdayTextData = route.params?.weekdayTextData ?? null;
  const selectedDay = route.params?.selectedDay ?? null;
const { getCachedAdditionalDetails } = useLocations();
 

  //weekdayTextData is coming from LocationHoursOfOperation component
 

const additionalDetails = getCachedAdditionalDetails(location?.id);

  return (
    <SafeViewAndGradientBackground style={{flex: 1}}>
      
      <LocationInviteBody
        location={location}
        weekdayTextData={additionalDetails?.hours?.weekday_text}
        initiallySelectedDay={selectedDay}
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
