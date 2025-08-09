import { View, Text } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  onPress: () => void;
};
// to be used with either HelperMessage in component directly or via showHelperMessage
const HelpButton = ({ onPress }: Props) => {
    const { themeStyles, manualGradientColors } = useGlobalStyle();
  return (
    <GlobalPressable
      hitSlop={30}
      style={{
        // flex: 1,
        flexShrink: 1,
        flexDirection: 'column',
        borderRadius: 999,
       // backgroundColor: "red",
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
        <Text style={[themeStyles.primaryText, { fontSize: 10, fontWeight: 'bold', marginBottom: 4}]}>
            help

        </Text>
      <MaterialCommunityIcons name={"help-circle"} size={24} color={manualGradientColors.lightColor} />
    </GlobalPressable>
  );
};

export default HelpButton;
