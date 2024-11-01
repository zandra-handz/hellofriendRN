 

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useRoute } from '@react-navigation/native'; 
import ContentLocationView from '../components/ContentLocationView';
import ButtonGoToLocationFunctions from '../components/ButtonGoToLocationFunctions';

const ScreenLocation = ( ) => { 
    const route = useRoute();
    const location = route.params?.location ?? null; 

    const { themeStyles } = useGlobalStyle();

     
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentLocationView />
            <ButtonGoToLocationFunctions />
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
