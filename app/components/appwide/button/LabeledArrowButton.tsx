import { View, Text, Pressable  } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface LabeledArrowButtonProps {
  label: string;
  labelFontSize?: number;
  arrowSize?: number;
  spacer?: number;
  itemId?: number;
  opacity?: number;
  onPress: () => void;
  color: string;
}

// some freedom to customize, rather than it dynamically calculating the same proportions with one given size value
const LabeledArrowButton: React.FC<LabeledArrowButtonProps> = ({
  label,
  labelFontSize = 13,
  arrowSize = 20,
  spacer = 6,
  itemId = null,
  opacity = 1,
  onPress,
  color='white',
}) => {
  const { manualGradientColors } = useGlobalStyle();

  const handleOnPress = () => {

    if (itemId) {
      onPress(itemId);
    } else {
      onPress();
    }
  };

  return (
    // <View style={{ flexDirection: "row", width: 'auto',   alignItems: 'center'}}>
      
    <Pressable
      style={{
        flexDirection: "row",
        height: "100%",
        justifyContent: "space-evenly",
        alignItems: "center", 
        opacity: opacity,
      }}
      onPress={handleOnPress}
    >
      <Text
        style={[ 
          {
            color: color,
            fontSize: labelFontSize,
            marginRight: spacer,
            // marginBottom: 2,
            fontWeight: "bold",
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={{  

          width: 20,
          height: "100%",
        }}
      >
        <MaterialCommunityIcons
          size={arrowSize}
          name={"arrow-right"}
          color={color}
        />
      </View>
    </Pressable>
    
    // </View>
    
  );
};

export default LabeledArrowButton;
