import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const ShadowInAnim = ({ 
    children, 
    duration = 1000, 
    darkColor = 'rgba(0, 0, 0, 0.5)',  
}) => {
    const widthAnim = useRef(new Animated.Value(0)).current; // For expanding the first overlay
    const newWidthAnim = useRef(new Animated.Value(1)).current; // For shrinking the second overlay
    const { loadingNewFriend, friendLoaded, selectedFriend } = useSelectedFriend();
    const [disappear, setDisappear] = useState(false);

     useEffect(() => {
        if (friendLoaded) {
            setDisappear(true);  
        }
    }, [friendLoaded]);

    useEffect(() => {
        const animateOverlay = () => {
            if (loadingNewFriend && selectedFriend) {
                // First animation: Expand the overlay (0% to 100%) when friend is loading
                Animated.timing(widthAnim, {
                    toValue: 1, // Expand the overlay
                    duration,
                    useNativeDriver: false,
                }).start();
            } else if (disappear) {
                // Second animation: Shrink the overlay (100% to 0%) after friend is loaded
                Animated.timing(newWidthAnim, {
                    toValue: 0, 
                    duration,
                    useNativeDriver: false,
                }).start();
            }
        };

        animateOverlay();
    }, [loadingNewFriend, selectedFriend, disappear, widthAnim, newWidthAnim, duration]);

    // Change color when the second animation is running
    const secondOverlayColor = newWidthAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 0, 0, 0.5)', darkColor], // Red during shrinking, darkColor otherwise
    });

    return (
        <View style={styles.container}>
            {children} 
            
            <Animated.View
                style={[
                    styles.darkenOverlay,
                    {
                        backgroundColor: darkColor,
                        width: widthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '200%'],
                        }),
                    },
                ]}
            />
            {/* Second overlay animation (shrinking from the left) */}
            <Animated.View
                style={[
                    styles.darkenOverlayLeftShrink, // Ensure it shrinks from the left side
                    {
                        backgroundColor: secondOverlayColor, // Use the dynamic color for the second overlay
                        width: newWidthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['100%', '0%'], // Shrink from left side (100% to 0%)
                        }),
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    darkenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    // Updated style to position the shrinking overlay from the left side
    darkenOverlayLeftShrink: {
        position: 'absolute',
        top: 0,
        left: 0,  // Ensure it starts shrinking from the left
        bottom: 0,
    },
});

export default ShadowInAnim;
