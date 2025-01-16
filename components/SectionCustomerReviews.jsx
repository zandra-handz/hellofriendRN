import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ItemCustomerReview from '../components/ItemCustomerReview'; 
import { useLocations } from '../context/LocationsContext';

const SectionCustomerReviews = ({ reviews }) => {
  const { loadingAdditionalDetails } = useLocations();
  const [revealReviews, setRevealReviews] = useState(false);

  const handleRevealReviews = () => {
    setRevealReviews(!revealReviews);
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity onPress={handleRevealReviews} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {revealReviews ? 'Hide Reviews' : 'Show Reviews'}
          </Text>
        </TouchableOpacity>
      </View>
      {revealReviews && (
        <ScrollView horizontal contentContainerStyle={styles.reviewsContainer}>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <ItemCustomerReview review={review} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  reviewsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 240,
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

export default SectionCustomerReviews;
