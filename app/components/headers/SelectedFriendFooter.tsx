import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import SvgIcon from "@/app/styles/SvgIcons"; 
import useDeselectFriend from "@/src/hooks/deselectFriendFunction";
import useUserSettings from "@/src/hooks/useUserSettings";

// Lazy load modals
const UserSettingsModal = React.lazy(() => import("./UserSettingsModal."));
const FriendSettingsModal = React.lazy(() => import("./FriendSettingsModal"));
const FriendThemeModal = React.lazy(() => import("./FriendThemeModal"));

const SelectedFriendFooter = ({
  userId,
  friendId,
  friendName,
  lightDarkTheme,
  dividerStyle,
  friendLightColor,
  friendDarkColor,
  handleNavigateToGecko,
}) => {
  const { settings } = useUserSettings({ userId });
  const { handleDeselectFriend } = useDeselectFriend({ userId, settings });
  const { navigateToHome } = useAppNavigations();

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [colorsModalVisible, setColorsModalVisible] = useState(false);
  const [friendSettingsModalVisible, setFriendSettingsModalVisible] = useState(false);

  const footerHeight = 90;
  const footerPaddingBottom = 12;
  const footerIconSize = 24;

  const primaryColor = lightDarkTheme.primaryText;

  const handleDeselect = useCallback(() => {
    handleDeselectFriend();
  }, [handleDeselectFriend]);

  const handleDeselect_withNavigate = useCallback(() => {
    const goHome = handleDeselectFriend();
    if (goHome) {
      navigateToHome();
    }
  }, [handleDeselectFriend, navigateToHome]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: lightDarkTheme.darkerOverlayBackground,
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
          },
        ]}
      >
        <View style={styles.section}>
          <FooterButtonIconVersion
            primaryColor={primaryColor}
            confirmationRequired={true}
            confirmationTitle={"Just to be sure"}
            confirmationMessage={"Deselect friend?"}
            label="Back"
            icon={
              <SvgIcon
                name={"account_arrow_left_outline"}
                size={footerIconSize}
                color={primaryColor}
              />
            }
            onPress={handleDeselect_withNavigate}
          />
        </View>

        <View style={[styles.divider, dividerStyle]} />
        <View style={styles.section}>
          <FooterButtonIconVersion
            primaryColor={primaryColor}
            label="Account"
            icon={
              <SvgIcon
                name={"settings_suggest"}
                size={footerIconSize}
                color={primaryColor}
              />
            }
            onPress={() => setSettingsModalVisible(true)}
          />
        </View>

        <View style={[styles.divider, dividerStyle]} />
        <View style={styles.section}>
          <FooterButtonIconVersion
            primaryColor={primaryColor}
            label="Settings"
            icon={
              <SvgIcon
                name={"tune_variant"}
                size={footerIconSize}
                color={primaryColor}
              />
            }
            onPress={() => setFriendSettingsModalVisible(true)}
          />
        </View>

        <View style={[styles.divider, dividerStyle]} />
        <View style={styles.section}>
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
        </View>

        <View style={[styles.divider, dividerStyle]} />
        <View style={styles.section}>
          <FooterButtonIconVersion
            primaryColor={primaryColor}
            label="Visual"
            icon={
              <View style={{ top: 20, left: 10, overflow: "hidden" }}>
                <SvgIcon
                  name={"gecko_mine"}
                  size={footerIconSize + 130}
                  color={primaryColor}
                />
              </View>
            }
            onPress={handleNavigateToGecko}
          />
        </View>
      </View>

      {settingsModalVisible && (
        <React.Suspense fallback={null}>
          <UserSettingsModal
            userId={userId}
            isVisible={settingsModalVisible}
            bottomSpacer={footerHeight - 30}
            closeModal={() => setSettingsModalVisible(false)}
            textColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.primaryBackground}
          />
        </React.Suspense>
      )}

      {friendSettingsModalVisible && (
        <React.Suspense fallback={null}>
          <FriendSettingsModalWrapper
            userId={userId}
            friendId={friendId}
            friendName={friendName}
            friendLightColor={friendLightColor}
            friendDarkColor={friendDarkColor}
            lightDarkTheme={lightDarkTheme}
            handleDeselectFriend={handleDeselect}
            footerHeight={footerHeight}
            closeModal={() => setFriendSettingsModalVisible(false)}
          />
        </React.Suspense>
      )}

      {colorsModalVisible && (
        <React.Suspense fallback={null}>
          <FriendThemeModalWrapper
            userId={userId}
            friendId={friendId}
            friendName={friendName}
            friendLightColor={friendLightColor}
            friendDarkColor={friendDarkColor}
            lightDarkTheme={lightDarkTheme}
            footerHeight={footerHeight}
            closeModal={() => setColorsModalVisible(false)}
          />
        </React.Suspense>
      )}
    </View>
  );
};

// Wrapper that fetches friendDash only when modal is open
const FriendSettingsModalWrapper = ({
  userId,
  friendId,
  friendName,
  friendLightColor,
  friendDarkColor,
  lightDarkTheme,
  handleDeselectFriend,
  footerHeight,
  closeModal,
}) => {
  const { friendDash } = require("@/src/hooks/useFriendDash").default({ userId, friendId });

  return (
    <FriendSettingsModal
      userId={userId}
      handleDeselectFriend={handleDeselectFriend}
      textColor={lightDarkTheme.primaryText}
      backgroundColor={lightDarkTheme.primaryBackground}
      isVisible={true}
      friendLightColor={friendLightColor}
      friendDarkColor={friendDarkColor}
      friendId={friendId}
      friendName={friendName}
      friendDash={friendDash}
      bottomSpacer={footerHeight - 30}
      closeModal={closeModal}
    />
  );
};

const FriendThemeModalWrapper = ({
  userId,
  friendId,
  friendName,
  friendLightColor,
  friendDarkColor,
  lightDarkTheme,
  footerHeight,
  closeModal,
}) => {
  const { friendDash } = require("@/src/hooks/useFriendDash").default({ userId, friendId });

  return (
    <FriendThemeModal
      userId={userId}
      lightDarkTheme={lightDarkTheme}
      textColor={lightDarkTheme.primaryText}
      backgroundColor={lightDarkTheme.primaryBackground}
      friendLightColor={friendLightColor}
      friendDarkColor={friendDarkColor}
      isVisible={true}
      friendId={friendId}
      friendName={friendName}
      friendDash={friendDash}
      bottomSpacer={footerHeight - 30}
      closeModal={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    borderRadius: 999,
    bottom: 0,
    zIndex: 4,
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