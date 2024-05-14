import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';



const InputOnboarding = ({ value, onChangeText, placeholder, onFocus, onBlur, style, isFocused }) => {
    return (
        <View>
            <TextInput
                style={[styles.input, isFocused && styles.inputFocused, style]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    input: {
        height: 44,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        fontFamily: 'Poppins-Regular',
        color: 'black', 
    },
    inputFocused: {
        borderColor: '#ff69b4',  
        borderWidth: 2,
    },
});


export default InputOnboarding;