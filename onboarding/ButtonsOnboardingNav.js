import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useGlobalStyle } from '../context/GlobalStyleContext';


const ButtonsOnboardingNav = ({ showPrevButton, showNextButton, onPrevPress, onNextPress, iconColor }) => {
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const { themeStyles, gradientColors } = useGlobalStyle();
    const { darkColor, lightColor } = gradientColors;

    useEffect(() => {
        if (iconColor === 'hotpink' && showNextButton) { // Only start the animation if the button is active and not disabled
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.5,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [iconColor, showNextButton]); // Re-run the effect whenever iconColor or showNextButton changes

    return (
        <View style={[styles.container]}>
            {showPrevButton && (
                <TouchableOpacity onPress={onPrevPress}>
                    <FontAwesome name="angle-left" size={46} color="black" />
                </TouchableOpacity>
            )}

            {showNextButton ? (
                <TouchableOpacity onPress={onNextPress} style={styles.nextButton}>
                    <Animated.View style={[styles.pulsatingIcon, { transform: [{ scale: pulseAnimation }] }]}>
                        <FontAwesome name="angle-right" size={46} color={iconColor} />
                    </Animated.View>
                </TouchableOpacity>
            ) : (
                <View style={[styles.nextButton, styles.disabledButton]}>
                    <FontAwesome name="angle-right" size={46} color="#ccc" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',  
        width: '100%',  
        zIndex: 1, 
    },
    nextButton: {
        borderWidth: 0,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: 'transparent',  
    },
    pulsatingIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ButtonsOnboardingNav;
