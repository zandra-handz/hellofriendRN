import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RowItemAddressSelect = ({ address, selectedAddress, handleAddressSelect }) => {
    const [rowColor, setRowColor] = useState('gray');

    const handlePress = () => {
        handleAddressSelect(address);
        console.log('pressed!'); // Call the function with the address
        // Optionally update row color or perform other actions
        setRowColor('lightblue'); // Example to highlight the selected row
    };

    return (
        <View style={[styles.row, { backgroundColor: rowColor }]}>
            <Text style={styles.name}>{address}</Text>
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.iconContainer}>
                    {/* Icon or other content can go here */}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'gray',
        borderRadius: 20,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    iconContainer: {
        // Add styles for the icon container if needed
    },
});

export default RowItemAddressSelect;
