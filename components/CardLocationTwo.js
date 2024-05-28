import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CardLocationTwo = ({ title, address, notes, latitude, longitude, friendsCount, friends, isSelected, setSelectedLocation }) => {
    const handlePress = () => {
        // Store the selected location in the parent component
        setSelectedLocation({ title, address, notes, latitude, longitude, friendsCount, friends });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={[styles.container, isSelected && styles.selectedContainer]}>
                <Text style={styles.title}>{title}</Text>
                <Text>{address}</Text>
                {/* Other content */}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
    },
    selectedContainer: {
        backgroundColor: 'lightgray',
    },
    title: {
        fontWeight: 'bold',
    },
});

export default CardLocationTwo;
