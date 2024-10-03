 

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useRoute } from '@react-navigation/native';
import ContentAddMoment from '../components/ContentAddMoment';
 
const ScreenAddMoment = ( ) => { 
    const route = useRoute();
    const momentText = route.params?.momentText ?? ''; // Get the passed text from the navigation params
    const handleTextUpdate = route.params?.handleTextUpdate ?? null; // Get the passed text from the navigation params
  
    const { themeStyles } = useGlobalStyle();

     
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentAddMoment momentText={momentText} updateTextInFocusScreen={handleTextUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 10,
        paddingBottom: 10,
    }, 
});

export default ScreenAddMoment;
