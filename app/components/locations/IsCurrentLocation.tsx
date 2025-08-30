import { View, TouchableOpacity, Text, DimensionValue } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import React from "react";

interface Props {
  
  onPress: () => void; 
  isCurrent?: boolean;
}

const IsCurrentLocation: React.FC<Props> = ({ onPress,   isCurrent=false, primaryColor="orange" }) => {
 


  const iconSize = 26;

  return ( 
    <TouchableOpacity
      onPress={onPress}
      style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}
    >
      <Text
        style={[ 
          { color: primaryColor, fontWeight: "bold", fontSize: 13, marginRight: 6 },
        ]}
      >
        {isCurrent && `Current`}
        {!isCurrent && `Stored address`}
      </Text>
      {isCurrent && (
        
      <MaterialCommunityIcons
        //name={"menu-swap"}
        name={"map-marker-check"}
        size={iconSize}
        color={primaryColor}
      />
      
      )}
    </TouchableOpacity>
  );
};

export default IsCurrentLocation;
