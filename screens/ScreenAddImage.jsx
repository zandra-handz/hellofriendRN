 

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useRoute } from '@react-navigation/native'; 

import ContentAddImage from '../components/ContentAddImage';

const ScreenAddImage = () => {  
        const route = useRoute();
        const imageUri = route.params?.imageUri ?? false;  

    const {themeStyles} = useGlobalStyle();
     
    return (
        <View style={[styles.container, themeStyles.container]}>  
                <ContentAddImage imageUri={imageUri} /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 0,
    }, 
});

export default ScreenAddImage;