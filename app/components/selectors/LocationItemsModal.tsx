import { v4 as uuidv4 } from "uuid";
import React from "react";
import {
  ScrollView,
  StyleSheet, 
  View,
  Text,
  AccessibilityInfo,
} from "react-native";
 

import ModalWithGoBack from "../alerts/ModalWithGoBack"; 

const LocationItemsModal = ({
 
  primaryColor,
  isVisible,
  closeModal,
  display,
  icon,
  title,
  type,
  onPress,
  children,
}) => { 
 
 
  return (
    <ModalWithGoBack
      isVisible={isVisible}
      useModalBar={true}
      headerIcon={icon}
      questionText={title}
      children={
        <View style={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
           {children}
          </View>
        </View>
      }
     
      onClose={closeModal}
      cancelText="Back"
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
    flexDirection: "row",
    fontWrap: "wrap",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text: {
    lineHeight: 21,
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LocationItemsModal;
