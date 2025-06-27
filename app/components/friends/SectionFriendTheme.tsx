import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { useUserSettings } from "@/src/context/UserSettingsContext";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import EditTheme from "../buttons/friends/EditTheme";

const SectionFriendTheme = () => {
  const { settings, updateSettingsMutation, updateNotificationSettings } =
    useUserSettings();
  const { themeStyles } = useGlobalStyle();
  const { friendDashboardData } = useSelectedFriend();
  const [phoneNumber, setPhoneNumber] = useState(
    friendDashboardData[0]?.suggestion_settings?.phone_number || null
  );
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
  const [phoneEditVisible, setPhoneEditVisible] = useState(false);
 
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
      <EditTheme />
    </View>
  );
};

export default SectionFriendTheme;
