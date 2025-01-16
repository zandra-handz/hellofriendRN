

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useNavigation, useRoute } from '@react-navigation/native'; 
import LocationSaveBody from '../components/LocationSaveBody';
import { useLocations } from '../context/LocationsContext';

// import useLocationFunctions from '../hooks/useLocationFunctions';
 
const ScreenLocationSave = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null;  

    const navigation = useNavigation();

    const {themeStyles} = useGlobalStyle(); 
    const { createLocationMutation } = useLocations();


useEffect(() => {
    if (createLocationMutation.isSuccess) {
        navigation.goBack();
    };


}, [createLocationMutation]);
 

    return (
        <View style={[styles.container, themeStyles.container]}> 

            <LocationSaveBody title={location.title} address={location.address} />

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

export default ScreenLocationSave;