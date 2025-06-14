import React  from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import InfoOutlineSvg from "@/app/assets/svgs/info-outline.svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import AlertFormNoSubmit from "../alerts/AlertFormNoSubmit";

interface SelectAddressModalProps {
  isVisible: boolean;
  closeModal: () => void;
}

const SelectAddressModal: React.FC<SelectAddressModalProps> = ({ isVisible, closeModal }) => {
  const { themeStyles } = useGlobalStyle();

  return ( 
      <AlertFormNoSubmit
        isModalVisible={isVisible}
        headerContent={
          <InfoOutlineSvg
            width={38}
            height={38}
            color={themeStyles.modalIconColor.color}
          />
        }
        questionText="Select address"
        formBody={
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={styles.sectionContainer}>
              <Text style={[styles.text, themeStyles.genericText]}>
                Thank you for downloading!
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.text, themeStyles.genericText]}>
                Hellofriend is an IRL-meet-up assistant that lets you store
                notes (moments) to share with friends ahead of meeting up with
                them. It generates suggestions for meet-up dates and helps you
                decide locations as well!
              </Text>
            </View>

            <View style={styles.headerContainer}>
              <Text style={[styles.headerText, themeStyles.subHeaderText]}>
                What is a 'Moment'?
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.text, themeStyles.genericText]}>
                A moment is literally any thought or idea you want to share with
                your friend the next time you see them.
              </Text>
            </View> 
          </ScrollView>
        }
        formHeight={610}
        onCancel={closeModal}
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
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
});

export default SelectAddressModal;
