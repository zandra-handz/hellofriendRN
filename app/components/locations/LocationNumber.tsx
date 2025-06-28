import { View, Text, Linking } from "react-native";
import React, { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const LocationNumber = ({ phoneNumber }) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const handleCallLocation = useCallback(() => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [phoneNumber]);
  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      <MaterialCommunityIcons
        name="phone"
        size={20}
        color={themeStyles.primaryText.color}
      />
      <Text
        numberOfLines={1}
        onPress={phoneNumber ? handleCallLocation : () => {}}
        style={[
          themeStyles.primaryText,
          appFontStyles.subWelcomeText,
          { flexDirection: "row", width: "90%", flexWrap: "wrap" },
        ]}
      >
        {" "}
        {phoneNumber || `No number available`}
      </Text>
    </View>
  );
};

export default LocationNumber;
