import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const InputSingleValue = ({ valueRef, handleValueChange, label = 'label', placeholder = 'placeholder', inline=false }) => {
    const [value, setValue] = useState('');

    const onChangeText = (newValue) => {
        setValue(newValue);
        handleValueChange(newValue); // Notify parent of the change
    };

    return (
        <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>
                {label}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={valueRef}
                    style={styles.textInput}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText} // Update internal state and notify parent
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    locationContainer: {

        flexDirection: 'row', 
        alignItems: 'center',

        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 0, 
        marginVertical: 0,
    },
    locationTitle: {

        marginRight: 10,

        fontSize: 16,
        fontFamily: 'Poppins-Bold',

    },
    inputContainer: {
        
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        marginVertical: 0,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        fontFamily: 'Poppins-Regular',
    },
});

export default InputSingleValue;
