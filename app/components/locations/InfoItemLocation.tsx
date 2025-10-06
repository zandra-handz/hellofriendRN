import { View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
import LocationTravelTimes from "./LocationTravelTimes";
import LocationUtilityTray from "./LocationUtilityTray";

import useAddToFaves from "@/src/hooks/FriendLocationCalls/useAddToFaves";
import useRemoveFromFaves from "@/src/hooks/FriendLocationCalls/useRemoveFromFaves";

import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  infoText: string;
  fontSize: number;
  lineHeight: number;
  primaryColor: string;
};

const InfoItemLocation = ({
  userId,
  friendId,
  friendName,
  primaryColor,
  onAddressSettingsPress,
  destinationLocation,
  userLocation,
  friendLocation,
  themeAheadOfLoading,
  onLocationDetailsPress,
  onCloseLocationDetails,
  children,
}: Props) => { 

  const { handleAddToFaves, addToFavesMutation } = useAddToFaves({
    userId: userId,
    friendId: friendId,
  });
  const { handleRemoveFromFaves, removeFromFavesMutation } = useRemoveFromFaves(
    {
      userId: userId,
      friendId: friendId,
    }
  );

  const onAddPress = () => {
    if (!destinationLocation?.id) {
      return;
    }

    showFlashMessage(`Location added ${friendName}'s faves`, false, 1000);
    handleAddToFaves({ locationId: destinationLocation.id });
  };

  const onRemovePress = () => {
    if (!destinationLocation?.id) {
      return;
    }
    showFlashMessage(
      `Location removed from ${friendName}'s faves`,
      false,
      1000
    );
    handleRemoveFromFaves({ locationId: destinationLocation.id });
  };

  useEffect(() => {
    if (addToFavesMutation.isError) {
      showFlashMessage("Oops! Location not added", true, 1000);
    }
  }, [addToFavesMutation?.isError]);

  useEffect(() => {
    if (removeFromFavesMutation.isError) {
      showFlashMessage("Oops! Location not removed", true, 1000);
    }
  }, [removeFromFavesMutation?.isError]);

  const ICON_SIZE = 18;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row",   minWidth: 80 }}>
        <GlobalPressable
          onPress={onAddressSettingsPress}
          style={styles.addressesButton}
        >
          <MaterialIcons
            name={"edit-location"}
            size={ICON_SIZE}
            color={primaryColor}
          />
          <MaterialIcons
            name={"edit-location"}
            size={ICON_SIZE}
            color={primaryColor}
          />
        </GlobalPressable>

        <View style={{marginLeft: 6}}>
          <LocationTravelTimes
            iconSize={ICON_SIZE}
            location={destinationLocation}
            userAddress={userLocation}
            friendAddress={friendLocation}
            themeAheadOfLoading={themeAheadOfLoading}
            primaryColor={primaryColor}
          />
        </View>
      </View>

      <View style={{ minWidth: 80 }}>
        <LocationUtilityTray
          themeAheadOfLoading={themeAheadOfLoading}
          primaryColor={primaryColor}
          onAddPress={onAddPress}
          onRemovePress={onRemovePress}
          iconSize={ICON_SIZE}
          userId={userId}
          friendId={friendId}
          friendName={friendName}
          location={destinationLocation}
          openEditModal={onLocationDetailsPress}
          closeEditModal={onCloseLocationDetails}
        />
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: "auto",
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  addressesButton: {
    width: "auto",
    flexDirection: "row",
    flexShrink: 1, 
  },
});

export default InfoItemLocation;
