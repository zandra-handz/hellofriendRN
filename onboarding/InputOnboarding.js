import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const InputOnboarding = forwardRef(({ value, onChangeText, placeholder, onFocus, onBlur, style, isFocused, inputRef, maxLength }, ref) => {
    return (
        <View>
            <TextInput
                ref={inputRef || ref} // Using inputRef if provided, otherwise fallback to ref
                style={[
                    styles.input,
                    (isFocused || value.trim().length > 0) ? styles.inputFocused : null,
                    style
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                maxLength={maxLength} // Add maxLength prop
            />
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        height: 44,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '100%',
        fontFamily: 'Poppins-Regular',
        color: 'black', 
    },
    inputFocused: {
        borderColor: '#ff69b4',  
        borderWidth: 2,
    },
});

export default InputOnboarding;
