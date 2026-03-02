import React from "react";
import { View,   ScrollView, StyleSheet } from "react-native";
 
import manualGradientColors from "@/app/styles/StaticColors";
import SectionAccessibilitySettings from "../user/SectionAccessibilitySettings";

import SectionFriendManagerSettings from "../friends/SectionFriendManagerSettings";
import SectionAccountSettings from "../user/SectionAccountSettings";
import AppModal from "../alerts/AppModal";
// import { useUserSettings } from "@/src/context/UserSettingsContext";
import useUserSettings from "@/src/hooks/useUserSettings";
import { LDTheme } from "@/src/types/LDThemeTypes";
interface Props {
  userId: number;
  isVisible: boolean;
  bottomSpacer: number;
  closeModal: () => void; 
  textColor: string;
  backgroundColor: string;
}

const UserSettingsModal: React.FC<Props> = ({
  userId,

  isVisible, 
  closeModal, 
  textColor,
  backgroundColor,
}) => {
  const { settings } = useUserSettings();

  return (
    <AppModal
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      questionText="User settings"
      onClose={closeModal}
      useCloseButton={true}
      children={
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {/* // <View style={styles.bodyContainer}> */}
 
              <SectionAccessibilitySettings
                backgroundColor={backgroundColor}
                userId={userId}
                primaryColor={textColor}
                settings={settings}
              />
          
              <SectionFriendManagerSettings
                backgroundColor={backgroundColor}
                userId={userId}
                settings={settings}
                primaryColor={textColor}
                manualGradientColors={manualGradientColors}
              />
         
              <SectionAccountSettings
                primaryColor={textColor}
              /> 
          </ScrollView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    textAlign: "left",
 
  },
  headerContainer: {
    margin: "2%",
  },
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});

export default UserSettingsModal;
