import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import SectionAccessibilitySettings from "../user/SectionAccessibilitySettings";
// import SectionFriendSettings from "../friends/SectionFriendSettings";
import SectionAccountSettings from "../user/SectionAccountSettings";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
}

const FilterLocationsModal: React.FC<Props> = ({ isVisible, closeModal }) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle(); 

    const headerIconSize = 26;

 
  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return ( 
      <ModalWithGoBack
        isVisible={isVisible}
        headerIcon={
          <MaterialCommunityIcons
            name={"wrench"}
            size={appSpacingStyles.modalHeaderIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        questionText="Settings"
        children={
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={styles.sectionContainer}>
              <SectionAccessibilitySettings />
            </View>
            {/* <View style={styles.sectionContainer}>
             <SectionFriendSettings/>
            </View> */}

            <View style={styles.headerContainer}>
              <SectionAccountSettings />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.text, themeStyles.genericText]}>
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
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    margin: "2%",
  },
  headerText: { 
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 30,
  },
  text: { 
    fontSize: 14,
    lineHeight: 21,
  },
});

export default FilterLocationsModal;
