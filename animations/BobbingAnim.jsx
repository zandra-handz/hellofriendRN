// BobbingEffect.js
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const BobbingAnim = ({ children, bobbingDistance = 5, duration = 1000 }) => {
    const bobbingValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateBobbing = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bobbingValue, {
                        toValue: 1,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bobbingValue, {
                        toValue: 0,
                        duration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateBobbing();
    }, [bobbingValue, duration]);

    const bobbingStyle = {
        transform: [
            {
                translateY: bobbingValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -bobbingDistance],
                }),
            },
        ],
    };

    return <Animated.View style={bobbingStyle}>{children}</Animated.View>;
};

export default BobbingAnim;
