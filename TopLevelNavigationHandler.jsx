 
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './src/context/UserContext';



const TopLevelNavigationHandler = ({ children }) => {
    const navigation = useNavigation();
    const { isAuthenticated, isInitializing, onSignOut } = useUser();
 
 

    useEffect(() => { 
      
        const checkAuthentication = async () => {
           
            if (isInitializing) { 
                  console.log('nav useeffect triggerd! returning without doing anything');
                return; // Wait until loading is complete
            }
 
            if (!isAuthenticated) {
                console.log('nav useeffect triggerd! not authenticated');
             
                 
                    //  onSignOut();  

                     //not necessary for signing out, but leaving here for right now while debugging the blank green screen issue
                    navigation.navigate('Welcome'); 
                // }
            }

            if (isAuthenticated) {
                   console.log('nav useeffect triggerd! authenticated, not doing anything');
            }
        };

        checkAuthentication();
    }, [  navigation, onSignOut,  isInitializing, isAuthenticated]);
 

    return <>{children}</>;
};

export default TopLevelNavigationHandler;
