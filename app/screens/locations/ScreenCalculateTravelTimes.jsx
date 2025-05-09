import React from 'react';
import { View, StyleSheet } from 'react-native';

import CalculateTravelTimesBody from '@/app/components/locations/CalculateTravelTimesBody';
import { useRoute } from '@react-navigation/native'; 
import { useFriendList } from '@/src/context/FriendListContext';

const ScreenCalculateTravelTimes = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null;
    const currentLocation = route.params?.currentLocation ?? null;


     updateSafeViewGradient(true);


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
