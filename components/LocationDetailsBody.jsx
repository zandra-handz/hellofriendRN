import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import LocationSavingActions from '../components/LocationSavingActions';

import DirectionsLink from '../components/DirectionsLink';

import useLocationFunctions from '../hooks/useLocationFunctions';
import CallNumberLink from '../components/CallNumberLink';

import LocationHoursOfOperation from '../components/LocationHoursOfOperation';

import  useLocationDetailFunctions from '../hooks/useLocationDetailFunctions';

const LocationDetailsBody = ({
    locationObject,
    currentDayDrilledTwice,
    }) => {
        
    const { themeStyles } = useGlobalStyle();
    const { loadingAdditionalDetails, useFetchAdditionalDetails, clearAdditionalDetails, deleteLocationMutation } = useLocationFunctions();
    const [isFetching, setIsFetching] = useState(false);
   const { checkIfOpen, getCurrentDay } = useLocationDetailFunctions();
    const { data: additionalDetails, isLoading, isError, error } = useFetchAdditionalDetails(locationObject, isFetching);
  

    const handleRefresh = () => {
        setIsFetching(true);   
    };

    useEffect(() => { 
        setIsFetching(false);
        console.log(currentDayDrilledTwice);
        if (locationObject == true) {
            
           clearAdditionalDetails();  
          }
    }, [locationObject]);
 
    const renderOpenStatus = (data) => {
        let isOpenNow;
        isOpenNow = checkIfOpen(data); 

        return ( 
            <View style={[ 
                {borderWidth: 1, 
                borderColor: isOpenNow ? `lightgreen` : (isOpenNow === false ? `red` : 'transparent'), 
                backgroundColor: 'transparent', //themeStyles.genericTextBackgroundShadeTwo.backgroundColor, 
                position: 'absolute', 
                top: -30, 
                left: 0, 
                width: 'auto', 
                paddingHorizontal: '3%', 
                paddingVertical: '1%', 
                borderRadius: 20}]}>
                <Text style={[themeStyles.genericText, {
                fontSize: 13}]}>
                    {isOpenNow ? `Open` : (isOpenNow === false ? `Closed` : '') }
                </Text>  
            </View>
            

        );


    };


    return (

        <View style={styles.container}>
               <View style={[styles.rowContainer]}> 
                    <Text style={[themeStyles.genericText, {fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase', lineHeight: 22}]}>
                        {locationObject && locationObject.title}
                    </Text> 
                    {locationObject && additionalDetails && additionalDetails.hours &&(
                        <>
                     {renderOpenStatus(additionalDetails.hours)}
                     
                     </>
                    
                    )}
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

                    {locationObject && additionalDetails && additionalDetails.hours &&(

                    <View style={styles.rowContainer}> 
                    <LocationHoursOfOperation location={locationObject} data={additionalDetails.hours} currentDayDrilledThrice={currentDayDrilledTwice} /> 
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