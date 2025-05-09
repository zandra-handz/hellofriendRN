import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider'; // Importing Slider from @react-native-community/slider

const SliderInputOnboarding = ({ value, onValueChange, min, max, messages, label }) => {
    const selectedMessage = messages ? messages[Math.round(value)] : null; // Get the corresponding message if messages are provided

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                value={value}
                onValueChange={onValueChange}
                step={1}
                thumbTintColor="limegreen" // Old: "#39f0df"  Set the thumb color to teal
                minimumTrackTintColor="limegreen" // Old: "#39f0df"  Set the track color to teal
            />
            {selectedMessage && <Text style={styles.value}>{selectedMessage}</Text>}
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

export default SliderInputOnboarding;
