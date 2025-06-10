import { v4 as uuidv4 } from "uuid";
import React  from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  AccessibilityInfo,
} from "react-native";

import BugSvg from "@/app/assets/svgs/bug.svg";
 
import AlertFormNoSubmit from "../alerts/AlertFormNoSubmit";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { Linking } from "react-native";
import { useUser } from "@/src/context/UserContext";

const ReportIssueModal = ({ isVisible, closeModal }) => {
  const { user } = useUser();
  const { themeStyles, manualGradientColors } = useGlobalStyle(); 

  const generateUniqueEmailURL = () => {
    const uniqueId = uuidv4(); // Generate a unique ID
    const subject = `Hellofriend Bug Report\n\nID: ${uniqueId}`;
    const body = `Hi ${user.username}! Thank you for taking the time to provide feedback. Please describe what went wrong while using the app:\n\n`;
    return `mailto:tzandrabuilds@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

 

//   React.useEffect(() => {
//     if (isModalVisible) {
//       AccessibilityInfo.announceForAccessibility("Information opened");
//     }
//   }, [isModalVisible]);

  return (
    <AlertFormNoSubmit
      isModalVisible={isVisible}
      headerContent={
        <BugSvg
          width={38}
          height={38}
          color={themeStyles.modalIconColor.color}
        />
      }
      questionText="Feedback"
      formBody={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              Found a bug?
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              I am so sorry for the inconvenience and potential frustration!
              Please report it
              <Text
                onPress={() => Linking.openURL(generateUniqueEmailURL())}
                style={[
                  styles.linkText,
                  themeStyles.genericText,
                  { color: manualGradientColors.lightColor },
                ]}
              >
                {` here `}
              </Text>
              so that I can speedily fix it. Thank you!
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
    flexDirection: "row",
    fontWrap: "wrap",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  linkText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ReportIssueModal;
