import React, {   useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import { Fontisto } from "@expo/vector-icons";

// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// app components 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import UserSettingsModal from "./UserSettingsModal.";
import FriendSettingsModal from "./FriendSettingsModal";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import FriendThemeModal from "./FriendThemeModal";
import FriendProfileButton from "../buttons/friends/FriendProfileButton";
 
 
import SvgIcon from "@/app/styles/SvgIcons";
import GradientBackground from "../appwide/display/GradientBackground";
 

import { useFriendDash } from "@/src/context/FriendDashContext";
import useUpdateLockins from "@/src/hooks/useUpdateLockins";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { deselectFriendFunction } from "@/src/hooks/deselectFriendFunction";
 
import { useQueryClient } from "@tanstack/react-query";
// import useDeselectFriend from "@/src/hooks/useDeselectFriend";
const SelectedFriendFooter = ({
  userId,

  friendName,

  lightDarkTheme,
  overlayColor,
  dividerStyle,
  themeColors,
 
}) => {
  const { friendDash } = useFriendDash();
  const {  setToFriend, deselectFriend, selectedFriend } = useSelectedFriend();
  const friendId = selectedFriend?.id;

  const { autoSelectFriend } = useAutoSelector();
  const { navigateToFidget } = useAppNavigations();
  const { updateSettings } = useUpdateSettings({ userId: userId });
  const queryClient = useQueryClient();
  const { updateCustomLockIn, updateNextUpLockIn } = useUpdateLockins({
    updateSettings,
  });
 
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [colorsModalVisible, setColorsModalVisible] = useState(false);
 
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
      updateSettings,
      friendId,
      autoSelectFriend,
      setToFriend,
      deselectFriend,
    });
  }, [
    userId,
    queryClient,
    autoSelectFriend,
    updateSettings,
    friendId,
    setToFriend,
    deselectFriend
  ]);

  // const addCheckToDeselect = useCallback(() => {
  //   console.log(`addCheckToDeselect`, upNextId, friendId, lockedInNext);
  //   if (lockedInNext && Number(upNextId) === Number(friendId)) {
  //     Alert.alert("Hi", "Test", [
  //       { text: "OK", onPress: () => handleDeselect() },
  //     ]);
  //   } else {
  //     handleDeselect();
  //   }
  // }, [lockedInNext, upNextId, friendId, handleDeselect]);

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
          <SvgIcon
            // name={"keyboard-backspace"}
            name={"account_arrow_left_outline"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => handleDeselect()}
      />
    ),
    [primaryColor, friendId, autoSelectFriend, queryClient]
  );

  const RenderSettingsButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Settings"
        icon={
          <SvgIcon
            name={"settings_suggest"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
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
          <SvgIcon
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
        themeColors={themeColors} 
        onPress={() => handleCenterButtonToggle()}
      />
    ),
    [themeColors, friendId, friendName]
  );

  const RenderFidgetButton = useCallback(
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
      friendColorDark={themeColors.darkColor}
      friendColorLight={themeColors.lightColor}
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
            <RenderFidgetButton />
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
            themeColors={themeColors} 
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
            themeColors={themeColors} 
            friendId={friendId}
            friendName={friendName}
            friendDash={friendDash}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setColorsModalVisible(false)}
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
