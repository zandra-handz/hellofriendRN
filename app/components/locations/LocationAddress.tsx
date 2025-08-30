import { View, Text, Linking } from "react-native";
import React, { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

const LocationAddress = ({ address, primaryColor, subWelcomeTextStyle }) => {
 

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
        color={primaryColor}
      />
      <Text
        numberOfLines={1}
        onPress={address ? handleGetDirections : () => {}}
        style={[ 
          subWelcomeTextStyle,
          { color: primaryColor, flexDirection: "row", width: "90%", flexWrap: "wrap" },
        ]}
      >
        {" "}
        {address || `No address available`}
      </Text>
    </View>
  );
};

export default LocationAddress;
