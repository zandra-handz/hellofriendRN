
import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming, SharedValue } from "react-native-reanimated";

import FooterButtonIconVersion from "./FooterButtonIconVersion";
import SvgIcon from "@/app/styles/SvgIcons";
import useDeselectFriend from "@/src/hooks/useDeselectFriend";
import useUserSettings from "@/src/hooks/useUserSettings";
import UserSettingsModal from "./UserSettingsModal.";
import FriendSettingsModal from "./FriendSettingsModal";
import FriendThemeModal from "./FriendThemeModal";
import { LDTheme } from "@/src/types/LDThemeTypes";
import GeckoFooterButton from "./GeckoFooterButton";

type Props = {
  userId: number;
  friendId: number;
  friendName: string;
  lightDarkTheme: LDTheme;
  friendLightColor: string;
  friendDarkColor: string;
  handleNavigateToGecko: () => void;
  hiddenValue?: SharedValue<boolean>;
};

const SelectedFriendFooter = ({
  userId,
  friendId,
  friendName,
  lightDarkTheme,
  friendLightColor,
  friendDarkColor,
  handleNavigateToGecko,
  hiddenValue,
}: Props) => {
  const { settings } = useUserSettings({ userId });

  const { handleDeselectFriend } = useDeselectFriend({ userId, settings });
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
    handleDeselectFriend();
  }, [handleDeselectFriend]);

  const hiddenStyle = useAnimatedStyle(() => {
    if (!hiddenValue) return {};
    return {
      opacity: withTiming(hiddenValue.value ? 0 : 1, { duration: 200 }),
      pointerEvents: hiddenValue.value ? "none" : "auto",
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: lightDarkTheme.darkerOverlayBackground,
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
        hiddenStyle,
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

        <View style={styles.sectionColorTheme}>
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

        <View style={styles.section}>
          <GeckoFooterButton
            userId={userId}
            friendId={friendId}
            friendName={friendName}
            primaryColor={primaryColor}
            size={footerIconSize + 130}
            onPress={handleNavigateToGecko}
          />
        </View>
      </View>

      {settingsModalVisible && (
        <UserSettingsModal
          userId={userId}
          isVisible={true}
          bottomSpacer={footerHeight - 30}
          closeModal={() => setSettingsModalVisible(false)}
          textColor={lightDarkTheme.primaryText}
          backgroundColor={lightDarkTheme.primaryBackground}
        />
      )}

      {friendSettingsModalVisible && (
        <FriendSettingsModal
          userId={userId}
          handleDeselectFriend={handleDeselect}
          textColor={lightDarkTheme.primaryText}
          backgroundColor={lightDarkTheme.primaryBackground}
          isVisible={true}
          friendLightColor={friendLightColor}
          friendDarkColor={friendDarkColor}
          friendId={friendId}
          friendName={friendName}
          bottomSpacer={footerHeight - 30}
          closeModal={() => setFriendSettingsModalVisible(false)}
        />
      )}

      {colorsModalVisible && (
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
          bottomSpacer={footerHeight - 30}
          closeModal={() => setColorsModalVisible(false)}
        />
      )}
    </Animated.View>
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
  sectionColorTheme: {
    zIndex: 5,
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