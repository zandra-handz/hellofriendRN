import React, { useEffect, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputAnyValue from '../appwide/input/InputAnyValue';  

const InputMidpointKeyword = forwardRef(({ searchKeyword, labelStyle, setSearchKeyword }, ref) => {
    useEffect(() => {
        if (ref && ref.current) {
            ref.current.focus();  // Automatically focus the input field when the component mounts
        }
    }, [ref]);

    return (
        <View style={styles.container}>
            <Text style={[styles.inputLabel, labelStyle]}>Search Keyword</Text>
            <InputAnyValue
                ref={ref}
                value={searchKeyword}
                setValue={setSearchKeyword}
                placeholder="'Coffee', 'Diner', 'Bookstore', etc"
                errorMessage="Keyword is required"
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    inputLabel: { 
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default InputMidpointKeyword;
