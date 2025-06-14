import { View, TouchableOpacity, Text, DimensionValue } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import React from "react";

interface Props {
  
  onPress: () => void; 
  isSaved?: boolean;
}

const BookmarkAddress: React.FC<Props> = ({ onPress,   isSaved=false }) => {
  const { themeStyles } = useGlobalStyle();


  const iconSize = 26;

  return ( 
    <TouchableOpacity
      onPress={onPress}
      style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}
    >
      <Text
        style={[
          themeStyles.primaryText,
          { fontWeight: "bold", fontSize: 13, marginRight: 6 },
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
        color={themeStyles.primaryText.color}
      />
      
      )}
    </TouchableOpacity>
  );
};

export default BookmarkAddress;
