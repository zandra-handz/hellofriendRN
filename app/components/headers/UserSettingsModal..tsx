import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import SectionAccessibilitySettings from "../user/SectionAccessibilitySettings";

import SectionFriendManagerSettings from "../friends/SectionFriendManagerSettings";
import SectionAccountSettings from "../user/SectionAccountSettings";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";

interface Props {
  userId: number;
  isVisible: boolean;
  bottomSpacer: number;
  closeModal: () => void;
}

const UserSettingsModal: React.FC<Props> = ({
  userId,
  isVisible,
  bottomSpacer,
  closeModal,
}) => {
  const { lightDarkTheme } = useLDTheme();
  const {   appSpacingStyles, manualGradientColors } =
    useGlobalStyle();
  const { settings } = useUserSettings();
 

  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"wrench"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={lightDarkTheme.primaryText}
        />
      }
      buttonTitle="Settings"
      useModalBar={true}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`wrench`}
          size={50}
          color={manualGradientColors.darkHomeColor}
        />
      }
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          {/* // <View style={styles.bodyContainer}> */}

          <View style={styles.sectionContainer}>
            <SectionAccessibilitySettings
            manualGradientColors={manualGradientColors}
              userId={userId}
              primaryColor={lightDarkTheme.primaryText}
              settings={settings}
            />
          </View>
          <View style={styles.sectionContainer}>
            <SectionFriendManagerSettings
              userId={userId}
              primaryColor={lightDarkTheme.primaryText}
            />
          </View>

          <View style={styles.headerContainer}>
            <SectionAccountSettings primaryColor={lightDarkTheme.primaryText} />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, {color: lightDarkTheme.primaryText}]}>
              © Badrainbowz Studio 2025
            </Text>
          </View> 
        </ScrollView>
      }
      onClose={closeModal}
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
  sectionContainer: {
    margin: "2%",
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
