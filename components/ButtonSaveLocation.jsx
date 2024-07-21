import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ButtonSaveLocation = ({ location, saveable=true, size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    
    const [isTemp, setIsTemp ] = useState(saveable);
  
    const handlePress = () => { 
        console.log('save location here!')
        setIsTemp(false);

  };

  return (
    <View>
        {isTemp && (
        <TouchableOpacity onPress={handlePress} style={[styles.container, style]}> 
    
        <FontAwesome5 name="save" size={iconSize} /> 
        <Text style={[styles.saveText, { fontSize: size, color: color, fontFamily: family }]}> SAVE</Text>
    </TouchableOpacity>
        )}

        {!isTemp && (
            <View style={styles.container}>
                <FontAwesome5 name="bookmark" size={iconSize} /> 
            </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  }, 
  saveText: {
    marginLeft: 8, 

  },
});

export default ButtonSaveLocation;
