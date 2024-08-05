import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet, AccessibilityInfo } from 'react-native';
import { useAuthUser } from './AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Create context
const GlobalStyleContext = createContext();

// Custom hook to use the context
export const useGlobalStyle = () => useContext(GlobalStyleContext);

// Provider component
export const GlobalStyleProvider = ({ children }) => {
    const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
    const colorScheme = useColorScheme();

    // Default state
    const [styles, setStyles] = useState({
        fontSize: 16,
        highContrast: false,
        screenReader: false,
        receiveNotifications: false,
        theme: colorScheme || 'light',
        gradientColors: {
            darkColor: '#4caf50',
            lightColor: '#a0f143',
        },
        gradientDirection: { x: 1, y: 0 },
    });

    useEffect(() => {
        if (authUserState.authenticated && userAppSettings) {
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
            setStyles(prevStyles => ({
                ...prevStyles,
                theme: colorScheme || 'light',
            }));
        }
    }, [authUserState.authenticated, userAppSettings, colorScheme]);

    useEffect(() => {
        if (styles.theme === 'light') {
            setStyles(prevStyles => ({
                ...prevStyles,
                gradientColors: {
                    darkColor: '#ffffff',
                    lightColor: '#ffffff',
                },
            }));
        } else {
            setStyles(prevStyles => ({
                ...prevStyles,
                gradientColors: {
                    darkColor: '#4caf50',
                    lightColor: '#a0f143',
                },
            }));
        }
    }, [styles.theme]);

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

// Light Theme Styles
const lightThemeStyles = StyleSheet.create({
    signinContainer: {
        backgroundColor: 'white',
    },
    signinText: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
    },
    signInAppDescription: {
        fontColor: 'black', 
        fontSize: 16,
    },
    signinInput: {
        backgroundColor:'white',
        color: 'black',
        fontFamily: 'Poppins-Regular',
        placeholderTextColor: 'gray',
    },
    logoText: {
        color: 'black',
    },
    logoTextOutline: {
        color: 'white',
        position: 'absolute',
        fontFamily: 'Poppins-Bold',
        fontSize: 62,
    },
    logoShape: {
        tintColor: 'black',
    },
    container: {
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    divider: {
        backgroundColor: 'gray',
    },
    footerText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: 'black',
    },
    footerIcon: {
        color: 'black',
    },
    header: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    headerTextColor: 'black',
});

// Dark Theme Styles
const darkThemeStyles = StyleSheet.create({
    signinContainer: {
        backgroundColor: 'black',
    },
    signinText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
    },
    signInAppDescription: {
        fontColor: 'black', 
        fontSize: 16,
    },
    signinInput: {
        backgroundColor:'black',
        color: 'white',
        fontFamily: 'Poppins-Regular',
        placeholderTextColor: 'gray',
    },
    logoText: {
        color: 'black',  
    },
    logoTextOutline: {
        color: 'white',
        position: 'absolute',
        fontFamily: 'Poppins-Bold',
        fontSize: 64,
    },
    logoShape: {
        tintColor: 'black',
    },
    container: {
        backgroundColor: '#001a00',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    divider: {
        backgroundColor: 'lightgray',
    },
    footerText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: 'white',
    },
    footerIcon: {
        color: 'white',
    },
    header: {
        backgroundColor: '#222',
        borderBottomColor: 'darkgray',
        borderBottomWidth: 1,
    },
    headerTextColor: 'white',
});

export default GlobalStyleProvider;
