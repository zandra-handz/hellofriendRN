 

import React from 'react';
import { View, StyleSheet } from 'react-native'; 
import { useRoute } from '@react-navigation/native'; 
import ContentLocationView from '@/app/components/locations/ContentLocationView'; 
 
const ScreenLocation = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null; 
    const favorite = route.params?.favorite ?? false; 
 
 

     
    return (
        <View style={[styles.container ]}> 
            <ContentLocationView location={location} favorite={favorite} />
          
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 0,
        paddingBottom: 0,
    }, 
});

export default ScreenLocation;
