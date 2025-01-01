import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet, AccessibilityInfo } from 'react-native';
import { useAuthUser } from './AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import { useColorScheme } from 'react-native';

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
    const { authUserState, userAppSettings,updateAppSettingsMutation, updateUserSettings } = useAuthUser();
    const colorScheme = useColorScheme();
    const [ nonCustomHeaderPage, setNonCustomHeaderPage ] = useState(false);

    useEffect(() => {
        console.log(' U S E R A P P SE T T I N GS ', userAppSettings);

    }, [userAppSettings]);
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
        gradientColorsHome: {
            darkColor: '#000002',
            lightColor: '#163805',
        },
        manualGradientColors: {
            darkColor: '#4caf50',
            lightColor: '#a0f143',
            homeDarkColor: '#000002',
            homeLightColor: '#163805',

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
                gradientColorsHome: {
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
                gradientColorsHome: {
                    darkColor: '#000002',
                    lightColor: '#163805',
                },
            }));
        }
    }, [styles.theme]);


    //working on removing and replacing with RQ mutation directly
    //this is mainly used in SectionSettingsAccessibility
    const updateUserAccessibility = async (updates) => {
        try {
            //await updateUserAccessibilitySettings(authUserState.user.id, updates);
            updateAppSettingsMutation.mutate({
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

        const screenReaderListener = AccessibilityInfo.addEventListener(
            'screenReaderChanged',
            
            async isActive => {
                
                console.log('SCREEN READER GLOBAL STYLE');
                if (authUserState.user) {
                    updateAppSettingsMutation.mutate({
                        userId: authUserState.user.id,
                        setting: { screen_reader: isActive },
                    });
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
   
    signinText: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
    },
    signInAppDescription: {
        fontColor: 'black', 
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
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
    genericTextBackgroundShadeThree: {
        backgroundColor: '#ccc',
    },
    genericText: {
        color: '#121212',
    },
    genericIcon: {
        color: '#121212',
    },
    selectedIconBorder: {
        borderColor: 'darkgreen', 
    },
    subHeaderText: {
        color: '#121212',

    },
    input: {
        color: '#121212',
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
        color: '#121212',
    },
    friendFocusSectionIcon: {
        color: '#121212',
    },
    modalContainer: {
        backgroundColor: 'white',
    },
    modalText: {
        color: '#121212',
    },
    modalIconColor: {
        color: '#121212', 
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
        color: '#121212',
    },
    footerIcon: {
        color: '#121212',
    },
    headerText: { 
        color: '#121212',
    },
    headerIcon: {
        color: '#121212',
    },
    upcomingNavIcon: {
        color: '#121212',
    },
    upcomingNavText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: '#121212',
    }, 
    header: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    headerTextColor: '#121212',
});


const darkThemeStyles = StyleSheet.create({
 
    signinText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
    },
    signInAppDescription: {
        fontColor: 'black', 
        fontSize: 16,
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
        backgroundColor: '#121212',
    },
    genericTextBackgroundShadeTwo: {
        backgroundColor: '#2B2B2B',
    },
    genericTextBackgroundShadeThree: {
        backgroundColor: '#242424',
    },
    genericText: {
        color: '#d3d3d3',
    },
    genericIcon: {
        color: '#d3d3d3',
    },
    selectedIconBorder: {
        borderColor: '#d4edda', 
    },
    subHeaderText: {
        color: '#d3d3d3',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#d3d3d3',

    },
    input: {
        color: '#d3d3d3',
        borderWidth: 1,
        borderColor: '#d3d3d3',
        backgroundColor: '#121212',
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
        color: '#121212',
    },
    friendFocusSection: {
        backgroundColor: '#121212',
    },
    friendFocusSectionText: {
        color: '#d3d3d3',
    },
    friendFocusSectionIcon: {
        color: '#d3d3d3',
    },
    modalContainer: {
        backgroundColor: '#2B2B2B',
    },
    modalText: {
        color: '#d3d3d3',
    },
    modalIconColor: {
        color: '#d3d3d3', 
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
        backgroundColor: '#000002',
        borderTopWidth: .2,
        borderColor: '#4caf50',
    },
    headerContainer: {
        backgroundColor: '#000002',
        borderBottomWidth: .4,
        borderColor: 'transparent',
    },
    headerContainerNoBorder: {
        backgroundColor: '#121212', 
        
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
        color: '#d3d3d3',
    },
    footerIcon: {
        color: '#d3d3d3',
    },
    headerText: { 
        color: '#d3d3d3',
    },
    headerIcon: {
        color: '#d3d3d3',
    },
    UpcomingNavText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        textAlign: 'center',
        color: '#d3d3d3',
    },
    upcomingNavIcon: {
        color: '#d3d3d3',
    },
    header: {
        backgroundColor: 'black',
        borderBottomColor: 'darkgray',
        borderBottomWidth: 1,
    },
    headerTextColor: '#d3d3d3',
});

export default GlobalStyleProvider;
