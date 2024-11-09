
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const FlashAmin = ({
    children,
    circleColor = 'red',
    countColor = 'white',
    flashToColor = 'yellow',  
    textFlashToColor = 'black', 
}) => {
    const flashAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateFlash = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(flashAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: false,
                    }),
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

    const animatedCircleColor = flashAnim.interpolate({
        inputRange: [0, 0.5],
        outputRange: [circleColor, flashToColor],
    });

    const animatedCountColor = flashAnim.interpolate({
        inputRange: [0, 0.5],
        outputRange: [countColor, textFlashToColor],
    });

    return (
        <Animated.View style={[styles.countContainer, { backgroundColor: animatedCircleColor }]}>
            <Animated.Text style={[styles.countText, { color: animatedCountColor }]}>
                {children}
            </Animated.Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    countContainer: {
        height: 24,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        textAlign: 'center',
    },
    countText: {
        fontFamily: 'Poppins-Bold',
    },
});

export default FlashAmin;
