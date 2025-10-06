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
  iconSize,
  openEditModal,
  closeEditModal,
  themeAheadOfLoading,
  primaryColor,
}) => {
  const fadeOpacity = 0.8;

  return (
    <View
      style={{ 
        paddingRight: 4,
        flexDirection: "row",
        width: 88, //EYEBALL
        justifyContent: "space-between",
      }}
    >
      {location?.id && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor: "teal",
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
            compact={true}
            noLabel={true}
          />

          <LocationParking
            location={location}
            openEditModal={openEditModal}
            closeEditModal={closeEditModal}
            iconSize={iconSize}
            fadeOpacity={fadeOpacity}
            primaryColor={primaryColor}
            compact={true}
            noLabel={true} // really only need compact or noLabel, not both, just experimenting rn
          />
          <LocationNotes
            location={location}
            openEditModal={openEditModal}
            closeEditModal={closeEditModal}
            iconSize={iconSize}
            fadeOpacity={fadeOpacity}
            themeAheadOfLoading={themeAheadOfLoading}
            primaryColor={primaryColor}
            compact={true}
            noLabel={true}
          />
        </View>
      )}
    </View>
  );
};

export default LocationUtilityTray;
