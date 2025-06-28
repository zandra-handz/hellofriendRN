import { View, Text, Linking } from "react-native";
import React, { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const LocationAddress = ({ address }) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const handleGetDirections = useCallback(() => {
    if (address) {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    );
}
  }, [address]);

  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      <MaterialCommunityIcons
        name="map-marker"
        size={20}
        color={themeStyles.primaryText.color}
      />
      <Text
        numberOfLines={1}
        onPress={address ? handleGetDirections : () => {}}
        style={[
          themeStyles.primaryText,
          appFontStyles.subWelcomeText,
          { flexDirection: "row", width: "90%", flexWrap: "wrap" },
        ]}
      >
        {" "}
        {address || `No address available`}
      </Text>
    </View>
  );
};

export default LocationAddress;
