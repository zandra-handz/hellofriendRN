 

import React from 'react';
import { View, StyleSheet } from 'react-native';  
import ContentAddFriend from '../components/ContentAddFriend';

import { useGlobalStyle } from '../context/GlobalStyleContext';
 
const ScreenAddFriend = () => { 

    const { themeStyles } = useGlobalStyle();
   

    return (
        <View style={[styles.container, themeStyles.container]}> 
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
