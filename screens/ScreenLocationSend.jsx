 

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import { useNavigation, useRoute } from '@react-navigation/native'; 
import LocationInviteBody from '../components/LocationInviteBody';

 
 
const ScreenLocationSend = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null; 
    const weekdayTextData = route.params?.weekdayTextData ?? null;
    const selectedDay = route.params?.selectedDay ?? null;

    const {themeStyles} = useGlobalStyle(); 

 //weekdayTextData is coming from LocationHoursOfOperation component
    
  
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <LocationInviteBody location={location} weekdayTextData={weekdayTextData} initiallySelectedDay={selectedDay} /> 
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

export default ScreenLocationSend;