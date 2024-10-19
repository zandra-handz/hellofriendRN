import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import IconDynamicHelloType from '../components/IconDynamicHelloType';

 

const ButtonHello = ({ hello, onPress, color = 'white',  iconColor = 'white', icon: Icon, iconSize = 34 }) => {
  const { themeStyles } = useGlobalStyle(); 
 
   

  const handlePress = async () => {
    await onPress(); 


  };

  return (
    <View>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={handlePress} 
      >
        {Icon && (
          <View style={styles.iconContainer}>
            
            <IconDynamicHelloType selectedChoice={hello.type} svgColor={color}/>

          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitleText, {color: color}]}>{hello.date}</Text>
          <Text style={[styles.optionText, {color: color}]}>{hello.locationName}</Text>
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
    width: '12%',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
});

export default ButtonHello;
