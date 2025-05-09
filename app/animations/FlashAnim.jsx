
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const FlashAmin = ({
    children,
    circleTextSize = 11,
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
        <Animated.View style={[styles.countContainer, { height: circleTextSize * 2, width: circleTextSize * 2, backgroundColor: animatedCircleColor }]}>
            <Animated.Text style={[styles.countText, { color: animatedCountColor, fontSize: circleTextSize }]}>
                {children}
            </Animated.Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    countContainer: { 
        alignItems: 'center',
        alignContents: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        textAlign: 'center',
    },
    countText: {
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
    },
});

export default FlashAmin;
