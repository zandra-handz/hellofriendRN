import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { useLocationList } from '../context/LocationListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ContentContentLocationView from '../components/ContentContentLocationView';


const ContentLocationView = ({ location }) => {
    const { themeStyles } = useGlobalStyle();
    const { clearAdditionalDetails, selectedLocation, setSelectedLocation } = useLocationList();
    
    const [isTemp, setIsTemp] = useState(false);

    useEffect(() => {
        console.log('Received location:', location);
        if (location) {
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
 
 

    return (
        <>  
        {location ? (
                <View style={[styles.modalContainer, themeStyles.genericTextBackground]}> 
                    <ContentContentLocationView location={location} unSaved={isTemp} />
                    <View style={styles.buttonContainer}> 
                    </View>
                </View>
            ) : null
        } 
        
        </>
    );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,  
    width: '100%', 
  },
  buttonContainer: {
    height: '16%',  
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 0,
  }
});

export default ContentLocationView;
