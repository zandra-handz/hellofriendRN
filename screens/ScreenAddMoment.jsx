 

import React from 'react';
import { View, StyleSheet } from 'react-native';
 
import ContentAddMoment from '../components/ContentAddMoment';
 
const ScreenAddMoment = ( ) => { 

     
    return (
        <View style={styles.container}> 
            <View style={styles.mainContainer}> 
                <ContentAddMoment />
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

export default ScreenAddMoment;
