import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ButtonSignOut from "../buttons/users/ButtonSignOut";
import ButtonSettings from "../buttons/users/ButtonSettings";
import ButtonFriendAddresses from "../buttons/locations/ButtonFriendAddresses";
import ButtonUser from "../buttons/users/ButtonUser";
import ButtonData from "../buttons/scaffolding/ButtonData";
import AlertConfirm from "../alerts/AlertConfirm";
import { useNavigationState } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; // Import the context hook
import ButtonInfo from "../buttons/users/ButtonInfo";
import ButtonFriendProfileCircle from "../buttons/friends/ButtonFriendProfileCircle";
export default function HelloFriendFooter() {
  const navigationState = useNavigationState((state) => state);
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();

  //themeStyles.footerContainer,

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor },
      ]}
    >
      {isOnActionPage ? (
        <View style={styles.section}>
          <ButtonSignOut
            icon="logout"
            confirmationAlert={true}
            modal={AlertConfirm}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <ButtonData />
        </View>
      )}

      <View style={[styles.divider, themeStyles.divider]} />
      <>
        <View style={styles.section}>
          {isOnActionPage ? <ButtonSettings /> : <ButtonFriendAddresses />}
        </View>
      </>

      
      <View style={[styles.divider, themeStyles.divider]} />
      <>
        <View style={styles.section}>
          <ButtonFriendProfileCircle />
        </View>
      </>

      <View style={[styles.divider, themeStyles.divider]} />
      <>
        <View style={styles.section}>
          <ButtonUser />
        </View>
      </>
      
      <View style={[styles.divider, themeStyles.divider]} />
      <>
        <View style={styles.section}>
          <ButtonInfo />
        </View>
      </>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    height: 60,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
    backgroundColor: "transparent",
  },
});
