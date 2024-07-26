import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';

const CardLocationPreviewImage = ({ photos }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {photos.map((photoUrl, index) => (
        <Image key={index} style={styles.image} source={{ uri: photoUrl }} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 8,
  },
});

export default CardLocationPreviewImage;
