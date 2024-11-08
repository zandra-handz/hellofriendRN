import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg';

const ButtonIconMoments = ({
    iconSize = 36,
    iconColor = 'black',
    countColor = 'white',
    circleColor = 'red',
    countTextSize = 12,
    onPress,
}) => {
    const { capsuleCount } = useCapsuleList();
    const bobbingValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateBobbing = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bobbingValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bobbingValue, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateBobbing();
    }, [bobbingValue]); 

    const bobbingStyle = {
        transform: [
            {
                translateY: bobbingValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                }),
            },
        ],
    };

    return (
        <TouchableOpacity onPress={onPress ? onPress : () => {}} style={styles.container}>
            <Animated.View style={[styles.animatedContainer, bobbingStyle]}>
                <ThoughtBubbleOutlineSvg height={iconSize} width={iconSize} color={iconColor} />
                <View style={{ top: '-17%', right: '27%' }}>
                    <View
                        style={{
                            height: countTextSize * 2,
                            width: countTextSize * 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: circleColor,
                            textAlign: 'center',
                            borderRadius: 16,
                        }}
                    >
                        <Text style={[styles.countText, { color: countColor, fontSize: countTextSize }]}>
                            {capsuleCount}
                        </Text>
                    </View>
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
    countText: {
        fontFamily: 'Poppins-Bold',
    },
});

export default ButtonIconMoments;
