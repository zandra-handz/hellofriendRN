import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputAnyValue = ({ value, setValue, placeholder, errorMessage, isError }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.inputContainer}>
                <TextInput
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
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginVertical: 8,
    },
    inputContainer: {
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 18,
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
