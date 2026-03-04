import { Text } from "react-native";
 
import React from "react"; 
 
type Props = {
  label: string;
  color: string;
  overrideFontSize: number;
};

const AuthScreenHeader = ({ label , color='red' }: Props) => {
  return (
  
    <Text
      style={{
        color: color,
       // backgroundColor: 'orange',
        fontFamily: "Poppins-Bold",
        fontSize:  26,
        lineHeight:  50, 
      }}
      accessible={true}
    >
      {label}
    </Text>
  );
};

export default AuthScreenHeader;
