import React, { forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputAnyValue = forwardRef(({ value, setValue, placeholder, errorMessage, isError }, ref) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={ref}
                    style={[styles.textInput, isError && styles.errorInput]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={setValue}
                />
                {isError && value.length > 0 && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 8,
    },
    inputContainer: {
        justifyContent: 'center',
        width: '100%',
        marginVertical: 4,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 16,
        padding: 10,
        fontFamily: 'Poppins-Regular',
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
