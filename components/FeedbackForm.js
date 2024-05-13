import * as React from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text } from 'react-native';

export default function FeedbackForm() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headingSection}>
                How was your visit to Little Lemon?
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#49SE57'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#EDEFEE',
        backgroundColor: '#F4CE14',
    },
    messageInput: {
        height: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#F4CE14'
    },
})