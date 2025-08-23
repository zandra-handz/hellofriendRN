import React, {  useMemo } from "react";
import {  View, Alert } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 import { useUser } from "@/src/context/UserContext";
import Toggle from "./Toggle"; 

import { useUserSettings } from "@/src/context/UserSettingsContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
 
const SectionAccessibilitySettings = () => {
  const { user } = useUser();
  const {
    settings,  
 
  } = useUserSettings();

  const { updateSettingsMutation } = useUpdateSettings({userId: user?.id});
  const { themeStyles } = useGlobalStyle(); 

  const manualTheme = useMemo(() => {
    if (!settings) return false;
    return settings.manual_dark_mode !== null;
  }, [settings]); 

  const updateSetting = async (setting) => {
    console.error('update settings in section');
 
    try {
      const newSettings = { ...settings, ...setting };
      await updateSettingsMutation.mutateAsync({
        setting: newSettings,
      }); 
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };
 
  const updateHighContrastMode = () => {
    updateSetting({ high_contrast_mode: !settings.high_contrast_mode });
  };
 
  const updateLargeText = () => {
    updateSetting({ large_text: !settings.large_text });
  };
 
  const updateSimplifyAppForFocus = () => {
    updateSetting({ simplify_app_for_focus: !settings.simplify_app_for_focus });
  };

  const updateReceiveNotifications = () => {
    updateSetting({ receive_notifications: !settings.receive_notifications });
    // updateNotificationSettings({
    //   receive_notifications: !settings.receive_notifications,
    // });
  };

  const toggleManualTheme = () => {
    const newValue = !manualTheme;
    if (newValue === true) {
      updateSetting({ manual_dark_mode: false });
    }
    if (newValue === false) {
      updateSetting({ manual_dark_mode: null });
    }
    //  setManualTheme(newValue);
  };

  const updateLightDark = () => {
    updateSetting({ manual_dark_mode: !settings.manual_dark_mode });
  };

  //Screen reader declares loudly that this button is enabled
  const toggleScreenReader = () => {
Alert.alert(
  'Screen Reader Required',
  'Please enable the screen reader in your device settings to use this feature.',
  [
    {
      text: 'OK',
      style: 'default',
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
        label="Manual theme"
        icon={
          <MaterialCommunityIcons
            name={"theme-light-dark"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        value={manualTheme}
        onPress={toggleManualTheme}
      />
      {manualTheme && (
        <Toggle
          label="Light/Dark"
          icon={
            <MaterialIcons
              name={"settings-display"}
              size={20}
              color={themeStyles.primaryText.color}
            />
          }
          value={settings.manual_dark_mode === true}
          onPress={updateLightDark}
        />
      )}

      <Toggle
        label="High Contrast Mode"
        icon={
          <MaterialCommunityIcons
            name={"text-shadow"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        value={settings.high_contrast_mode}
        onPress={updateHighContrastMode}
      />

      <Toggle
        label="Large Text"
        icon={
          <MaterialIcons
            name={"text-fields"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        value={settings.large_text}
        onPress={updateLargeText}
      />

      <Toggle
        label="Simplify App For Focus"
        icon={
          <MaterialCommunityIcons
            name={"image-filter-center-focus"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        value={settings.simplify_app_for_focus}
        onPress={updateSimplifyAppForFocus}
      />

      <Toggle
       label="Receive Notifications"
        icon={
          <MaterialCommunityIcons
            name={"bell"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        value={settings.receive_notifications}
        onPress={updateReceiveNotifications}
      />

            <Toggle
        label="Screen Reader"
        icon={
          <MaterialIcons
            name={"volume-up"}
            size={20}
            color={themeStyles.primaryText.color}
          />}
        value={settings.screen_reader}
        onPress={toggleScreenReader}
      />
 

 
 
    </View>
  );
};

export default SectionAccessibilitySettings;
