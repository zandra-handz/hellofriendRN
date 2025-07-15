import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import InfoOutlineSvg from "@/app/assets/svgs/info-outline.svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import DualLocationSearcher from "./DualLocationSearcher";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";

interface SelectAddressModalProps {
  isVisible: boolean; // = is editing address
  closeModal: () => void;
  addressSetter: React.Dispatch<React.SetStateAction<string | null>>; // the set of a useState
}

const SelectAddressModal: React.FC<SelectAddressModalProps> = ({
  isVisible,
  closeModal,
  addressSetter,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();

  const {
    usingCurrent,
    userAddresses, 
    defaultUserAddress,
    updateUserDefaultAddress,
    createUserAddress,
    removeUserAddress,
  } = useStartingUserAddresses();

  const [selectedAddress, setSelectedAddress] = useState(defaultUserAddress);
  const [isExistingAddress, setIsExistingAddress] = useState(false);

  const handleCheckIfExistingAndSelect = (address) => {
    setIsExistingAddress(false); //to clear
    const isExisting = userAddresses.find(
      (menuAddress) =>
        menuAddress.address === address.address || menuAddress.id === address.id
    );

    if (isExisting) {
      addressSetter(isExisting);
      console.log(
        `isExisting set friend address in selector via parent function`,
        address
      );
    } else {
      addressSetter(address);
      console.log(`set friend address in selector via parent function`);
    }
    setIsExistingAddress(!!isExisting);
  };

  const handleAddressSelect = (address) => {
    if (address) {
      handleCheckIfExistingAndSelect(address);

      closeModal();
    }
  };

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialIcons
          name={"edit-location-alt"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.modalIconColor.color}
        />
      }
      questionText="Select address"
      children={
        <View style={styles.bodyContainer}>
          <DualLocationSearcher
            onPress={handleAddressSelect}
            locationListDrilledOnce={userAddresses}
          />
        </View>
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
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
});

export default SelectAddressModal;
