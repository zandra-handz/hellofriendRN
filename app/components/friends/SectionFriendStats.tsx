import React, {  useMemo } from "react";
import {  View, Alert } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
  
import Toggle from "../user/Toggle";

import { useUserSettings } from "@/src/context/UserSettingsContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 import NoToggle from "../user/NoToggle";

const SectionFriendStats = () => {
  const {
    settings,
    updateSettingsMutation,
    updateNotificationSettings,
  } = useUserSettings();
  const { themeStyles } = useGlobalStyle(); 
const { friendDashboardData } = useSelectedFriend();
  const manualTheme = useMemo(() => {
    if (!settings) return false;
    return settings.manual_dark_mode !== null;
  }, [settings]); 

  const updateSetting = async (setting) => {
    try {
      const newSettings = { ...settings, ...setting };
      await updateSettingsMutation.mutateAsync({
        setting: newSettings,
      }); 
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
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

 // .days_since_words && .time_Score
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
      <NoToggle
        label={friendDashboardData[0].days_since_words}
        icon={
          <MaterialCommunityIcons
            name={"timer"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => {}}
      />

      <NoToggle
        label={friendDashboardData[0].time_score}
        icon={
          <MaterialCommunityIcons
            name={"heart"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => {}}
      />

{/*  
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
      /> */}
      {/* {manualTheme && (
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
 
  */}
 
    </View>
  );
};

export default SectionFriendStats;
