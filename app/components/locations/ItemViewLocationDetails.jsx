import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'; 
import { useLocations } from '@/src/context/LocationsContext';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import CardHours from './CardHours';  
import SectionLocationImages from './SectionLocationImages';
import SectionCustomerReviews from './SectionCustomerReviews';
import CallNumberLink from './CallNumberLink';
import DirectionsLink from './DirectionsLink';
import LocationSavingActions from './LocationSavingActions';
import StarsRatingUI from './StarsRatingUI';

const ItemViewLocationDetails = ({ location = {}, unSaved }) => {
  const { loadingAdditionalDetails, useFetchAdditionalDetails } = useLocations();
  
  const [refreshing, setRefreshing] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const [isFetching, setIsFetching] = useState(false);

   
  const { data: additionalDetails, isLoading, isError, error } = useFetchAdditionalDetails(location, isFetching);

  const handleRefresh = () => {
    setIsFetching(true); // Trigger the fetch
  };

  // Check if location is null or undefined and safely access title
  const title = additionalDetails?.name || (location && location.title ? location.title : "Location not available");

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.itemTitle, { color: themeStyles.genericText.color }]}>
          {title}
        </Text>
        <LocationSavingActions location={location} saveable={unSaved} />
      </View>
      <Button
        title={refreshing ? 'Refreshing...' : 'Load Details'}
        onPress={handleRefresh}
        disabled={refreshing}
        style={styles.refreshButton}
      />
      {loadingAdditionalDetails ? (
        <Text style={styles.loadingText}>Loading details...</Text>
      ) : additionalDetails ? (
        <>
          <View style={styles.infoContainer}>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
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
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, 
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular', 
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailsColumn: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 4,
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

export default ItemViewLocationDetails;
