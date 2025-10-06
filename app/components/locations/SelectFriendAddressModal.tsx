import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialIcons } from "@expo/vector-icons";

import DualLocationSearcher from "./DualLocationSearcher";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
interface Props {
  isVisible: boolean; // = is editing address
  closeModal: () => void;
  addressSetter: React.Dispatch<React.SetStateAction<string | null>>; // the set of a useState
}

const SelectFriendAddressModal: React.FC<Props> = ({
  // userId,
  // friendId,
  friendAddresses,
  isVisible,
  closeModal,
  addressSetter,
  primaryColor,
  primaryBackground,
  welcomeTextStyle,
  manualGradientColors,
}) => {
  // const { friendAddresses } = useStartingFriendAddresses({userId: userId, friendId: friendId});

  const [isExistingAddress, setIsExistingAddress] = useState(false);

  const handleCheckIfExistingAndSelect = (address) => {
    setIsExistingAddress(false); //to clear
    const isExisting = friendAddresses.find(
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
          size={30}
          color={primaryColor}
        />
      }
      questionText="Select address"
      children={
        <View style={styles.bodyContainer}>
          <DualLocationSearcher
            onPress={handleAddressSelect}
            locationListDrilledOnce={friendAddresses}
            primaryColor={primaryColor}
            primaryBackground={primaryBackground}
            welcomeTextStyle={welcomeTextStyle}
            manualGradientColors={manualGradientColors}
        
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

export default SelectFriendAddressModal;
