import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import SectionAccessibilitySettings from "../user/SectionAccessibilitySettings";
 
import SectionFriendManagerSettings from "../friends/SectionFriendManagerSettings";
import SectionAccountSettings from "../user/SectionAccountSettings"; 
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

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
  const { themeStyles, appSpacingStyles, manualGradientColors } = useGlobalStyle();
const { settings } = useUserSettings();
  const headerIconSize = 26;

  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"wrench"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
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
            <SectionAccessibilitySettings userId={userId} primaryColor={themeStyles.primaryText.color} settings={settings} />
          </View>
          <View style={styles.sectionContainer}>
            <SectionFriendManagerSettings userId={userId} />
          </View>
   

          <View style={styles.headerContainer}>
            <SectionAccountSettings />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              © Badrainbowz Studio 2025
            </Text>
          </View>
          {/* </View> */}
        </ScrollView>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    //flexDirection: "column",
    //justifyContent: "flex-start",
    textAlign: "left",
    //flex: 1,
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
