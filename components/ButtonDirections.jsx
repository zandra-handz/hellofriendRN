import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonDirections = ({ address, size = 15, fontColor, backgroundColor }) => {
  
  const { themeStyles } = useGlobalStyle();

  const handlePress = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
  };

  const cleanAddress = (address) => {
    // Define the patterns for zip code and country
    const zipCodePattern = /\b\d{5}(-\d{4})?\b/; // Adjust regex based on your zip code format
    const countryPattern = /,\s*(USA|Canada|Mexico|UK|Australia|Other)\b/i; // Add other countries as needed
  
    // Remove the zip code and country
    let cleanedAddress = address
      .replace(zipCodePattern, '')
      .replace(countryPattern, '')
      .trim(); // Trim to remove any leading/trailing spaces
  
    return cleanedAddress;
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, {backgroundColor: backgroundColor}]}>
      
      <Text
        style={[styles.address, {fontSize: size, color: fontColor}]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {cleanAddress(address)}
      </Text>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="map-marker-alt" size={17} color={fontColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    height: 40,
    width: '100%',
  },
  iconContainer: {
    paddingRight: 10,
    paddingLeft: 18,
    paddingBottom: 8,

  },
  address: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    flexShrink: 1, 
  },
});

export default ButtonDirections;
