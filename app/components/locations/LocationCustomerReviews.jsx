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
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.genericText]}>Reviews</Text> 
        </View>
        <ScrollView horizontal contentContainerStyle={[styles.reviewsContainer]}>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <LocationCustomerReviewCard review={review} backgroundColor={themeStyles.genericTextBackground.backgroundColor} textColor={themeStyles.genericText.color} />
            </View>
          ))}
        </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  
    borderRadius: 30, 
    margin: '4%',
    
    alignContents: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    maxHeight: 300,
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
