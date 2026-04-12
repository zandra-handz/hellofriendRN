import React, { useCallback } from "react";
import { Alert, Linking, Pressable } from "react-native";

interface SendTextButtonProps {
  phoneNumber: string | null;
  friendId?: number | null;
  message: string;
  confirmTitle?: string;
  confirmMessage?: string;
  onAddPhoneNumber: () => void;
  onSent?: () => void;
  children: React.ReactNode;
}

const openSms = (message: string, phoneNumber?: string) => {
  const recipient = phoneNumber ? `${phoneNumber}` : "";
  Linking.openURL(`sms:${recipient}?body=${encodeURIComponent(message)}`);
};

const SendTextButton: React.FC<SendTextButtonProps> = ({
  phoneNumber,
  friendId,
  message,
  confirmTitle = "Send text",
  confirmMessage,
  onAddPhoneNumber,
  onSent,
  children,
}) => {
  const handlePress = useCallback(() => {
    if (!friendId) {
      openSms(message);
      onSent?.();
      return;
    }

    if (!phoneNumber) {
      Alert.alert(confirmTitle, "No phone number saved for this friend.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add phone number",
          onPress: onAddPhoneNumber,
        },
        {
          text: "Pick from contacts",
          onPress: () => {
            openSms(message);
            onSent?.();
          },
        },
      ]);
      return;
    }

    const displayMessage = confirmMessage ?? message;

    Alert.alert(confirmTitle, `Send "${displayMessage}"?`, [
      { text: "Go back", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          openSms(message, phoneNumber);
          onSent?.();
        },
      },
    ]);
  }, [phoneNumber, friendId, message, confirmTitle, confirmMessage, onAddPhoneNumber, onSent]);

  return <Pressable onPress={handlePress}>{children}</Pressable>;
};

export default SendTextButton;
