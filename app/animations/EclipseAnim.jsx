import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';

const EclipseAnim = ({ children, borderRadius=40, innerColor='#000000', marginVertical='0%', color='163805', speed = 100, delay = 300 }) => {
    const { loadingNewFriend, friendLoaded, errorLoadingFriend } = useSelectedFriend();
    const screenWidth = Dimensions.get('window').width;
    const glintAnim = useRef(new Animated.Value(screenWidth)).current; // Start off-screen to the right

    useEffect(() => {
        const animateGlint = () => {
            if (loadingNewFriend) {
                glintAnim.setValue(screenWidth);  
                Animated.timing(glintAnim, {
                    toValue: 0, 
                    duration: speed,
                    useNativeDriver: true,
                }).start();
            }

            if (friendLoaded || errorLoadingFriend) { 
                setTimeout(() => {
                    Animated.timing(glintAnim, {
                        toValue: -screenWidth,  
                        duration: speed,
                        useNativeDriver: true,
                    }).start();
                }, delay);
            }
        };

        animateGlint();
    }, [loadingNewFriend, friendLoaded, errorLoadingFriend, glintAnim, speed, screenWidth]);

    return (
        <View style={styles.container}>
            {children}
            <Animated.View
                style={[
                    styles.glintOverlay,
                    { borderRadius: borderRadius, transform: [{ translateX: glintAnim }] },
                ]}
            >
                <LinearGradient
                    colors={[innerColor, innerColor, innerColor]}
                    locations={[0, 0.008, .9]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.eclipseGradient, { marginVertical: marginVertical, width: '200%' }]} 
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        height: '100%',
    },
    glintOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    eclipseGradient: {
        height: '100%',
    },
});

export default EclipseAnim;
