import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { Linking } from "react-native";
import AppModal from "../alerts/AppModal";
import manualGradientColors from "@/app/styles/StaticColors";

interface Props {
  username: string;
  textColor: string;
  backgroundColor: string;
  isVisible: boolean;
  closeModal: () => void; 
}

const ReportIssueModal: React.FC<Props> = ({
  username,
  textColor,
  backgroundColor,
  isVisible,
  closeModal,
}) => {
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const generateUniqueEmailURL = () => {
    const uniqueId = uuidv4(); // Generate a unique ID
    const subject = `Hellofriend Bug Report\n\nID: ${uniqueId}`;
    const body = `Hi ${username}! Thank you for taking the time to provide feedback. Please describe what went wrong while using the app:\n\n`;
    return `mailto:tzandrabuilds@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <AppModal
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      onClose={closeModal}
      useCloseButton={true}
      questionText="Report issues"
      children={
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.sectionContainer}>
            <Text style={[subWelcomeTextStyle, { color: textColor }]}>
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
    />
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  headerContainer: {
    margin: "2%",
  },
    sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
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
