import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const InputSingleValue = ({ valueRef, handleValueChange, label = 'label', placeholder = 'placeholder', inline=false }) => {
    const [value, setValue] = useState('');
    const { themeStyles } = useGlobalStyle();

    const onChangeText = (newValue) => {
        setValue(newValue);
        handleValueChange(newValue);  
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
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
    container: {

        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 8, 
    },
    title: {

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
