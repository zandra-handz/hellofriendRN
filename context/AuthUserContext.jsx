// AuthUserContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { signup, signin, signout, refreshToken, getCurrentUser } from '../api';
import jwtDecode from 'jwt-decode';

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
        loading: true,  // Add loading state
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
                loading: false, 
            });
            await SecureStore.setItemAsync(TOKEN_KEY, String(result.data.token));
        }
        return result;
    };


    const registerForNotifications = async () => {
        if (userAppSettings?.receive_notifications) {
            try {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
    
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
    
                if (finalStatus !== 'granted') {
                    console.error('Failed to get push token, permission not granted');
                    return;
                }
    
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log('Expo Push Token:', token);
    
                await SecureStore.setItemAsync('pushToken', token);
    
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Notifications Enabled",
                        body: "Notifications for hellofriend are now enabled!",
                        sound: 'default',
                    },
                    trigger: null, // Trigger immediately
                });
    
                return token;
            } catch (error) {
                console.error('Failed to get push token or send notification:', error);
            }
        } else {
            console.log('Push notifications disabled in user settings');
    
            await SecureStore.deleteItemAsync('pushToken');
    
            return null;
        }
    };
    
    
    useEffect(() => {
        if (userAppSettings) {
            // Only call registerForNotifications if notifications setting is true
            if (userAppSettings.receive_notifications) {
                registerForNotifications();
            }
        }
    }, [userAppSettings]);
 

    const handleSignin = async (username, password) => {
        const result = await signin(username, password);
        if (!result.error) {
            const token = result.data.access;
            const refreshToken = result.data.refresh;
            const tokenExpiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await SecureStore.setItemAsync('tokenExpiry', String(tokenExpiry));
            
            console.log('handle sign in in context tokens stored:', token);
            const currentUserData = await fetchUser();
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
                        token: token,
                    },
                    authenticated: true,
                    loading: false, // Sign-in process is complete
                }));
                setUserAppSettings(prevSettings => ({
                    ...prevSettings,
                    ...currentUserData.settings, // Merge with existing settings
                }));
                
            } else {
                setAuthUserState(prevState => ({
                    ...prevState,
                    loading: false, // Sign-in failed, loading is complete
                }));
            }
        } else {
            setAuthUserState(prevState => ({
                ...prevState,
                loading: false, // Sign-in error, loading is complete
            }));
        }
        return result;
    };
    
    const handleSignout = async () => {
        const result = await signout();
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync('pushToken');
        setAuthUserState({
            user: null,
            credentials: {
                ...authUserState.credentials,
                token: null,
            },
            authenticated: false,
            loading: false, // Signout process is complete
        });
        setUserAppSettings(null);
        return result;
    };

    const updateUserSettings = (newSettings) => {
        setUserAppSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    useEffect(() => {
        const initializeAuthState = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const tokenExpiry = await SecureStore.getItemAsync('tokenExpiry');
            const currentTime = new Date().toISOString();
            const currentTimeOldOrGoBackTo = new Date().getTime();
            console.log(currentTime);
    
            if (token && tokenExpiry && currentTime < parseInt(tokenExpiry)) {
                const currentUserData = await fetchUser(token);
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
                            token: token,
                        },
                        authenticated: true,
                        loading: false, // Initialization complete
                    }));
                    setUserAppSettings(prevSettings => ({
                        ...prevSettings,
                        ...currentUserData.settings, // Merge with existing settings
                    }));
                } else {
                    setAuthUserState(prevState => ({
                        ...prevState,
                        loading: false, // Initialization failed, loading is complete
                    }));
                }
            } else {
                setAuthUserState(prevState => ({
                    ...prevState,
                    loading: false, // No token or token expired, loading is complete
                }));
            }
        };
    
        initializeAuthState();
    }, []);


    const reInitialize = async () => {
        try { 
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            const tokenExpiry = await SecureStore.getItemAsync('tokenExpiry'); // Assume it's a timestamp
        
            console.log('Token:', token);
            console.log('Token expiry:', tokenExpiry);
        
            if (token && tokenExpiry) {
                const currentTime = new Date().getTime();
                console.log('Current time:', currentTime);
        
                // Convert tokenExpiry to number if it's not already
                const tokenExpiryTime = parseInt(tokenExpiry, 10);
                console.log('Token expiry time:', tokenExpiryTime);
        
                // Calculate the time difference
                const timeDifference = tokenExpiryTime - currentTime;
                console.log('Time difference (ms):', timeDifference);
        
                // Check if the token is still valid
                if (currentTime < tokenExpiryTime) {
                    // Token is still valid, fetch user data
                    const currentUserData = await fetchUser(token);
        
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
                                token: token,
                            },
                            authenticated: true,
                            loading: false,
                        }));
                        setUserAppSettings(prevSettings => ({
                            ...prevSettings,
                            ...currentUserData.settings,
                        }));
                    } else {
                        setAuthUserState(prevState => ({
                            ...prevState,
                            loading: false,
                        }));
                    }
                } else {
                    // Token has expired
                    console.log('Token has expired.');
                    await SecureStore.deleteItemAsync(TOKEN_KEY);
                    await SecureStore.deleteItemAsync('refreshToken');
                    await SecureStore.deleteItemAsync('tokenExpiry');
                    await SecureStore.deleteItemAsync('pushToken');
        
                    try {
                        const newAccessToken = await refreshToken();
                        console.log('New access token:', newAccessToken);
        
                        if (newAccessToken) {
                            const newDecodedToken = jwtDecode(newAccessToken);
                            const newExpDate = new Date(newDecodedToken.exp * 1000);
                            const newExpTime = newExpDate.getTime();
        
                            await SecureStore.setItemAsync(TOKEN_KEY, newAccessToken);
                            await SecureStore.setItemAsync('tokenExpiry', String(newExpTime));
        
                            setAuthUserState(prevState => ({
                                ...prevState,
                                credentials: {
                                    ...prevState.credentials,
                                    token: newAccessToken,
                                },
                                authenticated: true,
                                loading: false,
                            }));
                        } else {
                            setAuthUserState(prevState => ({
                                ...prevState,
                                authenticated: false,
                                loading: false,
                            }));
                        }
                    } catch (refreshError) {
                        console.error('Error refreshing token:', refreshError);
                        setAuthUserState(prevState => ({
                            ...prevState,
                            authenticated: false,
                            loading: false,
                        }));
                    }
                }
            } else {
                console.log('Token or token expiry information is missing.');
                setAuthUserState(prevState => ({
                    ...prevState,
                    authenticated: false,
                    loading: false,
                }));
            }
        } catch (error) {
            console.error('Error in reInitialize:', error);
            setAuthUserState(prevState => ({
                ...prevState,
                authenticated: false,
                loading: false,
            }));
        }
    };
    

    const value = {
        onSignup: handleSignup,
        onSignin: handleSignin,
        onSignOut: handleSignout,
        fetchUser: fetchUser,
        reInitialize: reInitialize,
        authUserState,
        userAppSettings,
        updateUserSettings,
    };

    return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
};

export default AuthUserContext;
