import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet, AccessibilityInfo } from 'react-native';
import { useAuthUser } from './AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import { useColorScheme } from 'react-native';

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
    const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
    const colorScheme = useColorScheme();
    const [ nonCustomHeaderPage, setNonCustomHeaderPage ] = useState(false);

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
        <GlobalStyleContext.Provider value={{ ...styles, themeStyles, nonCustomHeaderPage, setNonCustomHeaderPage }}>
            {children}
        </GlobalStyleContext.Provider>
    );
};


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
        fontFamily: 'Poppins-Regular',
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
    genericTextBackground: {
        backgroundColor: '#ffffff',
    },
    genericTextBackgroundShadeTwo: {
        backgroundColor: '#ccc',
    },
    genericText: {
        color: 'black',
    },
    genericIcon: {
        color: 'black',
    },
    selectedIconBorder: {
        borderColor: 'darkgreen', 
    },
    subHeaderText: {
        color: 'black',

    },
    input: {
        color: 'black',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: '100%',
        borderColor: 'lightgray',
        backgroundColor: 'white',
        placeholderTextColor: 'lightgray',
        fontFamily: 'Poppins-Regular',
        textAlign: 'left',
        fontSize: 16,
    },
    borderColor: {
        color: 'white',
    },
    friendFocusSection: {
        backgroundColor: 'white',
    },
    friendFocusSectionText: {
        color: 'black',
    },
    friendFocusSectionIcon: {
        color: 'black',
    },
    modalContainer: {
        backgroundColor: 'white',
    },
    modalText: {
        color: 'black',
    },
    modalIconColor: {
        color: 'black', 
    },
    toggleButtonColor: {
        backgroundColor: '#ccc',
    },
    toggleOn: {
        backgroundColor: '#4cd137',

    },
    toggleOff: {
        backgroundColor: '#dcdde1',
        
    },
    footerContainer: {
        backgroundColor: 'white',
        borderTopWidth: .4,
        borderColor: 'black',
    },
    headerContainer: {
        backgroundColor: 'white',
        borderBottomWidth: .4,
        borderColor: 'transparent',
        
    },
    headerContainerNoBorder: {
        backgroundColor: 'white', 
        
    },
    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    divider: {
        width: 1,
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
    headerText: { 
        color: 'black',
    },
    headerIcon: {
        color: 'black',
    },
    upcomingNavIcon: {
        color: 'black',
    },
    upcomingNavText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: 'black',
    }, 
    header: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    headerTextColor: 'black',
});


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
        placeholderTextColor: 'lightgray',
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
        backgroundColor: '#050604',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    genericTextBackground: {
        backgroundColor: '#000000',
    },
    genericTextBackgroundShadeTwo: {
        backgroundColor: '#2B2B2B',
    },
    genericText: {
        color: 'white',
    },
    genericIcon: {
        color: 'white',
    },
    selectedIconBorder: {
        borderColor: '#d4edda', 
    },
    subHeaderText: {
        color: 'white',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: 'white',

    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'black',
        placeholderTextColor: 'darkgray', 
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: '100%', 
        fontFamily: 'Poppins-Regular',
        textAlign: 'left',
        fontSize: 16,
    },
    borderColor: {
        color: 'black',
    },
    friendFocusSection: {
        backgroundColor: 'black',
    },
    friendFocusSectionText: {
        color: 'white',
    },
    friendFocusSectionIcon: {
        color: 'white',
    },
    modalContainer: {
        backgroundColor: '#2B2B2B',
    },
    modalText: {
        color: 'white',
    },
    modalIconColor: {
        color: 'white', 
    },
    toggleButtonColor: {
        backgroundColor: '#ccc',
    },
    toggleOn: {
        backgroundColor: '#4cd137',
    },
    toggleOff: {
        backgroundColor: '#dcdde1',  
    },
    footerContainer: {
        backgroundColor: 'black',
        borderTopWidth: .4,
        borderColor: '#ccc',
    },
    headerContainer: {
        backgroundColor: 'black',
        borderBottomWidth: .4,
        borderColor: 'transparent',
    },
    headerContainerNoBorder: {
        backgroundColor: 'black', 
        
    },

    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    divider: {
        width: .4,
        backgroundColor: '#ccc',
    },
    footerText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: 'white',
    },
    footerIcon: {
        color: 'white',
    },
    headerText: { 
        color: 'white',
    },
    headerIcon: {
        color: 'white',
    },
    UpcomingNavText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        textAlign: 'center',
        color: 'white',
    },
    upcomingNavIcon: {
        color: 'white',
    },
    header: {
        backgroundColor: 'black',
        borderBottomColor: 'darkgray',
        borderBottomWidth: 1,
    },
    headerTextColor: 'white',
});

export default GlobalStyleProvider;
