import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import OverlayLargeButton from "../appwide/button/OverlayLargeButton";
import AddressSelectorUser from "../selectors/AddressSelectorUser";
import AddressSelectorFriend from "../selectors/AddressSelectorFriend";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";

import SelectAddressModal from "./SelectAddressModal";

import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ActiveAddressesProps {}

const ActiveAddresses: React.FC<ActiveAddressesProps> = () => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();

  const { defaultUserAddress } = useStartingUserAddresses();

  const { defaultAddress } = useStartingFriendAddresses();

  const [userAddress, setUserAddress] = useState(null);
  const [friendAddress, setFriendAddress] = useState(null);

  const [userAddressModalVisible, setUserAddressModalVisible ] = useState(false);
 const [friendAddressModalVisible, setFriendAddressModalVisible ] = useState(false);

  const closeModal = () => {

  };

  return (
    <>
    <View>
      <OverlayLargeButton
        label={`My Address: ${defaultUserAddress && defaultUserAddress.address}`}
        onPress={() => setUserAddressModalVisible(true)}
           buttonOnBottom={true}
      />
      {selectedFriend && (
        <OverlayLargeButton
          label={`${selectedFriend.name}'s Address: ${defaultAddress && defaultAddress.address}`}
          onPress={() => console.log("HOOOOWWDEEEEE")}
          buttonOnBottom={true}
        />
      )}
    </View>

    {userAddressModalVisible && (
      <View>
        <SelectAddressModal
        isVisible={userAddressModalVisible}
        closeModal={() => setUserAddressModalVisible(false)}
        />

      </View>
    )}
    
    </>
  );
};

export default ActiveAddresses;
