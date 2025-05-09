import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider'; 


const SliderBase = ({ value, onValueChange, labelStyle, min, max, messages, label }) => {
    const selectedMessage = messages ? messages[Math.round(value)] : null; // Get the corresponding message if messages are provided

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                value={value}
                onValueChange={onValueChange}
                step={1}
                thumbTintColor="limegreen"  
                minimumTrackTintColor="limegreen" 
            />
            {selectedMessage && <Text style={[styles.value, labelStyle]}>{selectedMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
    },
    label: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 0,
        fontFamily: 'Poppins-Regular',
        
    },
    slider: {
        marginHorizontal: 0,  
        marginBottom: 20,
        marginTop: 6,
    },
    value: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
});

export default SliderBase;
