import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { Linking } from "react-native";
import { useUser } from "@/src/context/UserContext";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  bottomSpacer: number;
}

const ReportIssueModal: React.FC<Props> = ({ isVisible, bottomSpacer, closeModal }) => {
  const { user } = useUser();
  const { themeStyles, appSpacingStyles, manualGradientColors } =
    useGlobalStyle();

  const generateUniqueEmailURL = () => {
    const uniqueId = uuidv4(); // Generate a unique ID
    const subject = `Hellofriend Bug Report\n\nID: ${uniqueId}`;
    const body = `Hi ${user?.username}! Thank you for taking the time to provide feedback. Please describe what went wrong while using the app:\n\n`;
    return `mailto:tzandrabuilds@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  //   React.useEffect(() => {
  //     if (isModalVisible) {
  //       AccessibilityInfo.announceForAccessibility("Information opened");
  //     }
  //   }, [isModalVisible]);

  return ( 
           <ModalScaleLikeTree
       bottomSpacer={bottomSpacer}
       isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"bug-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Report a bug"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
       
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
