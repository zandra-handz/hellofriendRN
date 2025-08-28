import {  Text,  Pressable, Alert } from "react-native";
import React from "react"; 
import GlobalPressable from "../appwide/button/GlobalPressable";
 

interface ButtonDeselectProps {
  label: string;
  icon: React.ReactElement;
 
  labelFontSize?: number;
  onPress: () => void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  confirmationActionWord?: string;
 
}

const FooterButtonIconVersion: React.FC<ButtonDeselectProps> = ({
  label = "",
  primaryColor,
  icon, 
  labelFontSize = 11,
  onPress,
  confirmationRequired = false,
  confirmationTitle = "",
  confirmationMessage = "Are you sure?",
  confirmationActionWord = 'Yes', 
}) => {  

  const handleOnPress = () => {
    if (confirmationRequired) {
      Alert.alert(confirmationTitle, confirmationMessage, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
              {text: confirmationActionWord, onPress: () => onPress()},
 
      ]);
    } else {
        onPress();
    }
  };

  return (
    <GlobalPressable
      onPress={() => handleOnPress()}
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flex: 1, 
        
      }}
    >
      {icon && icon}
      <Text
        style={{
            marginTop: 4,
          fontSize: labelFontSize, 
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 10,
          fontWeight: "bold",
          color: primaryColor,
        }}
      >
        {label}
      </Text>
    </GlobalPressable>
  );
};

export default FooterButtonIconVersion;
