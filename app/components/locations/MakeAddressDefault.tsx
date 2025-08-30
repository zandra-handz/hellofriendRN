import { Pressable, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";

interface Props {
  onPress: () => void;
  disabled: boolean;
  isDefault?: boolean;
  primaryColor: string;
}

const MakeAddressDefault: React.FC<Props> = ({
  onPress,
  disabled = false,
  isDefault = false,
  primaryColor = "orange",
}) => {
  const iconSize = 26;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}
    >
      <Text
        style={[
          {
            color: primaryColor,
            fontWeight: "bold",
            fontSize: 13,
            marginRight: 6,
          },
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
          color={primaryColor}
        />
      )}
    </Pressable>
  );
};

export default MakeAddressDefault;
