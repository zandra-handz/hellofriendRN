import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const TextAreaOnboarding = forwardRef(({ value, onChangeText, placeholder, onFocus, onBlur, style, isFocused, inputRef, maxLength }, ref) => {
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
                multiline // Allow multiline input
                numberOfLines={4} // Adjust as needed
                textAlignVertical="top" // Align text to top-left corner
                maxLength={maxLength} // Limit the number of characters
            />
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        height: 100, // Adjust height for the textarea
        borderWidth: 1,
        padding: 16,
        borderRadius: 30,
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

export default TextAreaOnboarding;
