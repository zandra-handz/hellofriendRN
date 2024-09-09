import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonSignOut from './ButtonSignOut';
import ButtonSettings from './ButtonSettings';
import ButtonInfo from './ButtonInfo';
import ButtonData from './ButtonData';
import ButtonColors from '../components/ButtonColors';
import AlertConfirm from './AlertConfirm'; 
import { useNavigationState } from '@react-navigation/native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import the context hook

export default function HelloFriendFooter() {
    const navigationState = useNavigationState(state => state);
    const currentRouteName = navigationState.routes[navigationState.index]?.name;
    const isOnActionPage = currentRouteName === 'hellofriend';
    const { themeStyles } = useGlobalStyle(); // Get the theme styles from context

    return (
        <View style={[styles.container, themeStyles.footerContainer]}>
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

            <ButtonSettings />

            <View style={[styles.divider, themeStyles.divider]} />
            <> 
            {isOnActionPage ? (
                <ButtonInfo />
            ): (
                <ButtonColors />
            )}
            </>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        height: 46,
        width: '100%',
        marginBottom: 0,
        padding: 8,
        paddingTop: 12,
    },
    section: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: { 
        marginVertical: 6,
    },
});