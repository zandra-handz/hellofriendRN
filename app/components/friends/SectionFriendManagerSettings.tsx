import React, { useMemo } from "react";
import { View,  StyleSheet, ColorValue } from "react-native";
import Reset from "../appwide/button/Reset";
import Toggle from "../user/Toggle"; 
 
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
 
import SvgIcon from "@/app/styles/SvgIcons";
import { UserSettings } from "@/src/types/UserSettingsTypes";


type Props = {
  userId: number;
  settings: UserSettings;
  primaryColor: ColorValue;
}

const SectionFriendManagerSettings = ({
  userId,
  settings,
  primaryColor, 
  backgroundColor='red',
}: Props) => {
  const { updateSettings } = useUpdateSettings({
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
      style={styles.container}
    >
      <Toggle
      backgroundColor={backgroundColor}
        primaryColor={primaryColor}
        label="Autoselect Next Friend"
        icon={
          <SvgIcon
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
          <SvgIcon
            name={"timer_sync"}
            size={20}
            color={primaryColor}
          />
        }
        primaryColor={primaryColor} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
