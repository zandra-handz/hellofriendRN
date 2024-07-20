import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { fetchLocationDetails } from '../api'; // Adjust the import path as needed
import { useAuthUser } from '../context/AuthUserContext';

const ItemViewLocationDetails = ({ location }) => {
  const { authUserState } = useAuthUser(); // Access authentication context
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (location) {
          const locationData = {
            address: `${location.title} ${location.address}`,
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
      <Text style={styles.name}>{details.name}</Text>
      <Text style={styles.address}>{details.address}</Text>
      <Text style={styles.phone}>{details.phone}</Text>
      <Text style={styles.rating}>Rating: {details.rating}</Text>

      <View style={styles.imageContainer}>
        {details.photos.map((photoUrl, index) => (
          <Image key={index} style={styles.image} source={{ uri: photoUrl }} />
        ))}
      </View>

      <View style={styles.reviewsContainer}>
        {details.reviews.map((review, index) => (
          <View key={index} style={styles.review}>
            <Text style={styles.reviewAuthor}>{review.author_name}</Text>
            <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,  
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  image: {
    width: '48%',
    height: 150,
    marginBottom: 16,
  },
  reviewsContainer: {
    marginBottom: 16,
  },
  review: {
    marginBottom: 16,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewRating: {
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 16,
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
});

export default ItemViewLocationDetails;
