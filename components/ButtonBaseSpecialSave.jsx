import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
 
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 

//to use friend colors:
//darkColor={friendColorTheme.useFriendColorTheme != false  ? themeAheadOfLoading.darkColor : undefined}
//lightColor={friendColorTheme.useFriendColorTheme != false ? themeAheadOfLoading.lightColor : undefined}
              
 
const ButtonBaseSpecialSave = ({ 
        onPress, 
        label='ADD NEW IMAGE', 
        labelSize=22,
        height='100%',
        fontFamily='Poppins-Bold',
        maxHeight=100,
        imageSize=100,
        image=require("../assets/shapes/chatmountain.png"), 
        imagePositionHorizontal=0, 
        imagePositionVertical=0,
        borderColor='transparent',
        borderRadius=10,
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
    <TouchableOpacity onPress={isDisabled? null : onPress} style={[styles.container, {borderColor: borderColor, borderRadius: borderRadius, height: height, maxHeight: maxHeight}]}>
         
        <LinearGradient
          colors={[isDisabled ? 'gray' : darkColor, isDisabled ? 'gray' : lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1}}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        /> 


            {image && (
            <Image
            source={image}
            style={{  
                width: imageSize,
                height: imageSize, 
                top: imagePositionVertical,
                right: imagePositionHorizontal,
            }}
            resizeMode="contain"
            />
            )} 

            <Text
              style={[
                textStyles(labelSize, 'black'),
                { fontFamily: fontFamily, textTransform: 'uppercase', paddingRight: 20},
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
        flex: 1,
        width: '100%',  
        padding: '1%', 
        paddingRight: '0%',
        alignContent: 'center', 
        marginVertical: '1%',
        borderWidth: 1, 
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        zIndex: 5000,
        elevation: 5000,
    },

});


export default ButtonBaseSpecialSave;

