// Rating.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const StylingRating = ({ rating, icon='star', iconHalf='star-half', starSize=16, starColor='black', fontSize=14 }) => {
  return (
    <View style={styles.ratingContainer}>
      {Array.from({ length: Math.floor(rating) }, (_, index) => (
        <FontAwesome5 key={index} name={`${icon}`} size={starSize} color={starColor}/>
      ))}
      {rating % 1 !== 0 && (
        <FontAwesome5 name={`${iconHalf}`} size={starSize} />
      )}
      <Text style={[styles.ratingText, { fontSize: fontSize }]}>
        {rating}
    </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default StylingRating;
