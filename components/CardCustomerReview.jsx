import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const CardCustomerReview = ({ review }) => {
  return (
    <View style={styles.review}>
    <ScrollView>
        <>
      <Text style={styles.reviewAuthor}>{review.author_name}</Text>
      <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
      <Text style={styles.reviewText}>{review.text}</Text>
    </>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  review: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    width: 300,
    height: 200,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
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
});

export default CardCustomerReview;
