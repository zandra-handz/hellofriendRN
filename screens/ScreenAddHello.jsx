 

import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ContentAddHello from '../components/ContentAddHello';
 
 
const ScreenAddHello = () => { 



    const {themeStyles} = useGlobalStyle();
    const { selectedFriend } = useSelectedFriend();
    const navigation = useNavigation();


    useEffect(() => {

       
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (selectedFriend) {  
           
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
            }
        }
        );
    
        return unsubscribe;  
    }, [navigation, selectedFriend]);
    
 
    return (
        <View style={[styles.container, themeStyles.container]}> 
            <ContentAddHello /> 
        </View>
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