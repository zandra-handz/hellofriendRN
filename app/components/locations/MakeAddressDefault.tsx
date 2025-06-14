import { View, TouchableOpacity, Text, DimensionValue } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import React from "react";

interface Props {
  onPress: () => void; 
  disabled: boolean;
  isDefault?: boolean;
}

const MakeAddressDefault: React.FC<Props> = ({ onPress, disabled=false,  isDefault=false }) => {
  const { themeStyles } = useGlobalStyle();


  const iconSize = 26;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}
    >
      <Text
        style={[
          themeStyles.primaryText,
          { fontWeight: "bold", fontSize: 13, marginRight: 6 },
        ]}
      >
        {isDefault && `Default address`}
        {!isDefault && `Make default address?`}
      </Text>
      {isDefault && (
        
      <MaterialCommunityIcons
        //name={"menu-swap"}
        name={"check-circle"}
        size={iconSize}
        color={themeStyles.primaryText.color}
      />
      
      )}
    </TouchableOpacity>
  );
};

export default MakeAddressDefault;
