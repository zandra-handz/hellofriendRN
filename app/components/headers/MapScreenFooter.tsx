import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
 
 
 
// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import SetAddressesModal from "./SetAddressesModal";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";

const MapScreenFooter = ({
  userAddress,
  setUserAddress,
  friendAddress,
  setFriendAddress,
  themeAheadOfLoading,
  manualGradientColors,
    overlayColor,
    primaryColor,
 
  dividerStyle,
 
  friendId,
  welcomeTextStyle,
}) => {  
 
  const [addressesModalVisible, setAddressesModalVisible] = useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  useFocusEffect(
    useCallback(() => {
      console.log(userAddress?.address);
      console.log(friendAddress?.address);
      if (
        userAddress?.address === "No address selected" ||
        friendAddress?.address === "No address selected"
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
              onPress: () => setAddressesModalVisible(true),
            },
          ]
        );
      }
    }, [userAddress.address, friendAddress.address])
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
        onPress={() => setAddressesModalVisible(true)}
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
      endColor={manualGradientColors.darkColor}
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
 

      {addressesModalVisible && (
        <View>
          <SetAddressesModal
          primaryColor={primaryColor}
          overlayColor={overlayColor}
          welcomeTextStyle={welcomeTextStyle}
            userAddress={userAddress}
            setUserAddress={setUserAddress}
            friendAddress={friendAddress}
            setFriendAddress={setFriendAddress}
            isVisible={addressesModalVisible}
            closeModal={() => setAddressesModalVisible(false)}
          />
        </View>
      )}

 
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
