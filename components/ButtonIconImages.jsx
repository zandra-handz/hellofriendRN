import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import useImageFunctions from '../hooks/useImageFunctions';
import FlashAnim from '../animations/FlashAnim';
import PhotosTwoSvg from '../assets/svgs/photos-two.svg';
import ImageGalleryOutlineSvg from '../assets/svgs/image-gallery-outline.svg';

const ButtonIconImages = ({
    height=50,
    iconSize = 36,
    iconColor = 'black',
    countColor = 'white',
    circleColor = 'red',
    countTextSize = 12,
    onPress,
}) => {
    
    const { imageList } = useImageFunctions();
    const flashAnim = useRef(new Animated.Value(0)).current;
    const bobbingValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Flashing effect for the circle and count text
        const animateFlash = () => {
            Animated.loop(
                Animated.sequence([
                    // Flash effect - Brighten the background (circle) and count
                    Animated.timing(flashAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: false,
                    }),
                    // Fade back to the original color
                    Animated.timing(flashAnim, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        animateFlash();
    }, [flashAnim]);

    const bobbingStyle = {
        transform: [
            {
                translateY: bobbingValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                }),
            },
        ],
    };
 

    return (
        <TouchableOpacity onPress={onPress ? onPress : () => {}} style={[styles.container, {height: height}]}>
            
            <Animated.View style={[styles.animatedContainer, bobbingStyle]}>
             <View style={{ backgroundColor: 'transparent', flex: 1, width: '100%', justifyContent: 'center'}}>
                                     
                <ImageGalleryOutlineSvg height={iconSize} width={iconSize} color={iconColor} />
                <View style={{ top: '-7%', right: '1%', position: 'absolute' }}>
                    <FlashAnim circleColor={circleColor} circleTextSize={countTextSize} countColor={countColor}>
                        {imageList.length}
                    </FlashAnim>
                </View>
                
              </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
         
        justifyContent: 'center',

    },
    animatedContainer: {
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        flex: 1,
        
    },
    countContainer: {
        height: 24, // Adjust the size of the circle container
        width: 24, // Adjust the size of the circle container
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12, // Half of the height/width to make it circular
        textAlign: 'center',
    },
    countText: {
        fontFamily: 'Poppins-Bold',
    },
});

export default ButtonIconImages;
