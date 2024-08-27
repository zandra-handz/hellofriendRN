import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SliderInputOnboarding from '../onboarding/SliderInputOnboarding';

const SliderAddFriendEffort = ({ friendEffort, setFriendEffort }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Effort needed to maintain friendship</Text>
        <SliderInputOnboarding
            value={friendEffort}
            onValueChange={setFriendEffort}
            min={1}
            max={5}
            messages={{
                1: 'Check in twice a year',
                2: 'Check in every 60-90 days',
                3: 'Check in every month',
                4: 'Check in every two weeks',
                5: 'Check in every few days'
            }}
        />
    </View>
);

const styles = StyleSheet.create({
    sectionContainer: {
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
    },
});

export default SliderAddFriendEffort;
