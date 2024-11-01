import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useLocationList } from '../context/LocationListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ContentContentLocationView from '../components/ContentContentLocationView';
 

const ContentLocationView = ({ location }) => {
    const { themeStyles } = useGlobalStyle();
    const { clearAdditionalDetails, deleteLocationMutation, isDeletingLocation, selectedLocation, setSelectedLocation } = useLocationList();
    const navigation = useNavigation();
    const [isTemp, setIsTemp] = useState(false);

    useEffect(() => {
        console.log('Received location:', location);
        if (location == true) {
            clearAdditionalDetails();
            setSelectedLocation(location);
            console.log('Setting selectedLocation to:', location);
        }
    }, [location]);

    useEffect(() => {
        if (location && location.id) {
            setIsTemp(String(location.id).startsWith('temp'));
        }
    }, [location]); 

    const navigateToLocationsScreen = () => {
        navigation.navigate('Locations'); 
      };

    useEffect(() => {
        if (deleteLocationMutation.isSuccess) {
            navigateToLocationsScreen();
        }

    }, [deleteLocationMutation.isSuccess]);
 
 

    return (
        <>  
        {location ? (
                <View style={[styles.container, themeStyles.genericTextBackground]}> 
                      

                    <ContentContentLocationView  /> 
                    
               
                </View>
            ) : null
        } 
        
        </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    width: '100%', 
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: '16%',  
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 0,
  }
});

export default ContentLocationView;
