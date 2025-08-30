import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLDTheme } from '@/src/context/LDThemeContext';
import CalculateTravelTimesBody from '@/app/components/locations/CalculateTravelTimesBody';
import { useRoute } from '@react-navigation/native'; 
 
const ScreenCalculateTravelTimes = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null;
    const currentLocation = route.params?.currentLocation ?? null;
    const { lightDarkTheme } = useLDTheme();

 


    return (
        <View style={styles.container}>
            <CalculateTravelTimesBody lightDarkTheme={lightDarkTheme} location={location} currentLocation={currentLocation} />
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
