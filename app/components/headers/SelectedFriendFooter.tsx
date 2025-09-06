import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Keyboard } from "react-native";

 import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import UserSettingsModal from "./UserSettingsModal.";
import FriendSettingsModal from "./FriendSettingsModal";
import CategoriesModal from "./CategoriesModal";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";

import useSignOut from "@/src/hooks/UserCalls/useSignOut";
import FriendProfileButton from "../buttons/friends/FriendProfileButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";
 import { manualGradientColors } from "@/src/hooks/StaticColors";
 import { appFontStyles } from "@/src/hooks/StaticFonts";
 import { useFriendDash } from "@/src/context/FriendDashContext";
const SelectedFriendFooter = ({
  userId,
  username,
 
  friendId,
  friendName, 
 
  lightDarkTheme,  
  overlayColor,
  dividerStyle,  
}) => {
 
const { friendDash } = useFriendDash();
  const subWelcomeTextStyle = appFontStyles.subWelcomeText;
  const { themeAheadOfLoading,  resetTheme } =
    useFriendStyle();
const { deselectFriend} = useSelectedFriend();
  const [aboutModalVisible, setAboutModalVisible] = useState(false); 
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [friendSettingsModalVisible, setFriendSettingsModalVisible] =
    useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  const primaryColor = lightDarkTheme.primaryText;  
 

  const handleDeselectFriend = () => {
    deselectFriend();
    resetTheme();
  };

 

  const RenderDeselectButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        confirmationRequired={true}
        confirmationTitle={"Just to be sure"}
        confirmationMessage={"Deselect friend?"}
        // label="Deselect"
        label="Back"
        icon={
          <MaterialCommunityIcons
            // name={"keyboard-backspace"}
            name={"account-arrow-left-outline"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => handleDeselectFriend()}
      />
    ),
    [primaryColor]
  );

  const RenderSettingsButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Settings"
        icon={
          <MaterialIcons
            name={"settings-suggest"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setSettingsModalVisible(true)}
      />
    ),
    [primaryColor]
  );

  const RenderReportIssueButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Report"
        icon={
          <MaterialCommunityIcons
            name={"bug-outline"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setReportModalVisible(true)}
      />
    ),
    [primaryColor]
  );

  const handleCenterButtonToggle = () => {
  
      setFriendSettingsModalVisible(true);
   
  };

  const RenderFriendProfileButton = useCallback(
    () => (
      <FriendProfileButton
              friendId={friendId}
        friendName={friendName}
       primaryColor={primaryColor}
        themeAheadOfLoading={themeAheadOfLoading}
        manualGradientColors={manualGradientColors}

        onPress={() => handleCenterButtonToggle()}
      />
    ),
    [themeAheadOfLoading, friendId, friendName]
  );

  const RenderAboutAppButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="About"
        icon={
          <MaterialCommunityIcons
            name={"information-outline"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setAboutModalVisible(true)}
      />
    ),
    [primaryColor]
  );

  return (
    <GradientBackground
      useFriendColors={!!friendId}
      startColor={manualGradientColors.lightColor}
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
        <View style={styles.section}>
        <RenderDeselectButton />
        </View>
 
        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderSettingsButton />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderFriendProfileButton
              themeAheadOfLoading={themeAheadOfLoading}
            />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderReportIssueButton />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderAboutAppButton />
          </View>
        </>
      </View>

      {settingsModalVisible && userId && (
        <View>
          <UserSettingsModal
            userId={userId}
        
            isVisible={settingsModalVisible}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setSettingsModalVisible(false)}
            lightDarkTheme={lightDarkTheme}
            manualGradientColors={manualGradientColors}
          />
        </View>
      )}

      {friendSettingsModalVisible && !!friendId && (
        <View>
          <FriendSettingsModal
          userId={userId}
          deselectFriend={deselectFriend}
            manualGradientColors={manualGradientColors}
            lightDarkTheme={lightDarkTheme}
            userId={userId}
            isVisible={friendSettingsModalVisible}
            themeAheadOfLoading={themeAheadOfLoading}
            friendId={friendId}
            friendName={friendName}
            friendDash={friendDash} 
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setFriendSettingsModalVisible(false)}
          />
        </View>
      )}

 
      {aboutModalVisible && (
        <View>
          <AboutAppModal
            isVisible={aboutModalVisible}
            closeModal={() => setAboutModalVisible(false)}
            bottomSpacer={footerHeight - 30} //for safe view
            primaryColor={primaryColor}
          />
        </View>
      )}

      {reportModalVisible && (
        <View>
          <ReportIssueModal
            username={username}
            primaryColor={primaryColor}
            subWelcomeTextStyle={subWelcomeTextStyle}
            manualGradientColors={manualGradientColors}
            isVisible={reportModalVisible}
            bottomSpacer={footerHeight - 30} //for safe view
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

export default SelectedFriendFooter;
