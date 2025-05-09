import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import ButtonSignOut from '../buttons/users/ButtonSignOut';
  
import AlertConfirm from '../alerts/AlertConfirm'; 
import { useNavigationState } from '@react-navigation/native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; // Import the context hook
import { useFriendList } from '@/src/context/FriendListContext';
import ButtonSpecialAlert from '../buttons/scaffolding/ButtonSpecialAlert';
import { Dimensions } from 'react-native';

export default function HelloFriendFooterOneButton( { onPress, onPressRightSide, buttonText}) {
    const navigationState = useNavigationState(state => state);
    const currentRouteName = navigationState.routes[navigationState.index]?.name;
 
    const { themeStyles } = useGlobalStyle();  
    const { friendList } = useFriendList();
    const [footerHeight, setFooterHeight] = useState(Dimensions.get('window').height * 0.08);
    
    useEffect(() => {
        const handleResize = () => {
            const { height } = Dimensions.get('window');
            setFooterHeight(height * 0.08); // Update footer height on resize
        };

        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => subscription?.remove(); // Clean up the listener
    }, []);

    return (
        <View
        style={[
            styles.container,
            themeStyles.footerContainer,
            { height: footerHeight, paddingBottom: Platform.OS === 'ios' ? 10 : 0 } // Dynamic padding
        ]}
    >
            {friendList.length < 1 ? (
                <View style={styles.section}>
                    <ButtonSignOut
                        icon="logout"  
                        confirmationAlert={true}
                        modal={AlertConfirm}
                    />
                </View>
            ) : (
                <>
                <View style={styles.section}>
                    <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                        <>
                        <Text style={[styles.buttonText, themeStyles.subHeaderText]}>Exit</Text>
                        
                        </>
                        <View style={{paddingLeft: 4}}>
                        <View style={styles.section}>
                                <ButtonSignOut
                                    icon="logout"  
                                    confirmationAlert={true}
                                    modal={AlertConfirm}
                                />
                            </View>
                        
                        </View>
                        </TouchableOpacity> 
                </View>

                <View style={[styles.divider, themeStyles.divider]} />

                <View style={styles.section}>
                <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                    <>
                    <Text style={[styles.buttonText, themeStyles.subHeaderText]}>{buttonText}</Text>
                    </>
                    <View style={{paddingLeft: 4}}>
                    <ButtonSpecialAlert 
                        size={24}
                        onPress={() => {}}
                    />
                    
                    </View>
                    </TouchableOpacity> 
            </View>
            </>
            )}
 

        

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',  
        width: '100%',
        position: 'absolute',
        bottom: 0, 
        zIndex: 1,
    },
    section: { 
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',  
    },
    divider: { 
        marginVertical: 10,
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',

    },
});