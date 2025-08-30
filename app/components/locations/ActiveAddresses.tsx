import { View } from "react-native";
import React, { useState, useEffect } from "react";
import OverlayLargeButton from "../appwide/button/OverlayLargeButton";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import IsCurrentLocation from "./IsCurrentLocation";
import BookmarkAddress from "./BookmarkAddress";

import SelectAddressModal from "./SelectAddressModal";
import SelectFriendAddressModal from "./SelectFriendAddressModal";

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
  primaryColor,
  overlayColor,
  primaryBackground,
  welcomeTextStyle,
  manualGradientColors,
}) => {
  const { selectedFriend } = useSelectedFriend();

  const [isUserAddressCurrent, setIsUserAddressCurrent] = useState(false);

  const {
    defaultUserAddress,

    userAddresses,
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

  const handleFriendAddressDefault = () => {
    if (!friendAddress.is_default) {
      updateFriendDefaultAddress(friendAddress.id);
    }
  };
  const handleUserAddressDefault = () => {
    if (!userAddress.is_default) {
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
    const existingAddress = userAddresses.find(
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

  // const closeModal = () => {};

  return (
    <>
      {userAddress && friendAddress && (
        <View>
          <OverlayLargeButton
            primaryColor={primaryColor}
            overlayColor={overlayColor}
            welcomeTextStyle={welcomeTextStyle}
            label={`My Address: ${userAddress && userAddress.address}`}
            onPress={() => setUserAddressModalVisible(true)}
            addTopRowElement={true}
            topRowElement={
              <>
                {isUserAddressCurrent && (
                  <IsCurrentLocation
                  primaryColor={primaryColor}
                    onPress={() => console.log("hiiii")}
                    isCurrent={true}
                  />
                )}
              </>
            }
            buttonOnBottom={true}
            customButton={
              <>
                {userAddress?.id?.slice?.(0, 4) !== "temp" && (
                  <MakeAddressDefault
                    onPress={() => handleUserAddressDefault(userAddress.id)}
                    isDefault={userAddress?.is_default}
                    primaryColor={primaryColor}
                  />
                )}
                <BookmarkAddress
                  onPress={() => handleBookmarkUserAddress(userAddress)}
                  isSaved={userAddresses.find(
                    (address) => address.address === userAddress.address
                  )}
                />
              </>
            }
          />
          {selectedFriend && (
            <OverlayLargeButton
              primaryColor={primaryColor}
              overlayColor={overlayColor}
              welcomeTextStyle={welcomeTextStyle}
              label={`${selectedFriend.name}'s Address: ${friendAddress && friendAddress.address}`}
              onPress={() => setFriendAddressModalVisible(true)}
              buttonOnBottom={true}
              customButton={
                <View style={{ flexDirection: "row" }}>
                  {friendAddress &&
                    friendAddress?.id?.slice?.(0, 4) !== "temp" && (
                      <MakeAddressDefault
                        onPress={() =>
                          handleFriendAddressDefault(friendAddress.id)
                        }
                        isDefault={friendAddress?.is_default}
                        disabled={friendAddress?.is_default}
                      />
                    )}

                  <BookmarkAddress
                    onPress={() => handleBookmarkFriendAddress(friendAddress)}
                    isSaved={friendAddress?.id?.slice?.(0, 4) !== "temp"}
                 primaryColor={primaryColor}
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
            primaryColor={primaryColor}
            primaryBackground={primaryBackground}
            welcomeTextStyle={welcomeTextStyle}
            manualGradientColors={manualGradientColors}
          />
        </View>
      )}

      {friendAddressModalVisible && (
        <View>
          <SelectFriendAddressModal
            isVisible={friendAddressModalVisible}
            closeModal={() => setFriendAddressModalVisible(false)}
            addressSetter={setFriendAddress}
            primaryColor={primaryColor}
            primaryBackground={primaryBackground}
            welcomeTextStyle={welcomeTextStyle}
            manualGradientColors={manualGradientColors}
          />
        </View>
      )}
    </>
  );
};

export default ActiveAddresses;
