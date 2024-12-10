import React from 'react';
import { View, StyleSheet } from 'react-native';

import CalculateTravelTimesBody from '../components/CalculateTravelTimesBody';
import { useRoute } from '@react-navigation/native'; 


const ScreenCalculateTravelTimes = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null;
    const currentLocation = route.params?.currentLocation ?? null;


    return (
        <View style={styles.container}>
            <CalculateTravelTimesBody location={location} currentLocation={currentLocation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        width: '100%',
        justifyContent: 'space-between', 
    }, 
});

export default ScreenCalculateTravelTimes;
