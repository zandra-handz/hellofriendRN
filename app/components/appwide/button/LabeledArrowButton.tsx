import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";

interface LabeledArrowButtonProps {
  label: string;
  labelFontSize?: number;
  arrowSize?: number;
  spacer?: number;
  opacity?: number;
  onPress: () => void;
}

// some freedom to customize, rather than it dynamically calculating the same proportions with one given size value
const LabeledArrowButton: React.FC<LabeledArrowButtonProps> = ({
  label,
  labelFontSize = 13,
  arrowSize = 20,
  spacer = 6,
  opacity = 1,
  onPress,
}) => {
  const { manualGradientColors } = useGlobalStyle();

  return (
    // <View style={{ flexDirection: "row", width: 'auto',   alignItems: 'center'}}>
      
    <TouchableOpacity
      style={{
        flexDirection: "row",
        height: "100%",
        justifyContent: "space-evenly",
        alignItems: "center", 
        opacity: opacity,
      }}
      onPress={onPress}
    >
      <Text
        style={[
          manualGradientColors.homeDarkColor,
          {
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
          transform: [{ rotate: "180deg" }],
          paddingRight: 20,

          width: 20,
          height: "100%",
        }}
      >
        <BackArrowLongerStemSvg
          height={arrowSize}
          width={arrowSize}
          color={manualGradientColors.homeDarkColor}
        />
      </View>
    </TouchableOpacity>
    
    // </View>
    
  );
};

export default LabeledArrowButton;
