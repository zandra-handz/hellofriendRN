 

import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import ContentAddHello from '../components/ContentAddHello';
 
 
const ScreenAddHello = () => { 



    const {themeStyles} = useGlobalStyle();
    const navigation = useNavigation();


    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
    
            Alert.alert(
                '',
                'Changes made on this page will not be saved.',
                [
                    { 
                        text: 'Stay', 
                        style: 'destructive',
                        onPress: () => {    
                        }
                    },
                    { 
                        text: 'Continue', 
                        style: 'default',
                        onPress: () => navigation.dispatch(e.data.action) // Navigate away without saving
                    },
                ]  
            ); 
        });
    
        return unsubscribe;  
    }, [navigation]);
    
         

 
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