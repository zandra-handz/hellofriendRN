import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const InputOnboarding = forwardRef(({ value, onChangeText, placeholder, onFocus, onBlur, style, isFocused, inputRef, maxLength }, ref) => {
    
    const { themeStyles } = useGlobalStyle();

    return ( 
            <TextInput
                ref={inputRef || ref} // Using inputRef if provided, otherwise fallback to ref
                style={[
                    styles.input, themeStyles.signinInput,
                    (isFocused || value.trim().length > 0) ? styles.inputFocused : null,
                    style
                ]}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor={themeStyles.signinInput.placeholderTextColor} 
                onFocus={onFocus}
                onBlur={onBlur}
                maxLength={maxLength} // Add maxLength prop
            /> 
    );
});

const styles = StyleSheet.create({
    input: {
        height: 'auto',
        borderWidth: .4,
        padding: 16,
        borderRadius: 10, 
        width: '100%',
        fontSize: 18,
        fontFamily: 'Poppins-Regular', 
    },
    inputFocused: {
        borderColor: '#ff69b4',  
        borderWidth: 2,
    },
});

export default InputOnboarding;
