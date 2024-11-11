import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 

const HomeButtonGenericAdd = ({ 
        onPress, 
        label='ADD NEW IMAGE', 
        height='100%',
        maxHeight=100,
        imageSize=100,
        image=require("../assets/shapes/chatmountain.png"), 
        imagePositionHorizontal, 
        imagePositionVertical,
        borderColor='transparent',
        borderRadius=20,
        darkColor = '#4caf50',
        lightColor = 'rgb(160, 241, 67)',
    }) => { 
    const globalStyles = useGlobalStyle();
    const { gradientColors } = useGlobalStyle();

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
    <TouchableOpacity onPress={onPress} style={[styles.container, {borderColor: borderColor, borderRadius: borderRadius, height: height, maxHeight: maxHeight}]}>
        <LinearGradient
          colors={[darkColor, lightColor]}
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
                textStyles(20, '#163805'),
                { fontFamily: 'Poppins-Bold', paddingRight: 20},
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
        padding: '5%', 
        paddingRight: '0%',
        alignContent: 'center', 
        marginVertical: '1%',
        borderWidth: 0, 
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },

});


export default HomeButtonGenericAdd;

