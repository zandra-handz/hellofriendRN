import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import UserSettingsModal from "./UserSettingsModal.";
import FriendSettingsModal from "./FriendSettingsModal";
import CategoriesModal from "./CategoriesModal";

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";

import useSignOut from "@/src/hooks/UserCalls/useSignOut";
import FriendProfileButton from "../buttons/friends/FriendProfileButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";

import { useFriendStyle } from "@/src/context/FriendStyleContext";

const HelloFriendFooter = ({
  userCategories,
  manualGradientColors,
  themeAheadOfLoading,
  overlayColor,
  textColor,
  dividerStyle,
  userId,
  friendId,
  friendName,
  friendDash,
}) => {
  const { onSignOut } = useSignOut();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
 
  const { deselectFriend } = useSelectedFriend();
  const { resetTheme } = useFriendStyle();
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [friendSettingsModalVisible, setFriendSettingsModalVisible] =
    useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

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
        primaryColor={textColor}
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
            color={textColor}
          />
        }
        onPress={() => onSignOut()}
      />
    ),
    [textColor]
  );

  const RenderDeselectButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={textColor}
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
            color={textColor}
          />
        }
        onPress={() => handleDeselectFriend()}
      />
    ),
    [textColor]
  );

  const RenderSettingsButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={textColor}
        label="Settings"
        icon={
          <MaterialIcons
            name={"settings-suggest"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={textColor}
          />
        }
        onPress={() => setSettingsModalVisible(true)}
      />
    ),
    [textColor]
  );

  const RenderReportIssueButton = useCallback(
    () => (
      <FooterButtonIconVersion
      primaryColor={textColor}
        label="Report"
        icon={
          <MaterialCommunityIcons
            name={"bug-outline"}
            size={footerIconSize}
            color={textColor}
          />
        }
        onPress={() => setReportModalVisible(true)}
      />
    ),
    [textColor]
  );

  const handleCenterButtonToggle = () => {
    console.log("center button toggled!");
    if (friendId) {
      setFriendSettingsModalVisible(true);
    } else {
      setCategoriesModalVisible((prev) => !prev);
    }
  };

  const RenderFriendProfileButton = useCallback(
    () => (
      <FriendProfileButton
      themeAheadOfLoading={themeAheadOfLoading}
        friendId={friendId}
        friendName={friendName}
        onPress={() => handleCenterButtonToggle()}
      />
    ),
    [themeAheadOfLoading, friendId, friendName]
  );

  const RenderAboutAppButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={textColor}
        label="About"
        icon={
          <MaterialCommunityIcons
            name={"information-outline"}
            size={footerIconSize}
            color={textColor}
          />
        }
        onPress={() => setAboutModalVisible(true)}
      />
    ),
    [textColor]
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
            <RenderFriendProfileButton themeAheadOfLoading={themeAheadOfLoading}/>
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
          />
        </View>
      )}

      {friendSettingsModalVisible && !!friendId && (
        <View>
          <FriendSettingsModal
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

      {categoriesModalVisible && (
        <View>
          <CategoriesModal
          userCategories={userCategories}
          manualGradientColors={manualGradientColors}
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
          />
        </View>
      )}

      {reportModalVisible && (
        <View>
          <ReportIssueModal
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
