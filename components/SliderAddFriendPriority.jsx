import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SliderInputOnboarding from '../onboarding/SliderInputOnboarding';

const SliderAddFriendPriority = ({ friendPriority, setFriendPriority }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Priority placed on friendship</Text>
        <SliderInputOnboarding
            value={friendPriority}
            onValueChange={setFriendPriority}
            min={1}
            max={3}
            messages={{
                1: 'High',
                2: 'Medium',
                3: 'Unworried'
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

export default SliderAddFriendPriority;
