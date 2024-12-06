 

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import TextEditBox from '../components/TextEditBox';
import { useNavigation, useRoute } from '@react-navigation/native'; 
 
 import useLocationFunctions from '../hooks/useLocationFunctions';
 
const ScreenLocationEdit = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null; 
    const notes = route.params?.notes?? null;
    const parking = route.params?.parking ?? null;

    const { handleUpdateLocation } = useLocationFunctions();
    const {themeStyles} = useGlobalStyle(); 

 //weekdayTextData is coming from LocationHoursOfOperation component
    
 const handlePress = () => {
    handleUpdateLocation(location.id, { personal_experience_info: 'hihihihihihihi' });
};

    return (
        <View style={[styles.container, themeStyles.container]}> 
                <TextEditBox
                title={'Edit notes'}
                startingText={notes}
                />

            <TouchableOpacity style={{width: 40, height: 40, backgroundColor: 'limegreen'}} onPress={handlePress} />
      
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

export default ScreenLocationEdit;