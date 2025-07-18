 
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './src/context/UserContext';

const TopLevelNavigationHandler = ({ children }) => {
    const navigation = useNavigation();
    const { isAuthenticated, isInitializing, onSignOut } = useUser();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);


    // console.log('TOP NAVIGATION HANDLER RUNNING');

    useEffect(() => { 
        const checkAuthentication = async () => {
            // if (user.loading) {
            if (isInitializing) { 
                return; // Wait until loading is complete
            }

            // if (!user.authenticated) {
            if (!isAuthenticated) {
                if (!isCheckingAuth) {
                    setIsCheckingAuth(true); // Prevent re-triggering
                 
                    await onSignOut(); // Ensure the user is signed out
                    navigation.navigate('Signin'); // Navigate to Signin
                    setIsCheckingAuth(false); // Allow further checks if needed
                }
            }
        };

        checkAuthentication();
    }, [  navigation, onSignOut, isCheckingAuth, isAuthenticated]);

//     useEffect(() => {
//   if (isInitializing || isCheckingAuth) return;


//    console.log('checking auth!');
//   const checkAuthentication = async () => {
   
//     if (!isAuthenticated) {
//       setIsCheckingAuth(true);
//       await onSignOut();
//       navigation.navigate('Signin');
//       setIsCheckingAuth(false);
//     }
//   };

//   checkAuthentication();
// }, [isAuthenticated, isInitializing]);

    return <>{children}</>;
};

export default TopLevelNavigationHandler;
