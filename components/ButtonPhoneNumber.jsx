import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonPhoneNumber = ({ phoneNumber, size = 14, family = 'Poppins-Regular', color="black", style }) => {
  
  const {themeStyles} = useGlobalStyle();
  
  const handlePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <FontAwesome5 name="phone" size={size} color={themeStyles.modalIconColor.color} />
      <Text style={[styles.phoneNumber, { fontSize: size, color: themeStyles.genericText.color }]}>{phoneNumber}</Text>
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
    fontFamily: 'Poppins-Regular',
  },
});

export default ButtonPhoneNumber;
