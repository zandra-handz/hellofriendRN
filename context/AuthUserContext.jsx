import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { signup, signin, signout, getCurrentUser } from '../api';

const TOKEN_KEY = 'my-jwt';

const AuthUserContext = createContext({});

export const useAuthUser = () => {
    return useContext(AuthUserContext);
};

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

    const fetchUser = async (token) => {
        try {
            // Fetch user data using the token
            const response = await getCurrentUser();
            return response;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const loadUser = async () => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                const response = await fetchUser(token);
                console.log("fetched user: ", response);
                if (response && response.user) {
                    setAuthUserState(prevState => ({
                        ...prevState,
                        user: response.user,
                        credentials: {
                            ...prevState.credentials,
                            id: response.user.id,
                            token: token,
                        },
                        authenticated: true,
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const handleSignup = async (username, email, password) => {
        const result = await signup(username, email, password);
        if (!result.error) {
            // Update authentication state with token
            setAuthUserState({
                user: null, // Update this with the actual user data returned from signup
                credentials: {
                    ...authUserState.credentials,
                    token: result.data.token,
                },
                authenticated: false,
            });
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
        }
        return result;
    };

    const handleSignin = async (username, password) => {
        const result = await signin(username, password);
        if (!result.error) {
            // Update authentication state with access token
            setAuthUserState(prevState => ({
                user: null, // Update this with the actual user data returned from signin
                credentials: {
                    ...prevState.credentials,
                    token: result.data.access,
                },
                authenticated: true,
            }));
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access);
            
            // Fetch the current user data
            const currentUserData = await fetchUser(result.data.access);
            console.log("currentUserData: ", currentUserData);
            
            // Update authentication state with the fetched user data
            if (currentUserData) {
                setAuthUserState(prevState => ({
                    ...prevState,
                    user: {
                        id: currentUserData.id,
                        email: currentUserData.email,
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
                console.log("authuserstate after updating with currentUserData: ", authUserState);
            }
        }
        return result;
    };
    

    const handleSignout = async () => {
        const result = await signout();
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        // Clear authentication state
        setAuthUserState({
            user: null,
            credentials: {
                ...authUserState.credentials,
                token: null,
            },
        });
        return result;
    };

    const value = {
        onSignup: handleSignup,
        onSignin: handleSignin,
        onSignOut: handleSignout,
        authUserState,
    };

    return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
};

export default AuthUserContext;
