import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useCapsuleList } from '@/src/context/CapsuleListContext'; 
import LocationHeartOutlineSvg from '@/app/assets/svgs/location-heart-outline.svg';
 
const ButtonIconLocations = ({
    iconSize = 36,
    iconColor = 'black',
    countColor = 'white', 
    countTextSize = 12,
    onPress,
}) => {
    const { capsuleCount } = useCapsuleList();
    const arrowMove = useRef(new Animated.Value(0)).current;
    const arrowOpacity = useRef(new Animated.Value(0)).current; // Arrow opacity control

    useEffect(() => {
        // Animate the directional arrow movement with opacity control
        const animateArrowMovement = () => {
            Animated.loop(
                Animated.sequence([
                    // Arrow move to the right and fade in
                    Animated.timing(arrowOpacity, {
                        toValue: 1, // Arrow becomes visible
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(arrowMove, {
                        toValue: 30, // Move the arrow to the right
                        duration: 500, // Smooth and gradual move
                        useNativeDriver: true,
                    }),
                    // Arrow disappears while it moves left
                    Animated.timing(arrowOpacity, {
                        toValue: 0, // Arrow fades out
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    // Reset arrow to the leftmost position and make it invisible
                    Animated.timing(arrowMove, {
                        toValue: 0, // Reset arrow position
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateArrowMovement();
    }, [arrowMove, arrowOpacity]);

    const arrowStyle = {
        transform: [
            {
                translateX: arrowMove,
            },
        ],
        opacity: arrowOpacity, // Apply the opacity change for arrow visibility
    };

    return (
        <TouchableOpacity onPress={onPress ? onPress : () => {}} style={styles.container}>
            <View style={styles.animatedContainer}>
                <LocationHeartOutlineSvg height={iconSize} width={iconSize} color={iconColor} />
                
                <Animated.View style={[styles.arrowContainer, arrowStyle]}>
                    <Text style={styles.arrowText}>→</Text>
                </Animated.View>
                
                <View style={{ top: '-17%', right: '27%' }}>
                    <View
                        style={{
                            height: countTextSize * 2,
                            width: countTextSize * 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            borderRadius: 16,
                        }}
                    >
                        <Text style={[styles.countText, { color: countColor, fontSize: countTextSize }]}>
                             
                        </Text>
                    </View>
                </View>
            </View>
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
    arrowContainer: {
        position: 'absolute',
        top: '50%', // Position it just below the icon for visual appeal
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -12 }], // Adjusted to center the arrow vertically
    },
    arrowText: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
    },
    countText: {
        fontFamily: 'Poppins-Bold',
    },
});

export default ButtonIconLocations;
