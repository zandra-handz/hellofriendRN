// GlobalStyleContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import { AccessibilityInfo } from 'react-native';

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
    const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
    const [styles, setStyles] = useState({
        fontSize: 16,
        highContrast: false,
        screenReader: false,
        receiveNotifications: false,
    });

    useEffect(() => {
        if (authUserState.authenticated && userAppSettings) {
            console.log('User app settings:', userAppSettings);
            setStyles({
                fontSize: userAppSettings.large_text ? 20 : 16,
                highContrast: userAppSettings.high_contrast_mode,
                screenReader: userAppSettings.screen_reader,
                receiveNotifications: userAppSettings.receive_notifications,
            });
        }
    }, [authUserState.authenticated, userAppSettings]);

    // Function to update user settings and trigger backend update
    const updateUserAccessibility = async (updates) => {
        try {
            await updateUserAccessibilitySettings(authUserState.user.id, updates);
            updateUserSettings({
                ...userAppSettings,
                ...updates, // Merge updates with existing settings
            });
        } catch (error) {
            console.error('Error updating user settings:', error);
        }
    };

    // Listener for screen reader changes
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

                // Update backend with initial screen reader status
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
                console.log(`Screen reader is ${isActive ? 'active' : 'inactive'}`);
                if (authUserState.user) {
                    await updateUserAccessibility({ screen_reader: isActive });
                }
            }
        );

        return () => {
            screenReaderListener.remove();
        };
    }, [authUserState.authenticated]);

    return (
        <GlobalStyleContext.Provider value={styles}>
            {children}
        </GlobalStyleContext.Provider>
    );
};

export default GlobalStyleProvider;
