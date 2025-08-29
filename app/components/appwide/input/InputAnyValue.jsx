import React, { forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
 
const InputAnyValue = forwardRef(({ primaryColor='red', value, setValue, placeholder, errorMessage, isError }, ref) => {
    
 
    
    return ( 
            <View style={[styles.inputContainer,  {borderColor: primaryColor}]}>
                <TextInput
                    ref={ref}
                    style={[  isError && styles.errorInput, {color: primaryColor}]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={primaryColor}
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
