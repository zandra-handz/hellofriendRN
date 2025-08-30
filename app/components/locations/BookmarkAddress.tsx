import {   Pressable, Text } from "react-native";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import React from "react";

interface Props {
  
  onPress: () => void; 
  isSaved?: boolean;
  primaryColor: string;
}

const BookmarkAddress: React.FC<Props> = ({ onPress,   isSaved=false, primaryColor='orange' }) => {
 


  const iconSize = 26;

  return ( 
    <Pressable
      onPress={onPress}
      style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}
    >
      <Text
        style={[ 
          { color: primaryColor, fontWeight: "bold", fontSize: 13, marginRight: 6 },
        ]}
      >
        {isSaved && `Remove`}
        {!isSaved && `Bookmark?`}
      </Text>
      {isSaved && (
        
      <MaterialCommunityIcons
        //name={"menu-swap"}
        name={"bookmark"}
        size={iconSize}
        color={primaryColor}
      />
      
      )}
    </Pressable>
  );
};

export default BookmarkAddress;
