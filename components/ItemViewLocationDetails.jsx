import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useLocationList } from '../context/LocationListContext';
import { useAuthUser } from '../context/AuthUserContext';
import CardHours from './CardHours'; // Adjust the import path as needed
import SectionLocationImages from '../components/SectionLocationImages';
import SectionCustomerReviews from '../components/SectionCustomerReviews';
import ButtonPhoneNumber from '../components/ButtonPhoneNumber';
import ButtonDirections from '../components/ButtonDirections';
import ButtonSaveLocation from '../components/ButtonSaveLocation';
import StylingRating from '../components/StylingRating';
 

const ItemViewLocationDetails = ({ location, unSaved }) => {
  const { selectedLocation, additionalDetails, loadingAdditionalDetails } = useLocationList();
  const { authUserState } = useAuthUser(); // Access authentication context



  if (!additionalDetails) {
    return (
      <View style={[styles.noDataContainer, {backgroundColor: 'transparent'}]}>
        <Text style={styles.noDataText}></Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}> 
      <View style={styles.headerContainer}>
        {loadingAdditionalDetails && (
          <Text style={styles.name}>{selectedLocation.title} </Text>
        )}
        {!loadingAdditionalDetails && (
        <>
        <Text style={styles.name}>{additionalDetails.name}</Text>
        <ButtonSaveLocation saveable={unSaved} />
        </> 
        )}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.detailsColumn}>
          <View style={styles.detailRow}>
            <ButtonDirections address={additionalDetails.address} />
          </View>
          <View style={styles.detailRow}>
            <ButtonPhoneNumber phoneNumber={additionalDetails.phone} />
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
            <StylingRating rating={additionalDetails.rating} />
          </View>
        </View>
        {additionalDetails.hours && <CardHours hours={additionalDetails.hours.weekday_text} />}
      </View>

      <SectionLocationImages photos={additionalDetails.photos} />

      <SectionCustomerReviews reviews={additionalDetails.reviews} />
    </ScrollView>
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
  name: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
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
});

export default ItemViewLocationDetails;
