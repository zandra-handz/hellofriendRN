import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { fetchLocationDetails } from '../api'; // Adjust the import path as needed
import { useAuthUser } from '../context/AuthUserContext';
import CardHours from './CardHours'; // Adjust the import path as needed
import CardLocationPreviewImage from './CardLocationPreviewImage';
import CardCustomerReview from './CardCustomerReview';
import ButtonPhoneNumber from '../components/ButtonPhoneNumber';
import ButtonDirections from '../components/ButtonDirections';
import ButtonSaveLocation from '../components/ButtonSaveLocation';



const ItemViewLocationDetails = ({ location, unSaved }) => {
  const { authUserState } = useAuthUser(); // Access authentication context
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Not using this because it doesn't work, just using unSaved in ButtonSaveLocation instead
  const [ isTemp, setIsTemp ] = useState(unSaved);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (location) {
          const locationData = {
            address: encodeURIComponent(`${location.title} ${location.address}`),
            lat: parseFloat(location.latitude),
            lon: parseFloat(location.longitude),
          };

          // Fetch location details using user ID and address or coordinates
          const fetchedDetails = await fetchLocationDetails(locationData);
          setDetails(fetchedDetails);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [location]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.name}>{details.name}</Text>
        <ButtonSaveLocation saveable={unSaved} />
 
        <View style={[
              styles.statusContainer, 
              (details && details.hours && details.hours.open_now) ? styles.openNowContainer : styles.closedContainer
            ]}>
          <Text style={[styles.statusText, (details && details.hours && details.hours.open_now) ? styles.openNowText : styles.closedText]}>
            {(details && details.hours && details.hours.open_now) ? "Open Now" : "Closed"}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.detailsColumn}>
          <View style={styles.detailRow}>
            <ButtonDirections address={details.address} />
          </View>
          <View style={styles.detailRow}>
            <ButtonPhoneNumber phoneNumber={details.phone}/>
        
          </View>
          <View style={styles.detailRow}> 
            <View style={styles.ratingContainer}>
              {Array.from({ length: Math.floor(details.rating) }, (_, index) => (
                <FontAwesome5 key={index} name="star" size={16} />
              ))}
              {details.rating % 1 !== 0 && (
                <FontAwesome5 name="star-half" size={16}  />
              )}
              <Text style={styles.ratingText}>{details.rating}</Text>
            </View>
          </View>
        </View>
        {details.hours && <CardHours hours={details.hours.weekday_text} />}
      </View>

      <CardLocationPreviewImage photos={details.photos} />

      <ScrollView horizontal style={styles.reviewsContainer}>
        {details.reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <CardCustomerReview review={review} />
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
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
  address: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 4,
  },
  tinyText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',

  },
  phone: {
    fontSize: 14,
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
  reviewsContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  reviewCard: {
    marginRight: 8,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  openNowText: {
    color: 'green',
  },
  closedText: {
    color: 'red',
  },
});

export default ItemViewLocationDetails;