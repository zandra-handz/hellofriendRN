import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
 
const DirectionsLink = ({ address, size = 15, iconSize=14, fontColor, backgroundColor }) => {
   

  const handlePress = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
  };

  const cleanAddress = (address) => { 
    const zipCodePattern = /\b\d{5}(-\d{4})?\b/; // Adjust regex based on your zip code format
    const countryPattern = /,\s*(USA|Canada|Mexico|UK|Australia|Other)\b/i; // Add other countries as needed
   

    //uncomment below this to remove zip code 
    let cleanedAddress = address
      //.replace(zipCodePattern, '')
      .replace(countryPattern, '')
      .trim(); 
  
    return cleanedAddress;
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, {backgroundColor: backgroundColor}]}>
      
      <View style={styles.iconContainer}>
        <FontAwesome5 name="map-marker-alt" size={iconSize} color={fontColor} />
      </View>
      <Text
        style={[styles.address, {fontSize: size, color: fontColor}]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {cleanAddress(address)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start', 
    padding: 0,
    height: 'auto',
    width: '100%',
  },
  iconContainer: { 
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '2%', 
  },
  address: { 
    flexShrink: 1, 
  },
});

export default DirectionsLink;
