import React, { useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
// import AddressesModal from "./AddressesModal";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";
// import manualGradientColors  from "@/src/hooks/StaticColors";

const MapScreenFooter = ({
  userAddress,
  friendAddress,
  themeAheadOfLoading,
  overlayColor,
  primaryColor,

  dividerStyle,
  userId,
  friendId,
  friendName,
  openAddresses,
}) => {
  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  const { userAddresses } = useStartingUserAddresses({ userId: userId });
  const { friendAddresses } = useStartingFriendAddresses({
    userId: userId,
    friendId: friendId,
  });

  useFocusEffect(
    useCallback(() => {
      // console.log(userAddress?.address);
      // console.log(friendAddress?.address);
      if (
        userAddresses?.chosen?.address === "No address selected" ||
        friendAddresses?.chosen?.address === "No address selected"
      ) {
        Alert.alert(
          "Warning!",
          `Some features will not be available to you unless both addresses are set.`,
          [
            {
              text: "Got it",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Open address settings",
              onPress: () => openAddresses(),
            },
          ]
        );
      }
    }, [userAddress?.address, friendAddress?.address])
  );

  const handleTestAlert = () => {
    console.log("removed");
  };

  const RenderAddressesButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Addresses"
        icon={
          <MaterialIcons
            name={"location-pin"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => openAddresses()}
      />
    ),
    [primaryColor]
  );

  const RenderFilterButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Filter"
        icon={
          <MaterialCommunityIcons
            name={"filter"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={handleTestAlert}
      />
    ),
    [primaryColor]
  );

  return (
    <GradientBackground
      useFriendColors={!!friendId}
      // startColor={manualGradientColors.lightColor}
      // endColor={manualGradientColors.darkColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      additionalStyles={[
        styles.container,
        {
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            backgroundColor: overlayColor,
          },
        ]}
      >
        <>
          <View style={styles.section}>
            <RenderAddressesButton />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderFilterButton />
          </View>
        </>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 50000,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default MapScreenFooter;
