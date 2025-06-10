import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ButtonSignOut from "../buttons/users/ButtonSignOut";
import ButtonDeselect from "./ButtonDeselect";
import ButtonSettings from "../buttons/users/ButtonSettings";
import ButtonFriendAddresses from "../buttons/locations/ButtonFriendAddresses";
import ButtonUser from "../buttons/users/ButtonUser";
import ButtonData from "../buttons/scaffolding/ButtonData";
import AlertConfirm from "../alerts/AlertConfirm";
import { useNavigationState } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; // Import the context hook
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import ButtonInfo from "../buttons/users/ButtonInfo";
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import ButtonFriendProfileCircle from "../buttons/friends/ButtonFriendProfileCircle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import SettingsModal from "./SettingsModal";

export default function HelloFriendFooter() {
  const navigationState = useNavigationState((state) => state);
  const { onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  //themeStyles.footerContainer,

  const footerIconSize = 28;

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
    []
  );

  const RenderDeselectButton = useCallback(
    () => (
      <FooterButtonIconVersion
        confirmationRequired={true}
        confirmationTitle={"Just to be sure"}
        confirmationMessage={"Deselect friend?"}
        // label="Deselect"
        label="Home"
        icon={
          <MaterialCommunityIcons
            // name={"keyboard-backspace"}
            name={"home-outline"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => deselectFriend()}
      />
    ),
    []
  );

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
    []
  );

  const RenderReportIssueButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Report"
        icon={
          <MaterialCommunityIcons
            name={"bug-outline"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setReportModalVisible(true)}
      />
    ),
    []
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
    []
  );

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
        ]}
      >
        {isOnActionPage ? (
          <View style={styles.section}>
            {
              !selectedFriend ? (
                <RenderSignOutButton />
              ) : (
                <RenderDeselectButton />
              )
              // <ButtonDeselect iconSize={footerIconSize}/>
            }
          </View>
        ) : (
          <View style={styles.section}>
            <ButtonData />
          </View>
        )}

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderSettingsButton />
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
            <RenderReportIssueButton />
          </View>
        </>

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderAboutAppButton />
            {/* <ButtonInfo /> */}
          </View>
        </>
      </View>

      {settingsModalVisible && (
        <View>
          <SettingsModal
            isVisible={settingsModalVisible}
            closeModal={() => setSettingsModalVisible(false)}
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

      {reportModalVisible && (
        <View>
          <ReportIssueModal
            isVisible={reportModalVisible}
            closeModal={() => setReportModalVisible(false)}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    height: 90,
    paddingBottom: 20,
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
