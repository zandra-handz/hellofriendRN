import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import { Linking } from "react-native";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  bottomSpacer: number;
}

const ReportIssueModal: React.FC<Props> = ({
  username,
  primaryColor = 'orange',
  subWelcomeTextStyle,
  manualGradientColors,

  isVisible,
  bottomSpacer,
  closeModal,
}) => { 

  const generateUniqueEmailURL = () => {
    const uniqueId = uuidv4(); // Generate a unique ID
    const subject = `Hellofriend Bug Report\n\nID: ${uniqueId}`;
    const body = `Hi ${username}! Thank you for taking the time to provide feedback. Please describe what went wrong while using the app:\n\n`;
    return `mailto:tzandrabuilds@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"bug-outline"}
          size={30}
          color={primaryColor}
        />
      }
      buttonTitle={`Report a bug`}
      useModalBar={true}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`bug`}
          size={50}
          color={manualGradientColors.darkHomeColor}
        />
      }
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <Text
              style={[subWelcomeTextStyle, { color: primaryColor}]}
            >
              Please report any issues
              <Text
                onPress={() => Linking.openURL(generateUniqueEmailURL())}
                style={[
                  styles.linkText, 
                  { color: manualGradientColors.lightColor },
                ]}
              >
                {` here `}
              </Text>
              so that I can speedily fix them. Thank you!
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

export default ReportIssueModal;
