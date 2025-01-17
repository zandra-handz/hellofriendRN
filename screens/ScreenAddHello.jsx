 

import React from 'react';
import { StyleSheet } from 'react-native'; 
import ContentAddHello from '../components/ContentAddHello';

import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "../context/FriendListContext";
 
 
const ScreenAddHello = () => { 


 
      const { themeAheadOfLoading } = useFriendList(); 

 
    return (
            <LinearGradient
              colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.container]}
            >
            <ContentAddHello /> 
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        width: '100%',
        justifyContent: 'space-between', 
    }, 
});

export default ScreenAddHello;