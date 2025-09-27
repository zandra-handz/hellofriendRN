import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { Fontisto } from "@expo/vector-icons";

// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// app components
import AboutAppModal from "./AboutAppModal";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import UserSettingsModal from "./UserSettingsModal.";
import FriendSettingsModal from "./FriendSettingsModal";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import FriendThemeModal from "./FriendThemeModal";
import FriendProfileButton from "../buttons/friends/FriendProfileButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";
import manualGradientColors from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import { useFriendDash } from "@/src/context/FriendDashContext";
import useUpdateLockins from "@/src/hooks/useUpdateLockins";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { deselectFriendFunction } from "@/src/hooks/deselectFriendFunction";
import useDeselectFriend from "@/src/hooks/useDeselectFriend";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import { useFriendStyle } from "@/src/context/FriendStyleContext";

import { useQueryClient } from "@tanstack/react-query";
// import useDeselectFriend from "@/src/hooks/useDeselectFriend";
const SelectedFriendFooter = ({
  userId,
  upNextId,
  autoSelectId,
  lockedInNext,
settings,
  friendId,
  friendName,

  lightDarkTheme,
  overlayColor,
  dividerStyle,
  friendList,
  // resetTheme,
  // themeAheadOfLoading,
}) => {
  const { friendDash } = useFriendDash();
  const { selectFriend } = useSelectedFriend();
  const { navigateToFidget } = useAppNavigations();
  const { updateSettings } = useUpdateSettings({ userId: userId });
  const queryClient = useQueryClient();
  const { updateCustomLockIn, updateNextUpLockIn } = useUpdateLockins({
    updateSettings,
  });
  // const { selectFriend } = useSelectedFriend();
  // const { handleDeselectFriend} = useDeselectFriend({resetTheme, selectFriend});
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [colorsModalVisible, setColorsModalVisible] = useState(false);
  const { themeAheadOfLoading, getThemeAheadOfLoading, resetTheme } =
    useFriendStyle();
  const [friendSettingsModalVisible, setFriendSettingsModalVisible] =
    useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  const primaryColor = lightDarkTheme.primaryText;

  // console.log(`SELECTED FRIEND FOOTER RERENDERED: `, upNextId, friendId);

  const handleDeselect = useCallback(() => {




    deselectFriendFunction({
      userId,
      queryClient,
     settings,
      updateSettings,
      friendId,
      upNextId,
      autoSelectId,
      friendList,
      selectFriend,
      resetTheme,
      getThemeAheadOfLoading,
    });
  }, [
    userId,
    queryClient,
    settings,
    updateSettings,
    friendId,
    upNextId,
    autoSelectId,
    friendList,
    selectFriend,
    resetTheme,
    getThemeAheadOfLoading,
  ]);

  const addCheckToDeselect = useCallback(() => {
    console.log(`addCheckToDeselect`, upNextId, friendId, lockedInNext);
    if (lockedInNext && Number(upNextId) === Number(friendId)) {
      Alert.alert("Hi", "Test", [
        { text: "OK", onPress: () => handleDeselect() },
      ]);
    } else {
      handleDeselect();
    }
  }, [lockedInNext, upNextId, friendId, handleDeselect]);

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
        onPress={() => handleDeselect()}
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
  const RenderColorThemeButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Colors"
        icon={
          <MaterialCommunityIcons
            name={"palette"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setColorsModalVisible(true)}
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
        label="Visual"
        icon={
          <Fontisto
            name={"spinner-fidget"}
            name={"heartbeat-alt"}
            // name={"heartbeat"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        // onPress={() => setAboutModalVisible(true)}
        onPress={navigateToFidget}
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
            <RenderColorThemeButton />
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
            handleDeselectFriend={handleDeselect}
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

      {colorsModalVisible && !!friendId && (
        <View>
          <FriendThemeModal
            userId={userId}
            lightDarkTheme={lightDarkTheme}
            userId={userId}
            isVisible={colorsModalVisible}
            themeAheadOfLoading={themeAheadOfLoading}
            friendId={friendId}
            friendName={friendName}
            friendDash={friendDash}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setColorsModalVisible(false)}
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

export default React.memo(SelectedFriendFooter);
