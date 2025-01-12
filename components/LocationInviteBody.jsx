import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, KeyboardAvoidingView } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';

import useLocationFunctions from "../hooks/useLocationFunctions";
import useLocationDetailFunctions from "../hooks/useLocationDetailFunctions";

import { useQueryClient } from "@tanstack/react-query";


import { useAuthUser } from '../context/AuthUserContext';
import LocationDayAndHrsSelector from '../components/LocationDayAndHrsSelector';

// weekday data passed from LocationHoursOfOperation to ScreenLocationSend to here
const LocationInviteBody = ({location, weekdayTextData, initiallySelectedDay}) => {
    const { authUserState } = useAuthUser();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState('');
    const [editedMessage, setEditedMessage] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [hoursForDay, setHoursForDay] = useState('');
    const { themeStyles } = useGlobalStyle();

    const {
        locationList,
        loadingAdditionalDetails,
        useFetchAdditionalDetails,
        clearAdditionalDetails,
        deleteLocationMutation,
      } = useLocationFunctions();

      const { checkIfOpen, getCurrentDay } = useLocationDetailFunctions();
       const [locationDetails, setLocationDetails] = useState(null);
       const [isFetching, setIsFetching] = useState(false);


      const handleRefresh = () => {
        setIsFetching(true);
      };

      const {data: additionalDetails, isLoading, isError, error} = useFetchAdditionalDetails(location || locationDetails, isFetching);

     
      useEffect(() => {
        const updateFromCache = () => {
          //console.log('checking cache for location data');
    
          if (locationList && location) {
            //console.log('location object', locationObject);
            const matchedLocation = locationList.find(
              (loc) => loc.id === location.id
            );
            if (matchedLocation) {
              setLocationDetails(matchedLocation);
    
              //      console.log('cached data for location found: ', matchedLocation);
            } else {
              setLocationDetails(location); //back up if nothing in cache
              //      console.log('no data found in cache for this location');
            }
          }
        };
    
        updateFromCache();
      }, [location, locationList, queryClient]);


        useEffect(() => {
          setIsFetching(false);
          //console.log(currentDayDrilledTwice);
          if (location == true) {
            clearAdditionalDetails();
          }
        }, [location]);
      
  const renderOpenStatus = (data) => {
    let isOpenNow;
    isOpenNow = checkIfOpen(data);

    return (
      <View
        style={[
          {
            marginRight: "2%",
            borderWidth: 2,
            borderColor: isOpenNow
              ? `lightgreen`
              : isOpenNow === false
                ? `red`
                : "transparent",
            backgroundColor:
              themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
       
            width: "auto",
            paddingHorizontal: "3%",
            paddingVertical: "1%",
            borderRadius: 20,
          },
        ]}
      >
        <Text
          style={[
            themeStyles.genericText,
            {
              fontSize: 12,
              fontWeight: "bold",
            },
          ]}
        >
          {isOpenNow ? `Open` : isOpenNow === false ? `Closed` : ""}
        </Text>
      </View>
    );
  };

    useEffect(() => { 
        if (location && location.address) {
            const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
            setMessage(directionsLink); 
            setEditedMessage(`${authUserState.user.username} has sent you a meet up site from the hellofriend app!`); // Default message for editing
        } else {
            setMessage('Directions not available.');
            setEditedMessage('Plan details are not available.');
        }
    }, [location]);

    const handleDaySelect = (day, hours) => {
        setSelectedDay(day);
        setHoursForDay(hours);
    };

    const handleSend = () => {
        
        const finalMessage = `${editedMessage} On ${selectedDay}, ${location?.title} is open ${hoursForDay}. Here are directions: ${message}`;
         
        Linking.openURL(`sms:?body=${encodeURIComponent(finalMessage)}`);
    };


    return (
        <View style={[styles.container, themeStyles.genericTextBackground]}> 
            <View style={{flex: 1, width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
                
            <View style={styles.locationDetailsContainer}>
                <Text style={[styles.locationTitle, themeStyles.genericText]}>{location?.title}</Text>
                <Text style={[styles.locationAddress, themeStyles.genericText]}>{location?.address}</Text>
                              <TouchableOpacity
                                onPress={handleRefresh}
                                style={themeStyles.genericText}
                              >
                                <Text style={[themeStyles.genericText, { fontWeight: "bold" }]}>
                                  GET MORE INFO
                                </Text>
                              </TouchableOpacity>

{additionalDetails && additionalDetails.hours && (
    <>
                <Text style={[styles.previewTitle, themeStyles.genericText]}>Select day</Text>
                
                <LocationDayAndHrsSelector onDaySelect={handleDaySelect} daysHrsData={ additionalDetails?.hours?.weekday_text} initiallySelectedDay={initiallySelectedDay}/>
   
                </>         

)}
            <KeyboardAvoidingView>
                <View style={styles.previewContainer}>
                <Text style={[styles.previewTitle, themeStyles.genericText]}>Add message</Text>
                <TextInput
                    style={[styles.textInput, themeStyles.genericText, themeStyles.genericTextBackgroundShadeTwo]}
                    value={editedMessage}
                    onChangeText={setEditedMessage}
                    multiline
                />
            </View>
            
                
            </KeyboardAvoidingView>
            
            </View>
            
            </View>
 

            <View>
                
            </View>
            <ButtonBaseSpecialSave
              label="SEND "
              maxHeight={80}
              onPress={handleSend} 
              isDisabled={false}
              fontFamily={'Poppins-Bold'}
              image={require("../assets/shapes/redheadcoffee.png")}
            
            />
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
            flex: 1, 
            width: '100%',
            justifyContent: 'space-between', 
          }, 
    locationDetailsContainer: { 
        borderRadius: 8, 
        marginVertical: '2%',
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 16, 
    }, 
    previewContainer: { 
    },
    previewTitle: {
        fontSize: 16,  
        marginBottom: '4%',
    },
    textInput: { 
        textAlign: 'top',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10, 
        height: 100,
    },
});

export default LocationInviteBody;
