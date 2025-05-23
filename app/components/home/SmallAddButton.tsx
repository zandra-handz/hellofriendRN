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
          borderColor: themeStyles.genericText.color,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          width: 14,
          height: "100%",
          alignItems: "center",
          marginHorizontal: 5,
        }}
      >
        <Feather name="plus" size={14} color={themeStyles.genericText.color} />
      </View>
      <Text style={[themeStyles.genericText, appFontStyles.smallAddButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmallAddButton;
