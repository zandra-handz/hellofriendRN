import React, { useMemo, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";

import SvgIcon from "@/app/styles/SvgIcons";
import OptionToggle from "../headers/OptionToggle";
import AppModalWithToast from "../alerts/AppModalWithToast";
import {
  FlashMessageData,
  settingsUpdateSuccess,
  settingsUpdateError,
} from "../alerts/AllFlashMessages";

import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import useUserSettings from "@/src/hooks/useUserSettings";
import AddPointsButton from "./AddPointsButton";
import BouncyEntrance from "../headers/BouncyEntrance";
import Reset from "../appwide/button/Reset";
import { AppFontStyles } from "@/app/styles/AppFonts";
import manualGradientColors from "@/app/styles/StaticColors";



interface Props {
  userId: number;
  isVisible: boolean;
  closeModal: () => void;
  textColor: string;
  backgroundColor: string;
  closeButtonColor?: string;
}

const UserSettingsModal: React.FC<Props> = ({
  userId,
  isVisible,
  closeModal,
  textColor,
  backgroundColor,
  closeButtonColor = "red",
}) => {
  const { settings } = useUserSettings();

  const [flashMessage, setFlashMessage] = useState<FlashMessageData | null>(null);

  const { updateSettingsMutation, updateSettings } = useUpdateSettings({ userId });

  useEffect(() => {
    if (updateSettingsMutation.isSuccess) setFlashMessage(settingsUpdateSuccess);
  }, [updateSettingsMutation.isSuccess]);

  useEffect(() => {
    if (updateSettingsMutation.isError) setFlashMessage(settingsUpdateError);
  }, [updateSettingsMutation.isError]);

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const BUTTON_COLOR = manualGradientColors.lightColor;

  const sharedToggleProps = {
    primaryColor: textColor,
    backgroundColor,
    buttonColor: BUTTON_COLOR,
    textStyle: subWelcomeTextStyle,
  };

  const manualTheme = useMemo(() => {
    if (!settings) return false;
    return settings.manual_dark_mode !== null;
  }, [settings]);

  const toggleManualTheme = () => {
    if (!settings) return;
    const newValue = !manualTheme;
    updateSettings({ manual_dark_mode: newValue ? false : null });
  };

  const updateLightDark = () => {
    if (!settings) return;
    updateSettings({ manual_dark_mode: !settings.manual_dark_mode });
  };

  const updateHighContrastMode = () => {
    if (!settings) return;
    updateSettings({ high_contrast_mode: !settings.high_contrast_mode });
  };

  const updateLargeText = () => {
    if (!settings) return;
    updateSettings({ large_text: !settings.large_text });
  };

  const updateSimplifyAppForFocus = () => {
    if (!settings) return;
    updateSettings({ simplify_app_for_focus: !settings.simplify_app_for_focus });
  };

  const updateReceiveNotifications = () => {
    if (!settings) return;
    updateSettings({ receive_notifications: !settings.receive_notifications });
  };

  const toggleScreenReader = () => {
    Alert.alert(
      "Screen Reader Required",
      "Please enable the screen reader in your device settings to use this feature.",
      [{ text: "OK", style: "default" }],
      { cancelable: true },
    );
  };

  const lockInNext = useMemo(() => {
    if (!settings) return false;
    return settings.lock_in_next === true;
  }, [settings]);

  const toggleLockInNext = () => {
    if (!settings) return;
    updateSettings({ lock_in_next: !settings.lock_in_next });
  };

  const speed = 10;
  const baseCount = 8;
  const totalAnimatedItems = baseCount + (manualTheme ? 1 : 0);

  const staggeredDelays = useMemo(
    () => Array.from({ length: totalAnimatedItems }, (_, idx) => idx * speed),
    [totalAnimatedItems],
  );

  if (!settings) {
    return (
      <AppModalWithToast
        primaryColor={textColor}
        backgroundColor={backgroundColor}
        isFullscreen={false}
        modalIsTransparent={false}
        isVisible={isVisible}
        questionText="User settings"
        onClose={closeModal}
        flashMessage={flashMessage}
        setFlashMessage={setFlashMessage}
        useCloseButton={true}
      >
        <View style={{ flex: 1 }} />
      </AppModalWithToast>
    );
  }

  let i = 0;

  return (
    <AppModalWithToast
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      questionText="User settings"
      onClose={closeModal}
      flashMessage={flashMessage}
      setFlashMessage={setFlashMessage}
      useCloseButton={true}
      closeButtonColor={closeButtonColor}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>

          
          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <AddPointsButton
                userId={userId}
                label="Add points"
                icon={<SvgIcon name="timer_sync" size={20} color={textColor} />}
                primaryColor={textColor}
                backgroundColor={backgroundColor}
                buttonColor={manualGradientColors.lightColor}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="Manual theme"
                icon={<SvgIcon name="theme_light_dark" size={20} color={textColor} />}
                value={manualTheme}
                onPress={toggleManualTheme}
              />
            </BouncyEntrance>
          </View>

          {manualTheme && (
            <View style={styles.sectionContainer}>
              <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
                <OptionToggle
                  {...sharedToggleProps}
                  label="Light/Dark"
                  icon={<SvgIcon name="compare" size={20} color={textColor} />}
                  value={settings.manual_dark_mode === true}
                  onPress={updateLightDark}
                />
              </BouncyEntrance>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="High Contrast Mode"
                icon={<SvgIcon name="text_shadow" size={20} color={textColor} />}
                value={settings.high_contrast_mode}
                onPress={updateHighContrastMode}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="Large Text"
                icon={<SvgIcon name="format_font_size_increase" size={20} color={textColor} />}
                value={settings.large_text}
                onPress={updateLargeText}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="Simplify App For Focus"
                icon={<SvgIcon name="image_filter_center_focus" size={20} color={textColor} />}
                value={settings.simplify_app_for_focus}
                onPress={updateSimplifyAppForFocus}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="Receive Notifications"
                icon={<SvgIcon name="bell" size={20} color={textColor} />}
                value={settings.receive_notifications}
                onPress={updateReceiveNotifications}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="Screen Reader"
                icon={<SvgIcon name="volume_high" size={20} color={textColor} />}
                value={settings.screen_reader}
                onPress={toggleScreenReader}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <OptionToggle
                {...sharedToggleProps}
                label="Autoselect Next Friend"
                icon={<SvgIcon name="account" size={20} color={textColor} />}
                value={lockInNext}
                onPress={toggleLockInNext}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Reset
                userId={userId}
                label="Reset all hello dates"
                icon={<SvgIcon name="timer_sync" size={20} color={textColor} />}
                primaryColor={textColor}
                backgroundColor={backgroundColor}
                buttonColor={manualGradientColors.lightColor}
              />
            </BouncyEntrance>
          </View>

        </ScrollView>
      </View>
    </AppModalWithToast>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default UserSettingsModal;