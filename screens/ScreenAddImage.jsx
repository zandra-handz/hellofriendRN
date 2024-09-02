 

import React from 'react';
import { View, StyleSheet } from 'react-native';
 
import ContentAddImage from '../components/ContentAddImage';

const ScreenAddImage = () => {  
     
    return (
        <View style={styles.container}> 
            <View style={styles.mainContainer}> 
                <ContentAddImage />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    mainContainer: {
        flex: 1,
        paddingBottom: 10,
    },  
});

export default ScreenAddImage;