import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import OverlayLargeButton from "../appwide/button/OverlayLargeButton";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import IsCurrentLocation from "./IsCurrentLocation";
import BookmarkAddress from "./BookmarkAddress";

import SelectAddressModal from "./SelectAddressModal";
import SelectFriendAddressModal from "./SelectFriendAddressModal";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import MakeAddressDefault from "./MakeAddressDefault";

interface ActiveAddressesProps {
  userAddress: object;
  friendAddress: object;
   setUserAddress: React.Dispatch<React.SetStateAction<string | null>>; 
    setFriendAddress: React.Dispatch<React.SetStateAction<string | null>>; 
}

const ActiveAddresses: React.FC<ActiveAddressesProps> = ({
  userAddress,
  setUserAddress,
  friendAddress,
  setFriendAddress,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();

  const [isUserAddressCurrent, setIsUserAddressCurrent] = useState(false);

  const {
    defaultUserAddress,
    userAddressMenu,
    updateUserDefaultAddress,
    createUserAddress,
    removeUserAddress,
  } = useStartingUserAddresses();
  const { currentLocationDetails } = useCurrentLocation();
  const {
    defaultAddress,
    updateFriendDefaultAddress,
    createFriendAddress,
    removeFriendAddress,
  } = useStartingFriendAddresses();

  // put these in parent screen so that i could send them to the next screen
  // const [userAddress, setUserAddress] = useState({
  //   address: `No address selected`,
  //   id: "",
  // });
  // const [friendAddress, setFriendAddress] = useState({
  //   address: `No address selected`,
  //   id: "",
  // });

  const handleFriendAddressDefault = () => {
    if (!friendAddress.isDefault) {
      updateFriendDefaultAddress(friendAddress.id);
    }
  };
    const handleUserAddressDefault = () => {
    if (!userAddress.isDefault) {
      updateUserDefaultAddress(userAddress.id);
    }
  };


  const handleBookmarkFriendAddress = () => {
    if (friendAddress?.id?.slice?.(0, 4) === "temp") {
      createFriendAddress(friendAddress.title, friendAddress.address);
    } else {
      removeFriendAddress(friendAddress.id);
    }
  };

  const handleBookmarkUserAddress = () => {
    const existingAddress = userAddressMenu.find(
      (address) => address.address === userAddress.address
    );
    if (!existingAddress) {
      createUserAddress(userAddress.title, userAddress.address);
    } else {
      if (existingAddress) {
        removeUserAddress(existingAddress.id);
      }
    }
  };

  useEffect(() => {
    if (defaultAddress) {
      setFriendAddress(defaultAddress);
    }
  }, [defaultAddress]);

  useEffect(() => {
    if (defaultUserAddress) {
      setUserAddress(defaultUserAddress);
    }
  }, [defaultUserAddress]);

  const [userAddressModalVisible, setUserAddressModalVisible] = useState(false);
  const [friendAddressModalVisible, setFriendAddressModalVisible] =
    useState(false);

  useEffect(() => {
    if (userAddress && currentLocationDetails) {
      setIsUserAddressCurrent(
        currentLocationDetails?.address === userAddress.address
      );
    }
  }, [userAddress, currentLocationDetails]);

  useEffect(() => {
    if (friendAddress) {
      console.log(friendAddress);
    }
  }, [friendAddress]);

  const closeModal = () => {};

  return (
    <>
      {userAddress && friendAddress && (
        <View>
          <OverlayLargeButton
            label={`My Address: ${userAddress && userAddress.address}`}
            onPress={() => setUserAddressModalVisible(true)}
            buttonOnBottom={true}
            customButton={
              <>
                {userAddress?.id?.slice?.(0, 4) !== "temp" && (
                  <MakeAddressDefault
                    onPress={() => handleUserAddressDefault(userAddress.id)}
                    isDefault={userAddress?.isDefault}
                  />
                )}
                <BookmarkAddress
                  onPress={() => handleBookmarkUserAddress(userAddress)}
                  isSaved={userAddressMenu.find(
                    (address) => address.address === userAddress.address
                  )}
                />

                {isUserAddressCurrent && (
                  <IsCurrentLocation
                    onPress={() => console.log("hiiii")}
                    isCurrent={true}
                  />
                )}
              </>
            }
          />
          {selectedFriend && (
            <OverlayLargeButton
              label={`${selectedFriend.name}'s Address: ${friendAddress && friendAddress.address}`}
              onPress={() => setFriendAddressModalVisible(true)}
              buttonOnBottom={true}
              customButton={
                <View style={{ flexDirection: "row" }}>
                  {friendAddress && (
                    <MakeAddressDefault
                      onPress={() =>
                        handleFriendAddressDefault(friendAddress.id)
                      }
                      isDefault={friendAddress?.isDefault}
                      disabled={friendAddress?.isDefault}
                    />
                  )}

                  <BookmarkAddress
                    onPress={() => handleBookmarkFriendAddress(friendAddress)}
                    isSaved={friendAddress?.id?.slice?.(0, 4) !== "temp"}
                  />
                </View>
              }
            />
          )}
        </View>
      )}

      {userAddressModalVisible && (
        <View>
          <SelectAddressModal
            isVisible={userAddressModalVisible}
            closeModal={() => setUserAddressModalVisible(false)}
            addressSetter={setUserAddress}
          />
        </View>
      )}

      {friendAddressModalVisible && (
        <View>
          <SelectFriendAddressModal
            isVisible={friendAddressModalVisible}
            closeModal={() => setFriendAddressModalVisible(false)}
            addressSetter={setFriendAddress}
          />
        </View>
      )}
    </>
  );
};

export default ActiveAddresses;
