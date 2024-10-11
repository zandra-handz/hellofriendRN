// AuthUserContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { signup, signin, signout, refreshToken, getCurrentUser, updateUserAccessibilitySettings } from '../api';
import jwtDecode from 'jwt-decode'; 
import * as Device from 'expo-device';
import Constants from "expo-constants";
import { Platform } from 'react-native';

const TOKEN_KEY = 'my-jwt';

const AuthUserContext = createContext({});
 

 //async function clearSecureStore() {
   // await SecureStore.deleteItemAsync('my-jwt');
   // await SecureStore.deleteItemAsync('tokenExpiry');
   // await SecureStore.deleteItemAsync('refreshToken');
   // await SecureStore.deleteItemAsync('pushToken');
   // Replace 'my-jwt' with your actual key
   //this only partially worked and then i ran
    // Remove-Item -Recurse -Force .\node_modules
    // npm install

// }

// clearSecureStore().catch(console.error);

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
    const [ userNotificationSettings, setUserNotificationSettings ] = useState(null);
    const [userAddresses, setUserAddresses] = useState({ addresses: [] });

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
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                throw new Error(
                    "Permission not granted to get push token for push notification"
                );
            }

            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error("Project ID not found");
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log('hi!', pushTokenString);
                await SecureStore.setItemAsync('pushToken', pushTokenString);
            
                // Update the user accessibility settings
                await updateUserAccessibilitySettings(authUserState.user.id, { receive_notifications: true, expo_push_token: pushTokenString });
        
                return pushTokenString;
            } catch (e) {
                throw new Error(`${e}`);
            }
             
        } else {
            throw new Error("Must use physical device for push notifications");
        }
    }
 
    
    const removeNotificationPermissions = async () => { 
        try {
            // Ensure the user is authenticated before trying to access their ID
            if (authUserState.user) {
                // Delete the push token stored in SecureStore
                await SecureStore.deleteItemAsync('pushToken');
                await updateUserAccessibilitySettings(authUserState.user.id, { receive_notifications: true, expo_push_token: null });
    
                console.log('Notification permissions removed and token cleared.');
            } else {
                console.log('No user is signed in, skipping notification permissions removal.');
            }
        } catch (error) {
            console.error('Failed to remove notification permissions:', error);
        } 
    };
    
    useEffect(() => {
        console.log(userNotificationSettings);
        if (userNotificationSettings?.receive_notifications === true) {  
            registerForNotifications();
        } else {
            removeNotificationPermissions();
        }
    }, [userNotificationSettings]);
    

 
 

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
                setUserNotificationSettings(prevSettings => ({
                    ...prevSettings,
                    receive_notifications: currentUserData.settings.receive_notifications, // Update only the receive_notifications value
                })); 
                  
                setUserAddresses({
                    addresses: currentUserData?.addresses && Object.keys(currentUserData.addresses).length > 0
                        ? Object.keys(currentUserData.addresses).map(key => ({
                            title: currentUserData.addresses[key]?.title,
                            address: currentUserData.addresses[key]?.address,
                            coordinates: currentUserData.addresses[key]?.coordinates,
                        }))
                        : [],
                });
                  
                
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
        await SecureStore.deleteItemAsync('pushToken'); // Clear push token on sign out
        setAuthUserState({
            user: null,
            credentials: {
                ...authUserState.credentials,
                token: null,
            },
            authenticated: false,
            loading: false,
        });
        setUserAppSettings(null);
        setUserNotificationSettings(null); // Clear notification settings on sign out
        setUserAddresses({ addresses: []});
        return result;
    };

    const updateUserSettings = (newSettings) => {
        setUserAppSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    const updateUserNotificationSettings = (receiveNotificationsValue) => {
        if (userNotificationSettings) {
        setUserNotificationSettings(prevSettings => ({
            ...prevSettings,
            receive_notifications: receiveNotificationsValue,  // Update only the receive_notifications value
        }));
        }
    };

    const updateUserAddresses = (newSettings) => {
        setUserAddresses(prevSettings => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    const addAddress = (title, address, coordinates = null) => {
        const newAddress = {
            title,
            address,
            coordinates,
        };
    
        updateUserAddresses({
            addresses: [...(userAddresses.addresses || []), newAddress],
        });
    };
    
    // Function to remove an address by title (or you could use an ID or some other identifier)
    const removeAddress = (addressTitle) => {
        updateUserAddresses({
            addresses: userAddresses.addresses.filter(address => address.title !== addressTitle),
        });
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
                            addresses: currentUserData.addresses ?  currentUserData.addresses : [],
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
                    setUserNotificationSettings(prevSettings => ({
                        ...prevSettings,
                        receive_notifications: currentUserData.settings.receive_notifications, // Update only the receive_notifications value
                    }));
                    setUserAddresses({
                        addresses: currentUserData?.addresses && Object.keys(currentUserData.addresses).length > 0
                            ? Object.keys(currentUserData.addresses).map(key => ({
                                title: currentUserData.addresses[key]?.title,
                                address: currentUserData.addresses[key]?.address,
                                coordinates: currentUserData.addresses[key]?.coordinates,
                            }))
                            : [],
                    });
                      
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
                        setUserNotificationSettings(prevSettings => ({
                            ...prevSettings,
                            receive_notifications: currentUserData.settings.receive_notifications, // Update only the receive_notifications value
                        }));
                        setUserAddresses({
                            addresses: currentUserData?.addresses && Object.keys(currentUserData.addresses).length > 0
                                ? Object.keys(currentUserData.addresses).map(key => ({
                                    title: currentUserData.addresses[key]?.title,
                                    address: currentUserData.addresses[key]?.address,
                                    coordinates: currentUserData.addresses[key]?.coordinates,
                                }))
                                : [],
                        });
                          
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
        registerForNotifications: registerForNotifications,
        removeNotificationPermissions: removeNotificationPermissions,
        authUserState,
        userAppSettings,
        userAddresses,
        updateUserSettings,
        updateUserAddresses,
        addAddress,
        removeAddress,
        updateUserNotificationSettings,
    };

    return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
};

export default AuthUserContext;