import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SliderBase from './SliderBase';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const SliderAddFriendEffort = ({ friendEffort, setFriendEffort }) => {
    const { themeStyles } = useGlobalStyle();
    
    
    return ( 
    <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, themeStyles.subHeaderText]}>Effort needed to maintain friendship</Text>
        <SliderBase
            value={friendEffort}
            onValueChange={setFriendEffort}
            labelStyle={themeStyles.subHeaderText}
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
};

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
