import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonSignOut from './ButtonSignOut';
import ButtonSettings from './ButtonSettings';
import ButtonInfo from './ButtonInfo'; // Import the ButtonInfo component
import AlertMicro from './AlertMicro';
import AlertConfirm from './AlertConfirm';
import ButtonToActionMode from './ButtonToActionMode';
import { useNavigationState } from '@react-navigation/native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import the context hook

export default function HelloFriendFooter() {
    const navigationState = useNavigationState(state => state);
    const currentRouteName = navigationState.routes[navigationState.index]?.name;
    const isOnActionPage = currentRouteName === 'hellofriend';
    const { themeStyles } = useGlobalStyle(); // Get the theme styles from context

    return (
        <View style={[styles.container, themeStyles.container]}>
            {isOnActionPage ? (
                <View style={styles.section}>
                    <ButtonSignOut
                        icon="logout"
                        iconOnly={false}
                        label="Logout"
                        confirmationAlert={true}
                        modal={AlertConfirm}
                    />
                </View>
            ) : (
                <View style={styles.section}>
                    <ButtonToActionMode iconName="arrow-left" navigateScreen="hellofriend" />
                </View>
            )}

            <View style={[styles.divider, themeStyles.divider]} />

            <ButtonSettings />

            <View style={[styles.divider, themeStyles.divider]} />
     
            <ButtonInfo />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 64,
        width: '100%',
        marginBottom: 0,
        padding: 10,
    },
    section: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        marginVertical: 10,
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 4,
    },
});