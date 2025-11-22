import React, { useMemo, useEffect } from "react";
import { View, Alert } from "react-native";
import Toggle from "./Toggle";
import manualGradientColors from "@/app/styles/StaticColors";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import SvgIcon from "@/app/styles/SvgIcons";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
const SectionAccessibilitySettings = ({ userId, primaryColor, settings, backgroundColor='red' }) => {
  const { updateSettingsMutation, updateSettings } = useUpdateSettings({
    userId: userId,
  });

  const manualTheme = useMemo(() => {
    if (!settings) return false;
    return settings.manual_dark_mode !== null;
  }, [settings]);

  useEffect(() => {
    if (updateSettingsMutation.isSuccess) {
      showFlashMessage("Success!", false, 1000); // modal covers this, need different approach
    }
  }, [updateSettingsMutation.isSuccess]);

  // const updateSetting = async (setting) => {
  //   console.error("update settings in section");

  //   try {
  //     const newSettings = { ...settings, ...setting };
  //     await updateSettingsMutation.mutateAsync({
  //       setting: newSettings,
  //     });
  //   } catch (error) {
  //     console.error("Error updating user settings:", error);
  //   }
  // };

  const updateHighContrastMode = () => {
    updateSettings({ high_contrast_mode: !settings.high_contrast_mode });
  };

  const updateLargeText = () => {
    updateSettings({ large_text: !settings.large_text });
  };

  const updateSimplifyAppForFocus = () => {
    updateSettings({
      simplify_app_for_focus: !settings.simplify_app_for_focus,
    });
  };

  const updateReceiveNotifications = () => {
    updateSettings({ receive_notifications: !settings.receive_notifications });
    // updateNotificationSettings({
    //   receive_notifications: !settings.receive_notifications,
    // });
  };

  const toggleManualTheme = () => {
    const newValue = !manualTheme;
    if (newValue === true) {
      updateSettings({ manual_dark_mode: false });
    }
    if (newValue === false) {
      updateSettings({ manual_dark_mode: null });
    }
    //  setManualTheme(newValue);
  };

  const updateLightDark = () => {
    updateSettings({ manual_dark_mode: !settings.manual_dark_mode });
  };

  //Screen reader declares loudly that this button is enabled
  const toggleScreenReader = () => {
    Alert.alert(
      "Screen Reader Required",
      "Please enable the screen reader in your device settings to use this feature.",
      [
        {
          text: "OK",
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 0,
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <Toggle
        backgroundColor={backgroundColor}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Manual theme"
        icon={
          <SvgIcon name={"theme_light_dark"} size={20} color={primaryColor} />
        }
        value={manualTheme}
        onPress={toggleManualTheme}
      />
      {manualTheme && (
        <Toggle
          backgroundColor={backgroundColor}
          manualGradientColors={manualGradientColors}
          primaryColor={primaryColor}
          label="Light/Dark"
          icon={<SvgIcon name={"compare"} size={20} color={primaryColor} />}
          value={settings.manual_dark_mode === true}
          onPress={updateLightDark}
        />
      )}

      <Toggle
        backgroundColor={backgroundColor}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="High Contrast Mode"
        icon={<SvgIcon name={"text_shadow"} size={20} color={primaryColor} />}
        value={settings.high_contrast_mode}
        onPress={updateHighContrastMode}
      />

      <Toggle
        backgroundColor={backgroundColor}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Large Text"
        icon={
          <SvgIcon
            name={"format_font_size_increase"}
            size={20}
            color={primaryColor}
          />
        }
        value={settings.large_text}
        onPress={updateLargeText}
      />

      <Toggle
        backgroundColor={backgroundColor}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Simplify App For Focus"
        icon={
          <SvgIcon
            name={"image_filter_center_focus"}
            size={20}
            color={primaryColor}
          />
        }
        value={settings.simplify_app_for_focus}
        onPress={updateSimplifyAppForFocus}
      />

      <Toggle
        backgroundColor={backgroundColor}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Receive Notifications"
        icon={<SvgIcon name={"bell"} size={20} color={primaryColor} />}
        value={settings.receive_notifications}
        onPress={updateReceiveNotifications}
      />

      <Toggle
        backgroundColor={backgroundColor}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Screen Reader"
        icon={<SvgIcon name={"volume_high"} size={20} color={primaryColor} />}
        value={settings.screen_reader}
        onPress={toggleScreenReader}
      />
    </View>
  );
};

export default SectionAccessibilitySettings;
