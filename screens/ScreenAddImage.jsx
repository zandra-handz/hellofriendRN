 

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useGlobalStyle } from '../context/GlobalStyleContext';

import ContentAddImage from '../components/ContentAddImage';

const ScreenAddImage = () => {  

    const {themeStyles} = useGlobalStyle();
     
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <View style={styles.mainContainer}> 
                <ContentAddImage />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 10,
    },
    mainContainer: {
        flex: 1,
        paddingBottom: 10,
    },  
});

export default ScreenAddImage;