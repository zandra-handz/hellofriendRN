import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const ButtonsOnboardingNav = ({ showPrevButton, showNextButton, onPrevPress, onNextPress, iconColor }) => {
    return (
        <View style={styles.container}>
            {showPrevButton && (
                <TouchableOpacity onPress={onPrevPress}>
                    <FontAwesome name="angle-left" size={46} color="black" />
                    
                </TouchableOpacity>
            )}

            {showNextButton ? (
                <TouchableOpacity onPress={onNextPress} style={styles.nextButton}>
                    <FontAwesome name="angle-right" size={46} color={iconColor} />
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
    },
    nextButton: {
        borderWidth: 0,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: 'transparent', // Light gray color
    },
});

export default ButtonsOnboardingNav;
