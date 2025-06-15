import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import LocationCustomerReviewCard from './LocationCustomerReviewCard';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
 
const LocationCustomerReviews = ({ reviews }) => {
 
    const { themeStyles } = useGlobalStyle();

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container]}>
 
        <ScrollView horizontal nestedScrollEnabled snapToAlignment='start' pagingEnabled contentContainerStyle={[styles.reviewsContainer]} >
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <LocationCustomerReviewCard review={review} backgroundColor={themeStyles.genericTextBackground.backgroundColor} textColor={themeStyles.genericText.color} />
            </View>
          ))}
          <View style={{width: 400}}></View>
        </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {   
    
    
    alignContents: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
      flexDirection: 'row',
 
  }, 
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  reviewsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    maxHeight: 200,
  },
  reviewCard: {
    marginRight: 8,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});

export default LocationCustomerReviews;
