import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const SmallAddButton = ({ label, onPress }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyle();
  return (
    <TouchableOpacity
      style={[
        appContainerStyles.smallAddButton,
        {
          borderColor: themeStyles.primaryBackground.backgroundColor,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          width: 14,
          height: "100%",
          alignItems: "center",
          marginHorizontal: 2,
        }}
      >
        <Feather name="plus" size={14} color={themeStyles.primaryBackground.backgroundColor} />
      </View>
      <Text style={[ appFontStyles.smallAddButtonText, {color: themeStyles.primaryBackground.backgroundColor}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmallAddButton;
