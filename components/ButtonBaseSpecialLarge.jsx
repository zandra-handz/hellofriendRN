import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import ButtonLottieAnimation from '../components/ButtonLottieAnimation';

const ButtonBaseSpecialLarge = ({ 
        onPress, 
        label='ADD NEW IMAGE', 
        height='100%',
        imageSize=100,
        image=require("../assets/shapes/chatmountain.png"), 
        imagePositionHorizontal, 
        imagePositionVertical,
        darkColor = '#4caf50',
        lightColor = 'rgb(160, 241, 67)',
    }) => {
    const lottieViewRef = useRef(null);
    const globalStyles = useGlobalStyle();
    const { selectedFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
    const [ borderColor, setBorderColor ] = useState('transparent');


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
    <TouchableOpacity onPress={onPress} style={[styles.container, {height: height}]}>
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1}}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        <Text
              style={[
                textStyles(30, 'white'),
                { fontFamily: 'Poppins-Regular' },
              ]}
            >
              {label}
            </Text>
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

    </TouchableOpacity>

)


};


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',  
        padding: '4%', 
        paddingRight: '0%',
        alignContent: 'center',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },

});


export default ButtonBaseSpecialLarge;

