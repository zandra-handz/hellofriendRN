import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ButtonPhoneNumber = ({ phoneNumber, size = 14, family = 'Poppins-Regular', color="black", style }) => {
  const handlePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <FontAwesome5 name="phone" size={size} color={color} />
      <Text style={[styles.phoneNumber, { fontSize: size, color: color, fontFamily: family }]}>{phoneNumber}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  phoneNumber: {  
    marginLeft: 8,
  },
});

export default ButtonPhoneNumber;
