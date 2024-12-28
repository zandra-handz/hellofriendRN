import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
 
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 


            
 
const QuickSaveButton = ({ 
        onPress, 
        label='QUICK SAVE', 
        labelSize=14,
        height='100%',
        fontFamily='Poppins-Bold', 
        borderColor='transparent',
        borderRadius=20,
        darkColor = '#4caf50',
        lightColor = 'rgb(160, 241, 67)',
        isDisabled = true,
    }) => { 
    const globalStyles = useGlobalStyle(); 

    const adjustFontSize = (fontSize) => {
        return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
      };
    
      const textStyles = (fontSize, color) => ({
        fontSize: adjustFontSize(fontSize),
        color,
        ...(globalStyles.highContrast && {
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 1,
        }),
      });
    
  
return(
    <TouchableOpacity onPress={isDisabled? null : onPress} style={[styles.container, {borderColor: borderColor, borderRadius: borderRadius, height: height}]}>
         
        <LinearGradient
          colors={[isDisabled ? 'gray' : darkColor, isDisabled ? 'gray' : lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1}}
          style={{
            borderRadius: borderRadius,
            flexDirection: 'row',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
          }}
        /> 

 

            <Text
              style={[
                textStyles(labelSize, 'black'),
                { fontFamily: fontFamily, textTransform: 'uppercase', paddingRight: 0},
              ]}
            >
              {label}
            </Text>


    </TouchableOpacity>

)


};


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row', 
        width: '100%',     
        alignContent: 'center',   
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        zIndex: 5000,
        elevation: 5000,
    },

});


export default QuickSaveButton;

