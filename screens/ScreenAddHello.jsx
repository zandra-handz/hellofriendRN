 

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 
import ContentAddHello from '../components/ContentAddHello';
 
 
const ScreenAddHello = () => { 

    const {themeStyles} = useGlobalStyle();
 
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentAddHello /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        justifyContent: 'space-between',
        paddingHorizontal: 4, 
    }, 
});

export default ScreenAddHello;