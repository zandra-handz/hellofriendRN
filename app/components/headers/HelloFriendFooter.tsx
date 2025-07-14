import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";

// app state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import UserSettingsModal from "./UserSettingsModal.";
import FriendSettingsModal from "./FriendSettingsModal";
import CategoriesModal from "./CategoriesModal";

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";

import ButtonData from "../buttons/scaffolding/ButtonData";
import { useNavigationState } from "@react-navigation/native";

import FriendProfileButton from "../buttons/friends/FriendProfileButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";
import { useFriendList } from "@/src/context/FriendListContext";

const HelloFriendFooter = () => {
  const navigationState = useNavigationState((state) => state);
  const { onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();
const { resetTheme } = useFriendList();
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible ] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [friendSettingsModalVisible, setFriendSettingsModalVisible] =
    useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;


  const handleDeselectFriend = () => {
    deselectFriend();
    resetTheme();
  }

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
        onPress={() => handleDeselectFriend()}
      />
    ),
    [themeStyles]
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
    [themeStyles]
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
    [themeStyles]
  );

const handleCenterButtonToggle = () => {
  if (selectedFriend) {
    setFriendSettingsModalVisible(true)
  } else {
    setCategoriesModalVisible(true);
  }
}
  
  const RenderFriendProfileButton = useCallback(
    () => (

<FriendProfileButton onPress={() => handleCenterButtonToggle()}
      
      />
    ),
    [themeStyles, selectedFriend]
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
        <View style={styles.section}>
          {!selectedFriend ? <RenderSignOutButton /> : <RenderDeselectButton />}
        </View>
        {/* <View style={styles.section}>
            <ButtonData />
          </View>
       */}

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderSettingsButton />
          </View>
        </>

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderFriendProfileButton />
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
          </View>
        </>
      </View>

      {settingsModalVisible && (
        <View>
          <UserSettingsModal
            isVisible={settingsModalVisible}
            closeModal={() => setSettingsModalVisible(false)}
          />
        </View>
      )}

      {friendSettingsModalVisible && !!(selectedFriend) && (
        <View>
          <FriendSettingsModal
            isVisible={friendSettingsModalVisible}
            closeModal={() => setFriendSettingsModalVisible(false)}
          />
        </View>
      )}


      {categoriesModalVisible && (
        <View>
          <CategoriesModal
            isVisible={categoriesModalVisible}
            closeModal={() => setCategoriesModalVisible(false)}
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

export default HelloFriendFooter;
