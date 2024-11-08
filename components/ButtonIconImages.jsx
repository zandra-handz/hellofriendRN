import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import { useImageList } from '../context/ImageListContext'; 

import PhotosTwoSvg from '../assets/svgs/photos-two.svg';

const ButtonIconImages = ({
    iconSize = 36,
    iconColor = 'black',
    countColor = 'white',
    circleColor = 'red',
    countTextSize = 12,
    onPress,
}) => {
    const { capsuleCount } = useCapsuleList();
    const { imageList } = useImageList();
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

    const animatedCircleColor = flashAnim.interpolate({
        inputRange: [0, .5],
        outputRange: [circleColor, 'yellow'], // Flashing to yellow
    });

    const animatedCountColor = flashAnim.interpolate({
        inputRange: [0, .5],
        outputRange: [countColor, 'black'], // Flashing to black
    });

    return (
        <TouchableOpacity onPress={onPress ? onPress : () => {}} style={styles.container}>
            
            <Animated.View style={[styles.animatedContainer, bobbingStyle]}>
                {/* Keeping the photo icon intact */}
                <PhotosTwoSvg height={iconSize} width={iconSize} color={iconColor} />
                <View style={{ top: '-17%', right: '27%' }}>
                    <Animated.View
                        style={[
                            styles.countContainer,
                            { backgroundColor: animatedCircleColor },
                        ]}
                    >
                        <Animated.Text
                            style={[
                                styles.countText,
                                { color: animatedCountColor, fontSize: countTextSize },
                            ]}
                        >
                            {imageList.length}
                        </Animated.Text>
                    </Animated.View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
    },
    animatedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
