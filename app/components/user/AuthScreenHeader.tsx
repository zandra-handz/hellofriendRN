import { Text } from "react-native";
 
import React from "react"; 
import { manualGradientColors } from "@/src/hooks/StaticColors";

type Props = {
  label: string;
  overrideFontSize: number;
};

const AuthScreenHeader = ({ label , overrideFontSize}: Props) => {
  return (
  
    <Text
      style={{
        color: manualGradientColors.darkHomeColor,
       // backgroundColor: 'orange',
        fontFamily: "Poppins-Bold",
        fontSize: overrideFontSize || 26,
        lineHeight: overrideFontSize ? overrideFontSize + 6 : 50,
        selfAlign: "center",
      }}
      accessible={true}
    >
      {label}
    </Text>
  );
};

export default AuthScreenHeader;
