import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';

import { useLocationList } from '../context/LocationListContext'; 


const ButtonLocation = ({ location, onPress, color = 'white',  iconColor = 'white', icon: Icon, iconSize = 34 }) => {
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation(); 
  const { setSelectedLocation }= useLocationList();
   
 
  

  const handleGoToLocationViewScreen = () => { 
    navigation.navigate('Location', { location: location });
    //no need to pass in location if already selected in parent
    //navigation.navigate('Location', { location: location });
    
  }; 

  const handlePress = async () => {
    setSelectedLocation(location);
    //This in press sets the location to the selectedLocation
    if (onPress) { 
    await onPress();
    };
    handleGoToLocationViewScreen();


  };

  return (
    <View>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={handlePress} // Call the passed in onPress function
      >
        {Icon && (
          <View style={styles.iconContainer}>
            
            <Icon width={iconSize} height={iconSize} color={iconColor} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitleText, {color: color}]}>{location.title}</Text>
          <Text style={[styles.optionText, {color: color}]}>{location.address}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  optionTitleText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  optionText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
});

export default ButtonLocation;
