import { View } from "react-native";
import React from "react";
import { Location } from "@/src/types/LocationTypes";
import LocationSavingActions from "./LocationSavingActions";
import LocationParking from "./LocationParking";
import LocationNotes from "./LocationNotes";
import useDeleteLocation from "@/src/hooks/LocationCalls/useDeleteLocation";
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
  themeAheadOfLoading,
  primaryColor,
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
        themeAheadOfLoading={themeAheadOfLoading}
        primaryColor={primaryColor}
      />

      <LocationParking
        location={location}
        openEditModal={openEditModal}
        closeEditModal={closeEditModal}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
        primaryColor={primaryColor}
      />
      <LocationNotes
        location={location}
        openEditModal={openEditModal}
        closeEditModal={closeEditModal}
        iconSize={iconSize}
        fadeOpacity={fadeOpacity}
            themeAheadOfLoading={themeAheadOfLoading}
          primaryColor={primaryColor}
      />
    </View>
  );
};

export default LocationUtilityTray;
