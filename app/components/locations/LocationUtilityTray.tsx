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
  userId,
  friendId,
  friendName,
  onAddPress,
  onRemovePress,
  location,
  openEditModal,
  closeEditModal,
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
      handleAddToFaves={onAddPress}
      handleRemoveFromFaves={onRemovePress}
      userId={userId}
      friendId={friendId}
      friendName={friendName}
        location={location}
      
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
      />

      <LocationParking
        location={location}
          openEditModal={openEditModal}
          closeEditModal={closeEditModal}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
      />
      <LocationNotes
        location={location}
                  openEditModal={openEditModal}
          closeEditModal={closeEditModal}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
      />
    </View>
  );
};

export default LocationUtilityTray;
