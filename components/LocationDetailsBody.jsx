import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import LocationSavingActions from '../components/LocationSavingActions';

import DirectionsLink from '../components/DirectionsLink';

import useLocationFunctions from '../hooks/useLocationFunctions';
import CallNumberLink from '../components/CallNumberLink';

const LocationDetailsBody = ({
    locationObject,
    }) => {
        
    const { themeStyles } = useGlobalStyle();
    const { loadingAdditionalDetails, useFetchAdditionalDetails, clearAdditionalDetails, deleteLocationMutation } = useLocationFunctions();
    const [isFetching, setIsFetching] = useState(false);
   
    const { data: additionalDetails, isLoading, isError, error } = useFetchAdditionalDetails(locationObject, isFetching);
  
    const handleRefresh = () => {
        setIsFetching(true);   
    };

    useEffect(() => { 
        setIsFetching(false);
        if (locationObject == true) {
            
           clearAdditionalDetails();  
          }
    }, [locationObject]);


    return (

        <View style={styles.container}>
               <View style={styles.rowContainer}> 
                    <Text style={[themeStyles.genericText, {fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase', lineHeight: 22}]}>
                        {locationObject && locationObject.title}
                    </Text>
                </View>  

                    <View style={styles.rowContainer}> 
                    {locationObject && locationObject.address && (
                        <DirectionsLink address={locationObject.address} fontColor={themeStyles.genericText.color} />
                    )}
                    </View>   

                    {locationObject && additionalDetails && additionalDetails.phone &&(

                    <View style={styles.rowContainer}> 
                     <CallNumberLink phoneNumber={additionalDetails.phone} />
                    </View> 

                    )}

                {locationObject && locationObject.notes && ( 
                    <View style={styles.rowContainer}> 
                        <Text style={[styles.subtitle, themeStyles.genericText]}>Notes: </Text>
                        <Text style={themeStyles.genericText}>
                            {locationObject.notes}
                        </Text>
                    </View>   
                )}    
                
                {locationObject && locationObject.parking && ( 
                    <View style={styles.rowContainer}> 
                        <Text style={[styles.subtitle, themeStyles.genericText]}>Parking: </Text>
                        <Text style={themeStyles.genericText}>
                            {locationObject && locationObject.parking}
                        </Text>
                    </View> 
                    )} 

                {locationObject && locationObject.helloCount && ( 
                <View style={styles.rowContainer}> 
                    <Text style={[styles.subtitle, themeStyles.genericText]}>Helloes here: </Text>
                    <Text style={themeStyles.genericText}>
                        {locationObject && locationObject.helloCount}
                    </Text>
                </View> 
                )} 
                {locationObject && !additionalDetails && ( 
                <View style={[styles.rowContainer, {paddingVertical: '10%'}]}> 
                    <TouchableOpacity onPress={handleRefresh} style={themeStyles.genericText}>
                        <Text style={[themeStyles.genericText, {fontWeight: 'bold'}]}>GET MORE INFO</Text>
                    </TouchableOpacity>
                </View> 
                )} 

                {locationObject &&  (
                    <View style={{position: 'absolute', flexDirection: 'row', bottom: 10, width: '100%', left: 0}}> 
                    <LocationSavingActions location={locationObject} />
                     
                    </View>
                )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 15,
    
    }, 
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: '1%',

    },
});



export default LocationDetailsBody;