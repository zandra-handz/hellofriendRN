import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelperTag = ({ helperText = 'Pls enter text', textColor = 'white', backgroundColor = 'rgba(0, 0, 0, 0.5)' }) => {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>{helperText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 30,
        padding: 4,
        justifyContent: 'center', // Centers the text inside the container
        alignItems: 'center', // Centers the text horizontally
    },
    text: {
        fontSize: 12,  
    },
});

export default HelperTag;
