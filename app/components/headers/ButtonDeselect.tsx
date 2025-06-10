import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";

import { MaterialCommunityIcons } from "@expo/vector-icons";


interface ButtonDeselectProps {
    icon: React.ReactElement;
    iconSize: number;
    labelFontSize: number;
}

const ButtonDeselect: React.FC<ButtonDeselectProps> = ({
    iconSize=26, //random default
    labelFontSize=11,
}) => {
  const { deselectFriend } = useSelectedFriend();
  const { themeStyles, manualGradientColors } = useGlobalStyle();
 
  return (
    <TouchableOpacity
      onPress={() => deselectFriend()}
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center',
        height: '100%',
        flex: 1,
        textAlign: 'center',
      }}
    >
      <MaterialCommunityIcons
        name={"keyboard-backspace"}
        size={iconSize}
        color={themeStyles.footerIcon.color}
      />
      <Text style={{fontSize: labelFontSize, backgroundColor: manualGradientColors.homeLightColor, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 10, fontWeight: 'bold', color: themeStyles.footerIcon.color}}>Deselect</Text>
    </TouchableOpacity>
  );
};

export default ButtonDeselect;
