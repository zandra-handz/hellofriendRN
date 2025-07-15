import { v4 as uuidv4 } from "uuid";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  AccessibilityInfo,
} from "react-native";
 

import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { Linking } from "react-native";
import { useUser } from "@/src/context/UserContext";

const CarouselItemModal = ({ isVisible, closeModal,   display, icon, title, type, onPress }) => {
  const { user } = useUser();
  const { themeStyles, appSpacingStyles, manualGradientColors } =
    useGlobalStyle();

 

  //   React.useEffect(() => {
  //     if (isModalVisible) {
  //       AccessibilityInfo.announceForAccessibility("Information opened");
  //     }
  //   }, [isModalVisible]);

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={icon}
      questionText={title}
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
        
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              {display}
 
            </Text>
                          <Text
                onPress={() => onPress()}
                style={[
                  styles.linkText,
                  themeStyles.genericText,
                  { color: manualGradientColors.lightColor },
                ]}
              >
                {` edit `}
              </Text>
          </View>
        </ScrollView>
      }
      formHeight={610}
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

export default CarouselItemModal;
