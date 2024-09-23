 

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 
import ContentAddMoment from '../components/ContentAddMoment';
 
const ScreenAddMoment = ( ) => { 

    const { themeStyles } = useGlobalStyle();

     
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentAddMoment />
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
