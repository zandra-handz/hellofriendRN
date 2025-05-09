import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageOnboardingNote = ({ firstValue, secondValue, marginTop, marginBottom }) => {
    return (
        <View style={[styles.container, { marginTop, marginBottom }]}>
            <Text style={styles.bold}>{firstValue}</Text>
            <Text style={styles.message}>{secondValue}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    bold: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Regular',
        marginBottom: 5,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
});

export default MessageOnboardingNote;
