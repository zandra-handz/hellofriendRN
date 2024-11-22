 

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
 

import ContentMomentFocus from '../components/ContentMomentFocus';
 
const ScreenMomentFocus = ( ) => { 

    const { themeStyles } = useGlobalStyle(); 


     
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentMomentFocus />
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
