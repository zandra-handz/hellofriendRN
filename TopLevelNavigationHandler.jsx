// NavigationHandler.js
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthUser } from './context/AuthUserContext';

const TopLevelNavigationHandler = ({ children }) => {
    const navigation = useNavigation();
    const { authUserState, onSignOut } = useAuthUser();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            if (authUserState.loading) {
                return; // Wait until loading is complete
            }

            if (!authUserState.authenticated) {
                if (!isCheckingAuth) {
                    setIsCheckingAuth(true); // Prevent re-triggering
                    await onSignOut(); // Ensure the user is signed out
                    navigation.navigate('Signin'); // Navigate to Signin
                    setIsCheckingAuth(false); // Allow further checks if needed
                }
            }
        };

        checkAuthentication();
    }, [authUserState, navigation, onSignOut, isCheckingAuth]);

    return <>{children}</>;
};

export default TopLevelNavigationHandler;
