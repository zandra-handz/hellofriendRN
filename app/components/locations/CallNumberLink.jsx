import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const CallNumberLink = ({ phoneNumber, size = 15, iconSize=17, style }) => {
  
  const {themeStyles} = useGlobalStyle();
  
  const handlePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <FontAwesome5 name="phone" size={iconSize} color={themeStyles.genericText.color} />
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
  },
});

export default CallNumberLink;
