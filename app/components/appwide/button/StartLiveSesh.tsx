import React from "react";
import { TextStyle } from "react-native";
import OptionNoToggle from "../../headers/OptionNoToggle";
import useCreateLiveSeshInvite from "@/src/hooks/LiveSeshCalls/useCreateLiveSeshInvite";

interface Props {
  userId: number;
  friendId: number;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  buttonPadding?: number;
}

const StartLiveSesh: React.FC<Props> = ({
  userId,
  friendId,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
}) => {
  const { handleCreateInvite, inviteMutation } = useCreateLiveSeshInvite({
    userId,
    friendId,
  });

  return (
    <OptionNoToggle
      label={inviteMutation.isPending ? "Sending invite..." : "Start live sesh"}
      iconName="account_plus"
      iconSize={20}
      iconColor={primaryColor}
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      buttonColor={buttonColor}
      textStyle={textStyle}
      buttonPadding={buttonPadding}
      onPress={inviteMutation.isPending ? undefined : handleCreateInvite}
    />
  );
};

export default StartLiveSesh;
