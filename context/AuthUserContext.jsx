

import React, { createContext, useContext, useState, useEffect, AccessibilityInfo } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import Constants from "expo-constants";
import { Platform } from 'react-native';
import { signup, signin, signout, getCurrentUser, updateUserAccessibilitySettings } from '../api';

const AuthUserContext = createContext({});
export const useAuthUser = () => useContext(AuthUserContext);

const TOKEN_KEY = 'my-jwt';

export const AuthUserProvider = ({ children }) => {
    const [authUserState, setAuthUserState] = useState({
        user: null,
        authenticated: false,
        loading: true,
    });
    const [userAppSettings, setUserAppSettings] = useState({});
    const [userNotificationSettings, setUserNotificationSettings] = useState({});
    const [userAddresses, setUserAddresses] = useState({ addresses: [] });
    const queryClient = useQueryClient();

    
    // Reinitialize user data function
    const reInitialize = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
            const userData = await getCurrentUser();
            if (userData) {
                setAuthUserState(prev => ({
                    ...prev,
                    user: userData,
                    authenticated: true,
                    loading: false, 
                }));
                setUserAppSettings(userData.settings || {});
                console.log('user app settings in reinitialize', userData.settings);
                setUserNotificationSettings({
                    receive_notifications: userData.settings?.receive_notifications || false
                });
                setUserAddresses({
                    addresses: userData.addresses ? Object.values(userData.addresses) : []
                });
            } else {
                // Handle case where user data is null
                setAuthUserState(prev => ({ ...prev, authenticated: false, loading: false }));
            }
        } else {
            setAuthUserState({ user: null, authenticated: false, loading: false });
        }
    };

    useEffect(() => {
        console.log('UUUUSEEEE EFFFFECCTT IN CONTEXXXXXXT', userAppSettings);

    }, [userAppSettings]);
 
    const { data: currentUserData } = useQuery({
        queryKey: ['fetchUser'],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) return await getCurrentUser();
            return null;
        },
        enabled: authUserState.authenticated,
        onSuccess: (data) => {
            if (data) {
                setAuthUserState(prev => ({
                    ...prev,
                    user: data,
                    authenticated: true,
                    loading: false
                }));
                setUserAppSettings(data.settings || {});
                console.log('user app settings', userAppSettings);
                setUserNotificationSettings({ receive_notifications: data.settings?.receive_notifications || false });
                
                setUserAddresses({
                    addresses: data.addresses ? Object.values(data.addresses) : []
                });
            }
        },
        onError: () => {
            setAuthUserState(prev => ({ ...prev, loading: false }));
        }
    });

    

    useEffect(() => {
        const fetchInitialSettings = async () => {
            console.log('SCREEN READER CONTEXT');
            try {
                const isActive = await AccessibilityInfo.isScreenReaderEnabled();
                setUserAppSettings(prevSettings => ({
                    ...prevSettings,
                    screen_reader: isActive,
                }));
            } catch (error) {
                console.error('Error fetching initial screen reader status:', error);
            }
        };
    
        if (authUserState.authenticated && currentUserData && userAppSettings) {
            fetchInitialSettings();
        }
    }, [authUserState.authenticated]);
    
    
    const signinMutation = useMutation({
        mutationFn: signin,
        onMutate: () => {  
            console.log('signin is fetching from onMutate');
        },
        onSuccess: async (result) => { 
            if (result.data) {
                const { access: token, refresh } = result.data;
                await SecureStore.setItemAsync(TOKEN_KEY, token);
                await SecureStore.setItemAsync('refreshToken', refresh);
                await reInitialize();  
            }
        },
        onError: (error) => {
            console.error('Sign in mutation error:', error);
            //alert("Sign-in failed: " + (error.response?.data.msg || 'Unknown error occurred'));
        },
        onSettled: () => { 
            //signinMutation.reset()

        },
    });
    

const onSignin = async (username, password) => {
    try {
        
        const credentials = { username, password };

         console.log('Signing in with credentials:', credentials);
 
        await signinMutation.mutateAsync(credentials);
    } catch (error) {
        console.error('Sign in error', error); 
    }
};


    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: async (result) => {
            if (result.data) {
                await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
                await reInitialize(); // Refetch user data after sign-up
            }
        }
    });

    const updateAppSettings = async (newSettings) => {
        try {
            await updateAppSettingsMutation.mutateAsync({
                userId: authUserState.user.id, // User ID
                fieldUpdates: newSettings // Pass newSettings directly as fieldUpdates
            });
        } catch (error) {
            console.error('Error updating app settings:', error);
        }
    };

    const updateAppSettingsMutation = useMutation({
        mutationFn: (data) => updateUserAccessibilitySettings(data.userId, data.setting),
        onSuccess: (data) => {
            setUserAppSettings(data); // Assuming the API returns updated settings
            
            queryClient.setQueryData(['fetchUser'], (oldData) => ({
                ...oldData,
                settings: data.settings
            }));
        },
        onError: (error) => {
            console.error('Update app settings error:', error);
        }
    });

    const onSignOut = async () => {
        await signout(); // Call your signout API function
        await SecureStore.deleteItemAsync(TOKEN_KEY); // Clear access token
        await SecureStore.deleteItemAsync('refreshToken'); // Clear refresh token if applicable
        await SecureStore.deleteItemAsync('pushToken'); // Clear push token if applicable
    
        // Reset user-related state
        setAuthUserState({
            user: null,
            authenticated: false,
            loading: false,
            credentials: {
                token: null,  
            },
        });
     
        setUserAppSettings(null); 
        setUserNotificationSettings(null); 
        setUserAddresses({ addresses: [] });  
        queryClient.clear();
    };
    
 
    useEffect(() => {
        console.log('usernotifs useEffect triggered in context');
        if (userNotificationSettings?.receive_notifications) {
            console.log('registering for notifs');
            registerForNotifications();
        } else {
            console.log('removing notifs permissions');
            removeNotificationPermissions();
        }
    }, [userNotificationSettings]);


    const registerForNotifications = async () => {
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus === "granted") {
                const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
                await SecureStore.setItemAsync('pushToken', pushTokenString);
                await updateUserAccessibilitySettings(authUserState.user.id, { receive_notifications: true, expo_push_token: pushTokenString });
                console.log(pushTokenString);
            }
        }
    };

    const removeNotificationPermissions = async () => {
        await SecureStore.deleteItemAsync('pushToken');
        if (authUserState.user) {
            await updateUserAccessibilitySettings(authUserState.user.id, { receive_notifications: false, expo_push_token: null });
        } 
    };

    return (
        <AuthUserContext.Provider value={{
            authUserState,
            userAppSettings,
            userNotificationSettings,
            userAddresses, 
            handleSignup: signupMutation.mutate,
            onSignin, 
            updateAppSettingsMutation, 
            updateAppSettings,
            signinMutation,
            signupMutation,
            onSignOut,
            reInitialize, // Added to the context
            updateUserSettings: setUserAppSettings,
            updateUserNotificationSettings: setUserNotificationSettings,
            addAddress: (newAddress) => setUserAddresses(prev => ({ addresses: [...prev.addresses, newAddress] })),
            removeAddress: (title) => setUserAddresses(prev => ({ addresses: prev.addresses.filter(a => a.title !== title) })),
        }}>
            {children}
        </AuthUserContext.Provider>
    );
};
