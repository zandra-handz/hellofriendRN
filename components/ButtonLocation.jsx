import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 import { useNavigation } from '@react-navigation/native';

const ButtonLocation = ({ location, favorite=false, color = 'white',  iconColor = 'white', icon: Icon, iconSize = 34 }) => {

  const navigation = useNavigation();  
 
  

  const handleGoToLocationViewScreen = () => { 
    navigation.navigate('Location', { location: location, favorite: favorite });
  
  }; 

  const handlePress = async () => {  
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
