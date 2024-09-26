import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonDirections = ({ address, size = 16, style }) => {
  
  const { themeStyles } = useGlobalStyle();

  const handlePress = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <FontAwesome5 name="map-marker-alt" size={size} color={themeStyles.modalIconColor.color} />
      <Text
        style={[styles.address, { fontSize: size, color: themeStyles.genericText.color}]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {address}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    width: '100%',
  },
  address: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    flexShrink: 1, // This allows the text to shrink and accommodate ellipsis
  },
});

export default ButtonDirections;
