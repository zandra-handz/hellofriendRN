import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Reset from "../appwide/button/Reset";
import Toggle from "../user/Toggle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";

const SectionFriendManagerSettings = ({
  userId,
  settings,
  primaryColor,
  manualGradientColors,
}) => {
  const { updateSettings, updateSettingsMutation } = useUpdateSettings({
    userId: userId,
  });

  const toggleLockInNext = () => {
    updateSettings({ lock_in_next: !settings.lock_in_next });
  };

    const lockInNext = useMemo(() => {
      if (!settings) return false;
      return settings.lock_in_next == true;
    }, [settings]);

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
        primaryColor={primaryColor}
        label="Autoselect Next Friend"
        icon={
          <MaterialCommunityIcons
            name={"account"}
            size={20}
            color={primaryColor}
          />
        }
        value={lockInNext}
        onPress={toggleLockInNext}
      />

      <Reset
        userId={userId}
        label="Reset all hello dates"
        icon={
          <MaterialCommunityIcons
            name={"timer"}
            size={20}
            color={primaryColor}
          />
        }
        primaryColor={primaryColor}
        manualGradientColors={manualGradientColors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 0, // changed this from ModalColorTheme
    width: "100%",
    alignSelf: "flex-start",
  },
  friendSettingsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
    marginRight: 10,
  },
});

export default SectionFriendManagerSettings;
