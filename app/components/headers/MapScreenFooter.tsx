import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// app state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

// app components
import AboutAppModal from "./AboutAppModal";
import UserSettingsModal from "./UserSettingsModal.";

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import ButtonData from "../buttons/scaffolding/ButtonData";
import { useNavigationState } from "@react-navigation/native";
import SetAddressesModal from "./SetAddressesModal";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";
import FilterLocationsModal from "./FilterLocationsModal";

const MapScreenFooter = ({
  userAddress,
  setUserAddress,
  friendAddress,
  setFriendAddress,
}) => {
  const navigationState = useNavigationState((state) => state);
  const { onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [addressesModalVisible, setAddressesModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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
  // buttons rendered in callbacks, all using the same template except for the friend profile button
  const RenderSignOutButton = useCallback(
    () => (
      <FooterButtonIconVersion
        confirmationRequired={true}
        confirmationTitle={"Just to be sure"}
        confirmationMessage={"Sign out?"}
        // label="Deselect"
        label="Sign out"
        icon={
          <MaterialCommunityIcons
            // name={"keyboard-backspace"}
            name={"logout"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => onSignOut()}
      />
    ),
    [themeStyles]
  );

  //   const RenderDeselectButton = useCallback(
  //     () => (
  //       <FooterButtonIconVersion
  //         confirmationRequired={true}
  //         confirmationTitle={"Just to be sure"}
  //         confirmationMessage={"Deselect friend?"}
  //         // label="Deselect"
  //         label="Home"
  //         icon={
  //           <MaterialCommunityIcons
  //             // name={"keyboard-backspace"}
  //             name={"home-outline"}
  //             size={footerIconSize}
  //             color={themeStyles.footerIcon.color}
  //           />
  //         }
  //         onPress={() => deselectFriend()}
  //       />
  //     ),
  //     [themeStyles]
  //   );

  const RenderSettingsButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Settings"
        icon={
          <MaterialIcons
            name={"settings-suggest"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setSettingsModalVisible(true)}
      />
    ),
    [themeStyles]
  );

  const RenderAddressesButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Addresses"
        icon={
          <MaterialIcons
            name={"location-pin"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setAddressesModalVisible(true)}
      />
    ),
    [themeStyles]
  );

  const RenderFilterButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Filter"
        icon={
          <MaterialCommunityIcons
            name={"filter"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={handleTestAlert}
      />
    ),
    [themeStyles]
  );

  const RenderAboutAppButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="About"
        icon={
          <MaterialCommunityIcons
            name={"information-outline"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setAboutModalVisible(true)}
      />
    ),
    [themeStyles]
  );

  return (
    <GradientBackground
      useFriendColors={!!selectedFriend}
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
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
        ]}
      >
        {/* <View style={styles.section}>
          {!selectedFriend ? <RenderSignOutButton /> : <RenderDeselectButton />}
        </View> 

        <View style={[styles.divider, themeStyles.divider]} /> */}
        {/* <>
          <View style={styles.section}>
            <RenderSettingsButton />
          </View>
        </> */}

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderAddressesButton />
          </View>
        </>

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderFilterButton />
          </View>
        </>

        {/* <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderAboutAppButton />
          </View>
        </> */}
      </View>

      {settingsModalVisible && (
        <View>
          <UserSettingsModal
            isVisible={settingsModalVisible}
            closeModal={() => setSettingsModalVisible(false)}
          />
        </View>
      )}

      {addressesModalVisible && (
        <View>
          <SetAddressesModal
            userAddress={userAddress}
            setUserAddress={setUserAddress}
            friendAddress={friendAddress}
            setFriendAddress={setFriendAddress}
            isVisible={addressesModalVisible}
            closeModal={() => setAddressesModalVisible(false)}
          />
        </View>
      )}

      {aboutModalVisible && (
        <View>
          <AboutAppModal
            isVisible={aboutModalVisible}
            closeModal={() => setAboutModalVisible(false)}
          />
        </View>
      )}

      {filterModalVisible && (
        <View>
          <FilterLocationsModal
            isVisible={filterModalVisible}
            closeModal={() => setFilterModalVisible(false)}
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
