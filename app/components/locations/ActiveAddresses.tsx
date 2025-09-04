import { View } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import OverlayLargeButton from "../appwide/button/OverlayLargeButton";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import { appFontStyles } from "@/src/hooks/StaticFonts";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import IsCurrentLocation from "./IsCurrentLocation";
import BookmarkAddress from "./BookmarkAddress";

import SelectAddressModal from "./SelectAddressModal";
import SelectFriendAddressModal from "./SelectFriendAddressModal";

import MakeAddressDefault from "./MakeAddressDefault";
import { findDefaultAddress } from "@/src/hooks/FindDefaultAddress";
import useCreateFriendAddress from "@/src/hooks/useCreateFriendAddress";
import useDeleteFriendAddress from "@/src/hooks/useDeleteFriendAddress";
import useUpdateFriendDefaultAddress from "@/src/hooks/useUpdateFriendDefaultAddress";

import useCreateUserAddress from "@/src/hooks/useCreateUserAddress";
import useDeleteUserAddress from "@/src/hooks/useDeleteUserAddress";
import useUpdateUserDefaultAddress from "@/src/hooks/useUpdatreUserAddress";

import { manualGradientColors } from "@/src/hooks/StaticColors";
interface ActiveAddressesProps {
  userAddress: object;
  friendAddress: object;
  setUserAddress: React.Dispatch<React.SetStateAction<string | null>>;
  setFriendAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const ActiveAddresses: React.FC<ActiveAddressesProps> = ({
  currentLocationSelected,
  userId,
  friendId,
  friendName,
  userAddress,
  setUserAddress,
  friendAddress,
  setFriendAddress,
  primaryColor,
  overlayColor,
  primaryBackground,
}) => {
  const welcomeTextStyle = appFontStyles.welcomeText;
  const [isUserAddressCurrent, setIsUserAddressCurrent] = useState(false);

  const { 
    userAddresses, 
  } = useStartingUserAddresses({ userId: userId });

  const { createFriendAddress } = useCreateFriendAddress({
    userId: userId,
    friendId: friendId,
  });

  const { deleteFriendAddress } = useDeleteFriendAddress({
    userId: userId,
    friendId: friendId,
  });

  const { updateFriendDefaultAddress } = useUpdateFriendDefaultAddress({
    userId: userId,
    friendId: friendId,
  });

  const { createUserAddress } = useCreateUserAddress({ userId: userId });
  const { deleteUserAddress } = useDeleteUserAddress({ userId: userId });
  const { updateUserDefaultAddress } = useUpdateUserDefaultAddress({
    userId: userId,
  });

  // const { currentLocationDetails } = useCurrentLocation();
  const { friendAddresses } = useStartingFriendAddresses({userId: userId, friendId: friendId});

  const defaultAddress = useCallback(() => {
    return findDefaultAddress(friendAddresses);
  }, [friendAddresses ]);


    const defaultUserAddress = useCallback(() => {
    return findDefaultAddress(userAddresses);
  }, [userAddresses ]);

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
      deleteFriendAddress(friendAddress.id);
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
        deleteUserAddress(existingAddress.id);
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

 const handleUserAddressPress = useCallback(
  () => handleUserAddressDefault(userAddress.id),
  [userAddress.id, handleUserAddressDefault]
);

const handleBookmarkPress = useCallback(
  () => handleBookmarkUserAddress(userAddress),
  [userAddress, handleBookmarkUserAddress]
);


  return (
    <>
      {userAddress && (
        //friendAddress &&
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
                    onPress={handleUserAddressPress} 
                    // onPress={() => handleUserAddressDefault(userAddress.id)}
                    isDefault={userAddress?.is_default}
                    primaryColor={primaryColor}
                  />
                )}
                <BookmarkAddress

                 onPress={handleBookmarkPress}
                  // onPress={() => handleBookmarkUserAddress(userAddress)}
                  isSaved={userAddresses.find(
                    (address) => address.address === userAddress.address
                  )}
                />
              </>
            }
          />
          {friendId && friendName && (
            <OverlayLargeButton
              primaryColor={primaryColor}
              overlayColor={overlayColor}
              welcomeTextStyle={welcomeTextStyle}
              label={`${friendName}'s Address: ${friendAddress && friendAddress.address}`}
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
            userId={userId}
            friendId={friendId}
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
          userId={userId}
          friendId={friendId}
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
