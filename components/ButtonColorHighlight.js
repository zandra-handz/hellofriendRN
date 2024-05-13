import React from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

const ButtonColorHighlight = ({ onPress, title }) => (
    <TouchableHighlight
        style={styles.buttonContainer}
        onPress={onPress}
        underlayColor="hotpink" // Set the underlay color to hot pink
    >
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableHighlight>
);

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ButtonColorHighlight;
