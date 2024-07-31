import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useAuthUser } from './AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import { AccessibilityInfo, useColorScheme } from 'react-native';

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
    const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
    const colorScheme = useColorScheme();

    const [styles, setStyles] = useState({
        fontSize: 16,
        highContrast: false,
        screenReader: false,
        receiveNotifications: false,
        theme: colorScheme || 'light',
    });
    useEffect(() => {
        if (authUserState.authenticated && userAppSettings) {
            // Determine the theme based on `userAppSettings.manual_dark_mode` and `colorScheme`
            const determineTheme = () => {
                if (userAppSettings.manual_dark_mode !== null) {
                    return userAppSettings.manual_dark_mode ? 'dark' : 'light';
                }
                return colorScheme || 'light';
            };
    
            setStyles(prevStyles => ({
                ...prevStyles,
                fontSize: userAppSettings.large_text ? 20 : 16,
                highContrast: userAppSettings.high_contrast_mode,
                screenReader: userAppSettings.screen_reader,
                receiveNotifications: userAppSettings.receive_notifications,
                theme: determineTheme(),
            }));
        } else {
            // Fallback to default styles if user is not authenticated
            setStyles(prevStyles => ({
                ...prevStyles,
                theme: colorScheme || 'light',
            }));
        }
    }, [authUserState.authenticated, userAppSettings, colorScheme]);
    
    const updateUserAccessibility = async (updates) => {
        try {
            await updateUserAccessibilitySettings(authUserState.user.id, updates);
            updateUserSettings({
                ...userAppSettings,
                ...updates,
            });
        } catch (error) {
            console.error('Error updating user settings:', error);
        }
    };

    useEffect(() => {
        if (!authUserState.authenticated) {
            return;
        }

        const fetchInitialScreenReaderStatus = async () => {
            try {
                const isActive = await AccessibilityInfo.isScreenReaderEnabled();
                setStyles(prevStyles => ({
                    ...prevStyles,
                    screenReader: isActive,
                }));
                if (authUserState.user) {
                    await updateUserAccessibility({ screen_reader: isActive });
                }
            } catch (error) {
                console.error('Error fetching initial screen reader status:', error);
            }
        };

        fetchInitialScreenReaderStatus();

        const screenReaderListener = AccessibilityInfo.addEventListener(
            'screenReaderChanged',
            async isActive => {
                if (authUserState.user) {
                    await updateUserAccessibility({ screen_reader: isActive });
                }
            }
        );

        return () => {
            screenReaderListener.remove();
        };
    }, [authUserState.authenticated]);

    const themeStyles = styles.theme === 'dark' ? darkThemeStyles : lightThemeStyles;

    return (
        <GlobalStyleContext.Provider value={{ ...styles, themeStyles }}>
            {children}
        </GlobalStyleContext.Provider>
    );
};

const lightThemeStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    divider: {
        backgroundColor: 'gray',
    },
    footerText: {
        color: 'black',
    },
});

const darkThemeStyles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    divider: {
        backgroundColor: 'lightgray',
    },
    footerText: {
        color: 'white',
    },
});

export default GlobalStyleProvider;
