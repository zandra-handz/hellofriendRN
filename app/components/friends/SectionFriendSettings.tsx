import React, {  useMemo, useState } from "react";
import {  View, Alert  } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
  
import Toggle from "../user/Toggle";

import { useUserSettings } from "@/src/context/UserSettingsContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 import NoToggle from "../user/NoToggle";

 import EditPhone from "../buttons/friends/EditPhone";
 import EditEffort from "../buttons/friends/EditEffort";
 import EditPriority from "../buttons/friends/EditPriority";
 

const SectionFriendSettings = () => {
  const {
    settings,
    updateSettingsMutation,
    updateNotificationSettings,
  } = useUserSettings();
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
  const [ phoneEditVisible, setPhoneEditVisible ] = useState(false);

  const togglePhoneEdit = () => {
    setPhoneEditVisible(!phoneEditVisible);

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
<EditPhone />
      <EditEffort />
      <EditPriority /> 
 
 
    </View>
  );
};

export default SectionFriendSettings;
