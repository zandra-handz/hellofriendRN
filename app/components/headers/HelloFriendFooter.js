import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ButtonSignOut from '../buttons/users/ButtonSignOut';
import ButtonSettings from '../buttons/users/ButtonSettings';
import ButtonFriendAddresses from '../buttons/locations/ButtonFriendAddresses';
import ButtonUser from '../buttons/users/ButtonUser';
import ButtonData from '../buttons/scaffolding/ButtonData'; 
import AlertConfirm from '../alerts/AlertConfirm'; 
import { useNavigationState } from '@react-navigation/native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; // Import the context hook

import { Dimensions } from 'react-native';

export default function HelloFriendFooter() {
    const navigationState = useNavigationState(state => state);
    const currentRouteName = navigationState.routes[navigationState.index]?.name;
    const isOnActionPage = currentRouteName === 'hellofriend';
    const { themeStyles } = useGlobalStyle();  
    const [footerHeight, setFooterHeight] = useState(Dimensions.get('window').height * 0.074);
    
    useEffect(() => {
        const handleResize = () => {
            const { height } = Dimensions.get('window');
            setFooterHeight(height * 0.074); // Update footer height on resize
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
            {isOnActionPage ? (
                <View style={styles.section}>
                    <ButtonSignOut
                        icon="logout"  
                        confirmationAlert={true}
                        modal={AlertConfirm}
                    />
                </View>
            ) : (
                <View style={styles.section}>
                    <ButtonData />
                </View>
            )}

            <View style={[styles.divider, themeStyles.divider]} />
            <>

            <View style={styles.section}>
                
            {isOnActionPage ? ( 
                    <ButtonSettings />  
                ): ( 
                    <ButtonFriendAddresses />  
                )}
            </View>
            </>

            <View style={[styles.divider, themeStyles.divider]} />
            <> 
            <View style={styles.section}> 
                    <ButtonUser /> 
            
            </View>
            </>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',  
        width: '100%',
        //position: 'absolute',
        bottom: 0, 
        zIndex: 1,
        minHeight: 60,
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
});