 

import React from 'react';
import { View, StyleSheet } from 'react-native';  
import ContentAddFriend from '../components/ContentAddFriend';
 
const ScreenAddFriend = () => { 
   

    return (
        <View style={styles.container}> 
            <View style={styles.mainContainer}> 
                <ContentAddFriend />
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

export default ScreenAddFriend;
