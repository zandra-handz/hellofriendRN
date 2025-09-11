import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import DialogBox from "./DialogBox";
import useUpdateFriend from "@/src/hooks/useUpdateFriend";

type Props = {
  userId: number;
  friendId: number;
  isVisible: boolean;
  onClose: () => void;
};

const AddPhoneNumber = ({
  userId,
  friendId,
 
  isVisible,
  onClose,
}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { handleUpdateFriendSettings, updateFriendSettingsMutation } = useUpdateFriend({
    userId: userId,
    friendId: friendId
  });

//   console.log(userId, friendId);

  const onChangeText = (text) => {
    // Remove anything that's not a digit
    const cleaned = text.replace(/[^\d]/g, "");
    setPhoneNumber(cleaned);
  };

  const handleUpdatePhoneNumber = () => {
    if (phoneNumber) {
      handleUpdateFriendSettings({
        phoneNumber}
      );
    }
 
  };

  useEffect(() => {
    if (updateFriendSettingsMutation.isSuccess) {
        console.log('friend settings updated successfully');
        onClose(true);
    }

  }, [updateFriendSettingsMutation.isSuccess]);

  return (
    <DialogBox
      isVisible={isVisible}
      value={phoneNumber}
      onChangeText={onChangeText}
      onClose={onClose}
      onPress={handleUpdatePhoneNumber}
    />
  );
};

export default AddPhoneNumber;
