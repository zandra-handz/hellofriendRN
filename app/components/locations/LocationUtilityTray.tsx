import { View } from "react-native";
import React from "react";
import { Location } from "@/src/types/LocationTypes";
import LocationSavingActions from "./LocationSavingActions";
import LocationParking from "./LocationParking";
import LocationNotes from "./LocationNotes"; 

interface LocationUtilityTrayProps {
  location: Location;
}

const LocationUtilityTray: React.FC<LocationUtilityTrayProps> = ({
  location,
}) => {
  const iconSize = 26;
  const fadeOpacity = 0.8; 

  return (
    <View
      style={{
        paddingVertical: 10,
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between",
      }}
    >
      <LocationSavingActions
        location={location}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
      />

      <LocationParking
        location={location}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
      />
      <LocationNotes
        location={location}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
      />
    </View>
  );
};

export default LocationUtilityTray;
