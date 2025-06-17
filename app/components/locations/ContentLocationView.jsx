//  <ButtonSaveLocation location={location} favorite={favorite} />
          

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native'; 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; 
import CardHours from './CardHours';  
import SectionLocationImages from '@/app/components/locations/SectionLocationImages';

import SectionCustomerReviews from '@/app/components/locations/SectionCustomerReviews';
import CallNumberLink from '@/app/components/locations/CallNumberLink';
import DirectionsLink from '@/app/components/locations/DirectionsLink';
import { useFriendList } from '@/src/context/FriendListContext';
import DisplayParkingScore from '@/app/components/locations/DisplayParkingScore';
import DisplayLocationNotes from '@/app/components/locations/DisplayLocationNotes';
import { useLocations } from '@/src/context/LocationsContext';
 
import StarsRatingUI from './StarsRatingUI';


const ContentLocationView = ({ location, favorite }) => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    const { loadingAdditionalDetails, useFetchAdditionalDetails, clearAdditionalDetails, deleteLocationMutation } = useLocations();
   

    const navigation = useNavigation();  
    const [isFetching, setIsFetching] = useState(false);
   
    const { data: additionalDetails, isLoading, isError, error } = useFetchAdditionalDetails(location, isFetching);




    const handleRefresh = () => {
        setIsFetching(true); // Trigger the fetch
    };

    useEffect(() => {
       console.log('Received location:', location);
        if (location == true) {
           clearAdditionalDetails();  
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
          <View style={[styles.container, themeStyles.genericTextBackground]}> 
                      

                <View> 
    {location && location.id && (
      <>
     

 
        <View style={styles.infoContainer}>
          
          <View style={styles.detailsColumn}> 
          <View style={[styles.detailRow, {backgroundColor: themeAheadOfLoading.darkColor}]}>
            <View style={{height: 'auto', backgroundColor: themeAheadOfLoading.darkColor, alignItems: 'flex-end', backgroundColor: 'transparent', justifyContent: 'center', width: '100%'}}>
          
          <DirectionsLink address={location.address} buttonColor={'blue'} fontColor={themeAheadOfLoading.fontColor} backgroundColor={themeAheadOfLoading.darkColor} />

            </View> 
          </View> 
          <View style={styles.detailRow}> 
            <DisplayParkingScore parkingScore={location.parking} size={18}/>
           

          </View> 
            <View style={styles.detailRow}>
              <DisplayLocationNotes notes={location.notes} />
              
            </View>
          </View>
        </View>

      <Button
        title={'Load Details'}
        onPress={handleRefresh}
        disabled={false}
        style={styles.refreshButton}
      />
      {loadingAdditionalDetails ? (
        <Text style={styles.loadingText}>Loading details...</Text>
      ) : additionalDetails ? (
        <>
          <View style={styles.infoContainer}>
            <View style={styles.detailsColumn}>
              <View style={[styles.detailRow, {backgroundColor: themeAheadOfLoading.darkColor}]}>
              <DirectionsLink address={additionalDetails.address} />
              </View>
              <View style={styles.detailRow}>
                <CallNumberLink phoneNumber={additionalDetails.phone} />
                
                <View
                  style={[
                    styles.statusContainer,
                    additionalDetails.hours?.open_now ? styles.openNowContainer : styles.closedContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      additionalDetails.hours?.open_now ? styles.openNowText : styles.closedText,
                    ]}
                  >
                    {additionalDetails.hours?.open_now ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <StarsRatingUI rating={additionalDetails.rating} />
              </View>
            </View>
            {additionalDetails.hours && <CardHours hours={additionalDetails.hours.weekday_text} />}
          </View>

          <SectionLocationImages photos={additionalDetails.photos} />
          <SectionCustomerReviews reviews={additionalDetails.reviews} />
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No additional details available.</Text>
        </View>
      )}
      </>
    )}
    </View>
                    
               
                </View>
        
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, 
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',  
    paddingTop: 10,
    paddingBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailsColumn: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 0,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phone: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
  },
  statusContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 30,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openNowContainer: {
    backgroundColor: '#d4edda',
  },
  closedContainer: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  openNowText: {
    color: 'green',
  },
  closedText: {
    color: 'red',
  },
  refreshButton: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  loadingText: {
    alignSelf: 'center',
    fontSize: 16,
    color: 'gray',
  },
});

export default ContentLocationView;
