import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonGoToAddMoment from '../components/ButtonGoToAddMoment';
import { LinearGradient } from 'expo-linear-gradient'; 

import  { useSelectedFriend } from '../context/SelectedFriendContext';

const ScreenMoments = ({ route, navigation }) => {
    const { themeStyles, gradientColors } = useGlobalStyle(); 
    const {calculatedThemeColors} = useSelectedFriend();
    const { capsuleList } = useCapsuleList();
    const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false); // State to trigger update
    const [checkboxesParent, setCheckboxesParent] = useState(false);
    const [ changesParent, setChangesParent ] = useState(false);

    const toggleCheckboxesParent = () => {
        console.log('checkbox toggle tracker in parent: ', checkboxesParent);
        setCheckboxesParent(!checkboxesParent);

    };

    const checkChangesParent = () => {
        console.log('changetoggle tracker in parent: ', checkboxesParent);
        setChangesParent(!changesParent);
    };

    useEffect(() => {
        if (capsuleList.length > 0) {
            setIsCapsuleListReady(true);
        }
    }, [capsuleList]);

    useEffect(() => {
        
        if (checkboxesParent !== false && changesParent) {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();



            Alert.alert(
                '',
                'Do you want to save your changes before leaving?',
                [
                    { 
                        text: 'Yes', 
                        style: 'destructive',
                        onPress: () => {
                            setTriggerUpdate(prev => !prev); // Trigger the save function
                            navigation.dispatch(e.data.action); // Navigate away
                        }
                    },
                    { 
                        text: 'No', 
                        style: 'default',
                        onPress: () => navigation.dispatch(e.data.action) // Navigate away without saving
                    }
                ]
            );
        
        });

        return unsubscribe;
    };
    }, [navigation, checkboxesParent,changesParent]);

    return ( 
        
        <LinearGradient
            colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, themeStyles.signinContainer]}
        >
                <View style={{flex: 1, width: '100%'}}>
                    {isCapsuleListReady ? (
                        <>  
                        <ItemMomentMultiPlain 
                            triggerUpdate={triggerUpdate} 
                            parentCheckboxesTracker={toggleCheckboxesParent} 
                            parentChangesTracker={checkChangesParent} />
                      
                        <ButtonGoToAddMoment buttonColor={calculatedThemeColors.darkColor}/>
                        </>
                        
                    ) : (
                        <Text></Text>
                    )}
                </View> 
            </LinearGradient> 
            )
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        padding: 0,
        justifyContent: 'space-between',
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    modalContent: {
        width: '100%', 
        justifyContent: 'space-around',
        alignContent: 'center',
        borderRadius: 0,
        padding: 4,
        paddingTop:50,
        height: '100%',
        maxHeight: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ScreenMoments;
