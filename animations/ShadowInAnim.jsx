import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const ShadowInAnim = ({ 
    children, 
    duration = 1000, 
    darkColor = 'rgba(0, 0, 0, 0.5)',  
}) => {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const { loadingNewFriend, selectedFriend, friendLoaded } = useSelectedFriend();
    
    const [shouldDisappear, setShouldDisappear] = useState(false);

    // Run the expand animation when loadingNewFriend changes
    useEffect(() => {
        if (loadingNewFriend && selectedFriend) {
            setShouldDisappear(false);
            // When loading starts, animate expanding the overlay
            Animated.timing(widthAnim, {
                toValue: 1, // Expand to full width
                duration,
                useNativeDriver: false,
            }).start();
        } else if (friendLoaded) {
            // Once the friend is loaded, animate shrinking
            setShouldDisappear(true);
        }
    }, [loadingNewFriend, selectedFriend, friendLoaded, widthAnim, duration]);

    // Run the shrinking animation once the expand animation is complete and friendLoaded is true
    useEffect(() => {
        if (shouldDisappear) {
            // Animate the overlay shrinking back to 0% width
            Animated.timing(widthAnim, {
                toValue: 0, // Shrink the overlay
                duration,
                useNativeDriver: false,
            }).start();
        }
    }, [shouldDisappear, widthAnim, duration]);

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
                            outputRange: ['0%', '100%'],
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
        bottom: 0,
    },
});

export default ShadowInAnim;
