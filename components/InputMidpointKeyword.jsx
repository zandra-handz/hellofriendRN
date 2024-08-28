import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputAnyValue from './InputAnyValue';  

const InputMidpointKeyword = ({ searchKeyword, setSearchKeyword }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.inputLabel}>Search Keyword</Text>
            <InputAnyValue
                value={searchKeyword}
                setValue={setSearchKeyword}
                placeholder="'Coffee', 'Diner', 'Bookstore', etc"
                errorMessage="Keyword is required"  
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
    },
    inputLabel: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default InputMidpointKeyword ;
