 

import React from 'react';
import { StyleSheet } from 'react-native';  
import ContentAddHello from '@/app/components/helloes/ContentAddHello';
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
 
 
const ScreenAddHello = () => { 


 
      const { themeAheadOfLoading, updateSafeViewGradient} = useFriendList(); 

      updateSafeViewGradient(true);

 
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