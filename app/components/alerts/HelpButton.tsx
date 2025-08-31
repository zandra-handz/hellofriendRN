import { View, Text } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  iconColor: string;
  fontColor: string;
  onPress: () => void;
};
// to be used with either HelperMessage in component directly or via showHelperMessage
const HelpButton = ({
  iconColor = "orange",
  fontColor = "orange",
  onPress,
}: Props) => {
  return (
    <GlobalPressable
      hitSlop={30}
      style={{
        // flex: 1,
        flexShrink: 1,
        flexDirection: "column",
        borderRadius: 999,
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <Text
        style={[
          {
            color: fontColor,
            fontSize: 10,
            fontWeight: "bold",
            marginBottom: 4,
          },
        ]}
      >
        help
      </Text>
      <MaterialCommunityIcons
        name={"help-circle"}
        size={24}
        color={iconColor}
      />
    </GlobalPressable>
  );
};

export default HelpButton;
