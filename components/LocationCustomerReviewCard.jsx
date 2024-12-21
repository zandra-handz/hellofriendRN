import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

import LoadingPage from '../components/LoadingPage';
 
import StylingRating from '../components/StylingRating';

import useLocationFunctions from '../hooks/useLocationFunctions';

// Function to format Unix timestamp to a readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString(); // Formats as "MM/DD/YYYY" by default
};

const LocationCustomerReviewCard = ({ review, backgroundColor='white', textColor='black' }) => {
  const { loadingAdditionalDetails } = useLocationFunctions();
 

  return (
    <View style={[styles.review, {backgroundColor: backgroundColor}]}>
      {loadingAdditionalDetails && (
        <LoadingPage loading={loadingAdditionalDetails} spinnerType='wander' />
      )}
      {!loadingAdditionalDetails && (
        <ScrollView>
          <View style={[styles.reviewAuthorRatingContainer, {backgroundColor: backgroundColor}]}>
            <Text style={[styles.reviewAuthor, {color: textColor}]}>{review.author_name}</Text>
            <StylingRating rating={review.rating} starSize={11} fontSize={13} starColor='orange' />
          </View>
          <Text style={[styles.reviewDate, {color: textColor}]}>{formatDate(review.time)}</Text>
          <Text style={[styles.reviewText, {color: textColor}]}>{review.text}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  review: { 
    padding: '10%', 
    borderRadius: 30,
    width: 240,
    height: '100%',  
    //borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'limegreen',
  },
  reviewAuthorRatingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    //fontFamily: 'Poppins-Bold',
    fontSize: 15,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12, 
    marginBottom: 10,
    //fontFamily: 'Poppins-Regular',
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 18,
    //fontFamily: 'Poppins-Regular',
  },
});

export default LocationCustomerReviewCard;
