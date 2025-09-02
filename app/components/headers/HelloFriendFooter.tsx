import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Keyboard } from "react-native";

 import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import UserSettingsModal from "./UserSettingsModal.";
// import FriendSettingsModal from "./FriendSettingsModal";
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
//  import { useFriendDash } from "@/src/context/FriendDashContext";
const HelloFriendFooter = ({
  userId,
  username,
 
  friendId,
  friendName, 
 
  lightDarkTheme,  
  overlayColor,
  dividerStyle,  
}) => {
  const { onSignOut } = useSignOut();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
// const { friendDash } = useFriendDash();
  const subWelcomeTextStyle = appFontStyles.subWelcomeText;
  const { themeAheadOfLoading,  resetTheme } =
    useFriendStyle();
const { deselectFriend} = useSelectedFriend();
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  // const [friendSettingsModalVisible, setFriendSettingsModalVisible] =
  //   useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  const primaryColor = lightDarkTheme.primaryText; 
  const primaryBackground = lightDarkTheme.primaryBackground;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleDeselectFriend = () => {
    deselectFriend();
    resetTheme();
  };

  // buttons rendered in callbacks, all using the same template except for the friend profile button
  const RenderSignOutButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
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
            color={primaryColor}
          />
        }
        onPress={() => onSignOut()}
      />
    ),
    [primaryColor]
  );

  const RenderDeselectButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
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
    // console.log("center button toggled!");
    // if (friendId) {
    //   setFriendSettingsModalVisible(true);
    // } else {
      setCategoriesModalVisible((prev) => !prev);
    // }
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
          {!friendId ? <RenderSignOutButton /> : <RenderDeselectButton />}
        </View>
        {/* <View style={styles.section}>
            <ButtonData />
          </View>
       */}

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

      {/* {friendSettingsModalVisible && !!friendId && (
        <View>
          <FriendSettingsModal
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
      )} */}

      {categoriesModalVisible && (
        <View>
          <CategoriesModal
            userId={userId}
            manualGradientColors={manualGradientColors}
            subWelcomeTextStyle={subWelcomeTextStyle}
            primaryColor={primaryColor}
            primaryBackground={primaryBackground}
            lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
            isVisible={categoriesModalVisible}
            isKeyboardVisible={isKeyboardVisible}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setCategoriesModalVisible(false)}
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

export default HelloFriendFooter;
