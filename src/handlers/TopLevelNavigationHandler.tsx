 
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const TopLevelNavigationHandler = ({ userId, isInitializing, children }) => {
    const navigation = useNavigation();
 
 
 

    useEffect(() => { 
      
        const checkAuthentication = async () => {
           
            if (isInitializing) { 
                  console.log('nav useeffect triggerd! returning without doing anything');
                return; // Wait until loading is complete
            }
 
            if (!userId) {
                console.log('nav useeffect triggerd! not authenticated');
             
                 
                    //  onSignOut();  

                     //not necessary for signing out, but leaving here for right now while debugging the blank green screen issue
                    navigation.navigate('Welcome'); 
                // }
            }

            if (userId) {
                   console.log('nav useeffect triggerd! authenticated, not doing anything');
            }
        };

        checkAuthentication();
    }, [  navigation, isInitializing, userId]);
 

    return <>{children}</>;
};

export default TopLevelNavigationHandler;
