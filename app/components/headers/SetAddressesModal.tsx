import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import SectionAccessibilitySettings from "../user/SectionAccessibilitySettings";
import ActiveAddresses from "../locations/ActiveAddresses"; 

interface Props {
    userAddress: object;
    friendAddress: object;
    setUserAddress: React.Dispatch<React.SetStateAction<string | null>>;
    setFriendAddress: React.Dispatch<React.SetStateAction<string | null>>;
  isVisible: boolean;
  closeModal: () => void;
}

const SetAddressesModal: React.FC<Props> = ({ isVisible, closeModal, userAddress, setUserAddress, friendAddress, setFriendAddress }) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();

  const headerIconSize = 26;
 

//   const [userAddress, setUserAddress] = useState({
//     address: `No address selected`,
//     id: "",
//   });
//   const [friendAddress, setFriendAddress] = useState({
//     address: `No address selected`,
//     id: "",
//   });

  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  const renderActiveAddresses = useCallback(() => {
  if (userAddress && friendAddress) {
    return (
      <ActiveAddresses
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        friendAddress={friendAddress}
        setFriendAddress={setFriendAddress}
      />
    );
  }
  return null;
}, [userAddress, friendAddress, setUserAddress, setFriendAddress]);

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialIcons
          name={"location-pin"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Starting point addresses"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            {renderActiveAddresses()}
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
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});

export default SetAddressesModal;
