import { View } from "react-native";
import React, { useState  } from "react"; 
import { AppFontStyles } from "@/app/styles/AppFonts";
 

import SelectAddressModal from "./SelectAddressModal";
import SelectFriendAddressModal from "./SelectFriendAddressModal";

 
import manualGradientColors  from "@/app/styles/StaticColors";

import UserAddressChanger from "./UserAddressChanger";
import FriendAddressChanger from "./FriendAddressChanger";

interface ActiveAddressesProps {
  userAddress: object;
  friendAddress: object; 
}

const ActiveAddresses: React.FC<ActiveAddressesProps> = ({
 
  userId,
  friendId,
  friendName,
  primaryColor,
  overlayColor,
  primaryBackground,
}) => {
  const welcomeTextStyle = AppFontStyles.welcomeText; 
 
 

  const [userAddressModalVisible, setUserAddressModalVisible] = useState(false);
  const [friendAddressModalVisible, setFriendAddressModalVisible] =
    useState(false);

 

  return (
    <>
     
        <UserAddressChanger
          userId={userId}
          primaryColor={primaryColor}
          overlayColor={overlayColor}
        />

        <FriendAddressChanger
          userId={userId}
          friendId={friendId}
          friendName={friendName}
          primaryColor={primaryColor}
          overlayColor={overlayColor}
        /> 
      {userAddressModalVisible && (
        <View>
          <SelectAddressModal
            userId={userId}
            friendId={friendId}
            isVisible={userAddressModalVisible}
            closeModal={() => setUserAddressModalVisible(false)}
         v
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
