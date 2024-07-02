import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { signup, signin, signout, getCurrentUser } from '../api';

const TOKEN_KEY = 'my-jwt';

const AuthUserContext = createContext({});

export const useAuthUser = () => useContext(AuthUserContext);

export const AuthUserProvider = ({ children }) => {
    const [authUserState, setAuthUserState] = useState({
        user: null,
        credentials: {
            id: null,
            username: null,
            password: null,
            token: null,
        },
        authenticated: false,
    });
    const [userAppSettings, setUserAppSettings] = useState(null);

    const fetchUser = async (token) => {
        try {
            const response = await getCurrentUser();
            return response;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const handleSignup = async (username, email, password) => {
        const result = await signup(username, email, password);
        if (!result.error) {
            setAuthUserState({
                user: null,
                credentials: {
                    ...authUserState.credentials,
                    token: result.data.token,
                },
                authenticated: false,
            });
            await SecureStore.setItemAsync(TOKEN_KEY, String(result.data.token));
        }
        return result;
    };

    const handleSignin = async (username, password) => {
        const result = await signin(username, password);
        if (!result.error) {
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access);
            const currentUserData = await fetchUser(result.data.access);

            if (currentUserData) {
                setAuthUserState(prevState => ({
                    ...prevState,
                    user: {
                        id: currentUserData.id,
                        email: currentUserData.email,
                        addresses: currentUserData.addresses,
                        app_setup_complete: currentUserData.app_setup_complete,
                        profile: currentUserData.profile,
                        settings: currentUserData.settings,
                        username: currentUserData.username
                    },
                    credentials: {
                        ...prevState.credentials,
                        id: currentUserData.id,
                        token: result.data.access,
                    },
                    authenticated: true,
                }));
                setUserAppSettings(currentUserData.settings);
            }
        }
        return result;
    };

    const handleSignout = async () => {
        const result = await signout();
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setAuthUserState({
            user: null,
            credentials: {
                ...authUserState.credentials,
                token: null,
            },
            authenticated: false,
        });
        setUserAppSettings(null);
        return result;
    };

    const updateUserSettings = (newSettings) => {
        setUserAppSettings(newSettings);
    };

    const value = {
        onSignup: handleSignup,
        onSignin: handleSignin,
        onSignOut: handleSignout,
        authUserState,
        userAppSettings,
        updateUserSettings
    };

    return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
};

export default AuthUserContext;
