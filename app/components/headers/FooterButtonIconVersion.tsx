import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 

import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ButtonDeselectProps {
  label: string;
  icon: React.ReactElement;
  iconSize: number;
  labelFontSize: number;
  onPress: () => void;
  confirmationRequired: boolean;
  confirmationTitle: string;
  confirmationMessage: string;
  confirmationActionWord: string;
  hasModal: boolean;
  modalVisible: boolean;
}

const FooterButtonIconVersion: React.FC<ButtonDeselectProps> = ({
  label = "",
  icon,
  iconSize = 26, //random default
  labelFontSize = 11,
  onPress,
  confirmationRequired = false,
  confirmationTitle = "",
  confirmationMessage = "Are you sure?",
  confirmationActionWord = 'Yes', 
}) => { 
  const { themeStyles, manualGradientColors } = useGlobalStyle();

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
    <TouchableOpacity
      onPress={() => handleOnPress()}
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flex: 1,
        textAlign: "center",
        
      }}
    >
      {icon && icon}
      <Text
        style={{
            marginTop: 4,
          fontSize: labelFontSize,
         // backgroundColor: manualGradientColors.homeLightColor,
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 10,
          fontWeight: "bold",
          color: themeStyles.footerIcon.color,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FooterButtonIconVersion;
