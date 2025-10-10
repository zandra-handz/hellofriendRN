import React, { useMemo, useEffect } from "react";
import { View, Alert } from "react-native";
import Toggle from "./Toggle";
import manualGradientColors from "@/app/styles/StaticColors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
const SectionAccessibilitySettings = ({ userId, primaryColor, settings }) => {
  const { updateSettingsMutation, updateSettings } = useUpdateSettings({ userId: userId });

  const manualTheme = useMemo(() => {
    if (!settings) return false;
    return settings.manual_dark_mode !== null;
  }, [settings]);


  useEffect(() => {
    if (updateSettingsMutation.isSuccess) {
      showFlashMessage('Success!', false, 1000); // modal covers this, need different approach
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
    updateSettings({ simplify_app_for_focus: !settings.simplify_app_for_focus });
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
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Manual theme"
        icon={
          <MaterialCommunityIcons
            name={"theme-light-dark"}
            size={20}
            color={primaryColor}
          />
        }
        value={manualTheme}
        onPress={toggleManualTheme}
      />
      {manualTheme && (
        <Toggle
          manualGradientColors={manualGradientColors}
          primaryColor={primaryColor}
          label="Light/Dark"
          icon={
            <MaterialIcons
              name={"settings-display"}
              size={20}
              color={primaryColor}
            />
          }
          value={settings.manual_dark_mode === true}
          onPress={updateLightDark}
        />
      )}

      <Toggle
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="High Contrast Mode"
        icon={
          <MaterialCommunityIcons
            name={"text-shadow"}
            size={20}
            color={primaryColor}
          />
        }
        value={settings.high_contrast_mode}
        onPress={updateHighContrastMode}
      />

      <Toggle
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Large Text"
        icon={
          <MaterialIcons name={"text-fields"} size={20} color={primaryColor} />
        }
        value={settings.large_text}
        onPress={updateLargeText}
      />

      <Toggle
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Simplify App For Focus"
        icon={
          <MaterialCommunityIcons
            name={"image-filter-center-focus"}
            size={20}
            color={primaryColor}
          />
        }
        value={settings.simplify_app_for_focus}
        onPress={updateSimplifyAppForFocus}
      />

      <Toggle
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Receive Notifications"
        icon={
          <MaterialCommunityIcons
            name={"bell"}
            size={20}
            color={primaryColor}
          />
        }
        value={settings.receive_notifications}
        onPress={updateReceiveNotifications}
      />

      <Toggle
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        label="Screen Reader"
        icon={
          <MaterialIcons name={"volume-up"} size={20} color={primaryColor} />
        }
        value={settings.screen_reader}
        onPress={toggleScreenReader}
      />
    </View>
  );
};

export default SectionAccessibilitySettings;
