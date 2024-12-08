import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';


import SlideUpToOpen from '../components/SlideUpToOpen';

import LocationSavingActions from '../components/LocationSavingActions';
import LocationNotes from '../components/LocationNotes';
import DirectionsLink from '../components/DirectionsLink';

import useLocationFunctions from '../hooks/useLocationFunctions';
import CallNumberLink from '../components/CallNumberLink';

import LocationHoursOfOperation from '../components/LocationHoursOfOperation';
import { useQueryClient } from '@tanstack/react-query'; // Import QueryClient hook

import  useLocationDetailFunctions from '../hooks/useLocationDetailFunctions';

//pulling the data from locationList and using the useEffect gets it to update
//must be better way. for some reason the query client is returning undefined from the cache

const LocationDetailsBody = ({
    locationObject,
    appOnlyLocationObject, //is not stored in cache, is calculated via the useLocationHelloesFunctions in the location search screen
    currentDayDrilledTwice,
    }) => {
        
    const { themeStyles } = useGlobalStyle();
    const { locationList, loadingAdditionalDetails, useFetchAdditionalDetails, clearAdditionalDetails, deleteLocationMutation } = useLocationFunctions();
    const [isFetching, setIsFetching] = useState(false);
   const { checkIfOpen, getCurrentDay } = useLocationDetailFunctions();
    const { data: additionalDetails, isLoading, isError, error } = useFetchAdditionalDetails(locationObject || locationDetails, isFetching);
    const queryClient = useQueryClient();
    const [ locationDetails, setLocationDetails ] = useState(null);

    const handleRefresh = () => {
        setIsFetching(true);   
    };

    useEffect(() => {
        const updateFromCache = () => {
            //console.log('checking cache for location data');
          
            if (locationList && locationObject) {
                //console.log('location object', locationObject);
                const matchedLocation = locationList.find(
                    (loc) => loc.id === locationObject.id
                );
                if (matchedLocation) {
                    setLocationDetails(matchedLocation);

              //      console.log('cached data for location found: ', matchedLocation);
                } else {
                    setLocationDetails(locationObject); //back up if nothing in cache
              //      console.log('no data found in cache for this location');
                }
            }
        };

        updateFromCache();
    }, [locationObject, locationList, queryClient]);

    useEffect(() => { 
        setIsFetching(false);
        //console.log(currentDayDrilledTwice);
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
            {locationDetails && (
               <>
               <View style={[styles.rowContainer]}> 
                    <Text style={[themeStyles.genericText, {fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase', lineHeight: 22}]}>
                        {locationDetails.title || 'No title found'}
                    </Text> 
                    {additionalDetails && additionalDetails.hours &&(
                        <>
                     {renderOpenStatus(additionalDetails.hours)}
                     
                     </>
                    
                    )}
                </View>  

                    <View style={styles.rowContainer}> 
                    {locationDetails.address && (
                        <DirectionsLink address={locationDetails.address} fontColor={themeStyles.genericText.color} />
                    )}
                    </View>   

                    {additionalDetails && (
                        <>
                            {additionalDetails.phone && (
                            <View style={styles.rowContainer}> 
                                <CallNumberLink phoneNumber={additionalDetails.phone} />
                            </View> 
                            )} 

                            {additionalDetails.hours &&(
                            <View style={styles.rowContainer}> 
                                <LocationHoursOfOperation location={locationObject} data={additionalDetails.hours} currentDayDrilledThrice={currentDayDrilledTwice} /> 
                            </View> 
                            )}
                        </>
                    )}

                {locationDetails.personal_experience_info && ( 
                    <View style={styles.rowContainer}> 
                        <Text style={[styles.subtitle, themeStyles.genericText]}>Notes: </Text>
                        <Text style={themeStyles.genericText}>
                            {locationDetails.personal_experience_info || 'None'}
                        </Text>
                    </View>   
                )}    
                
                {locationDetails.parking_score && ( 
                    <View style={styles.rowContainer}> 
                        <Text style={[styles.subtitle, themeStyles.genericText]}>Parking: </Text>
                        <Text style={themeStyles.genericText}>
                            {locationDetails && locationDetails.parking_score}
                        </Text>
                    </View> 
                    )} 

                {appOnlyLocationObject && appOnlyLocationObject.helloCount > 0 && ( 
                <View style={styles.rowContainer}> 
                    <Text style={[styles.subtitle, themeStyles.genericText]}>Helloes here: </Text>
                    <Text style={themeStyles.genericText}>
                        {appOnlyLocationObject.helloCount}
                    </Text>
                </View> 
                )} 
                {locationDetails && !additionalDetails && ( 
                <View style={[styles.rowContainer, {paddingVertical: '10%'}]}> 
                    <TouchableOpacity onPress={handleRefresh} style={themeStyles.genericText}>
                        <Text style={[themeStyles.genericText, {fontWeight: 'bold'}]}>GET MORE INFO</Text>
                    </TouchableOpacity>
                </View> 
                )} 

                

                {locationDetails &&  (
                    <>
                    <View style={[themeStyles.genericTextBackground, {position: 'absolute', flexDirection: 'row', bottom: 10, width: '100%', left: 0}]}> 
                    <LocationSavingActions location={locationDetails} />
                    
                    </View>
                    {locationDetails.id && (
                       
                    <View style={[themeStyles.genericTextBackground, {position: 'absolute', flexDirection: 'row', bottom: 10, width: '100%', left: 48}]}> 
                     <LocationNotes location={locationDetails && locationDetails} />
                    </View>
                    )}

                    </>
                )}
              </>   
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
    sliderContainer: {
         width: 40,
         position: 'absolute',
          bottom: 120,
          right: 50,
          height: '50%',
        borderRadius: 20,  
        zIndex: 2000,
        backgroundColor: 'pink',  
      },
});



export default LocationDetailsBody;