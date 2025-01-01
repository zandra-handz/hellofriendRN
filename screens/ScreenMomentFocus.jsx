 

import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useRoute } from '@react-navigation/native'; 

import ContentMomentFocus from '../components/ContentMomentFocus';
 
const ScreenMomentFocus = ( ) => { 
        const route = useRoute();
        const momentText = route.params?.momentText ?? null;  

    const { themeStyles } = useGlobalStyle(); 


     
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentMomentFocus momentText={momentText || null} />
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

export default ScreenMomentFocus;
