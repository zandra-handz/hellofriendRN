import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; 

const CallNumberLink = ({
  primaryColor = "orange",
  phoneNumber,
  size = 15,
  iconSize = 17,
  style,
}) => { 

  const handlePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      <FontAwesome5
        name="phone"
        size={iconSize}
        color={primaryColor}
      />
      <Text
        style={[
          styles.phoneNumber,
          { fontSize: size, color: primaryColor },
        ]}
      >
        {phoneNumber}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
  },
  phoneNumber: {
    marginLeft: 8,
  },
});

export default CallNumberLink;
