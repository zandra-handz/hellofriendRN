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

 

  const closeModal = () => {};

  return (
    <>
      {userAddress && friendAddress && (
        <View>
          <OverlayLargeButton
            label={`My Address: ${userAddress && userAddress.address}`}
            onPress={() => setUserAddressModalVisible(true)}
            addTopRowElement={true}
            topRowElement={
              <> 
                {isUserAddressCurrent && ( 
                    <IsCurrentLocation
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
