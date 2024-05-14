import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const ButtonsOnboardingNav = ({ showPrevButton, showNextButton, onPrevPress, onNextPress, iconColor }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {showPrevButton && (
                <TouchableOpacity onPress={onPrevPress}>
                    <FontAwesome name="angle-left" size={34} color="black" />
                </TouchableOpacity>
            )}

            {showNextButton && (
                <TouchableOpacity onPress={onNextPress} style={{ borderWidth: 0, borderRadius: 5 }}>
                    <FontAwesome name="angle-right" size={34} color={iconColor} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ButtonsOnboardingNav;
