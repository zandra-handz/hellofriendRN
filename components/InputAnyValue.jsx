import React, { forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const InputAnyValue = forwardRef(({ value, setValue, placeholder, errorMessage, isError }, ref) => {
    
    const { themeStyles } = useGlobalStyle();
    
    return ( 
            <View style={[styles.inputContainer, themeStyles.genericTextBackgroundShadeTwo, {borderColor: themeStyles.genericText.color}]}>
                <TextInput
                    ref={ref}
                    style={[themeStyles.genericText, isError && styles.errorInput]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={themeStyles.genericText}
                    onChangeText={setValue}
                />
                {isError && value.length > 0 && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}
            </View> 
    );
});

const styles = StyleSheet.create({
 
    inputContainer: {
        justifyContent: 'center',
        width: '100%', 
        borderRadius: 20,
        paddingHorizontal: '2%',
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 16,
        padding: 10, 
        
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
});

export default InputAnyValue;
