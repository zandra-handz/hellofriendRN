 

import React from 'react';
import { View, StyleSheet } from 'react-native';
 
import ContentAddHello from '../components/ContentAddHello';
 
 
const ScreenAddHello = () => { 
 
    return (
        <View style={styles.container}> 
            <View style={styles.mainContainer}> 
                <ContentAddHello />
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

export default ScreenAddHello;