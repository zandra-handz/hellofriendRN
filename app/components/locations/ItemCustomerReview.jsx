import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import LoadingPage from '../appwide/spinner/LoadingPage';
 
import StylingRating from './StylingRating';
import { useLocations } from '@/src/context/LocationsContext';

//import useLocationFunctions from '../hooks/useLocationFunctions';

// Function to format Unix timestamp to a readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString(); // Formats as "MM/DD/YYYY" by default
};

const ItemCustomerReview = ({ review }) => {
  const { loadingAdditionalDetails } = useLocations();

  const [revealReviews, setRevealReviews] = useState(true);

  const handleRevealReviews = () => {
    setRevealReviews(true);
  };

  return (
    <View style={styles.review}>
      {loadingAdditionalDetails && (
        <LoadingPage loading={loadingAdditionalDetails} spinnerType='wander' />
      )}
      {!loadingAdditionalDetails && (
        <ScrollView>
          <View style={styles.reviewAuthorRatingContainer}>
            <Text style={styles.reviewAuthor}>{review.author_name}</Text>
            <StylingRating rating={review.rating} starSize={11} fontSize={13} />
          </View>
          <Text style={styles.reviewDate}>{formatDate(review.time)}</Text>
          <Text style={styles.reviewText}>{review.text}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  review: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    width: 300,
    height: 240,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewAuthorRatingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    fontFamily: 'Poppins-Bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  reviewText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
});

export default ItemCustomerReview;
