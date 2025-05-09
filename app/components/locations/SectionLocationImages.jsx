import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const SectionLocationImage = ({ photos }) => {
  const [revealPhotos, setRevealPhotos] = useState(false);

  const handleRevealPhotos = () => {
    setRevealPhotos(!revealPhotos);
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photos</Text>
        <TouchableOpacity onPress={handleRevealPhotos} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {revealPhotos ? 'Hide Photos' : 'Show Photos'}
          </Text>
        </TouchableOpacity>
      </View>
      {revealPhotos && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {photos.map((photoUrl, index) => (
            <Image key={index} style={styles.image} source={{ uri: photoUrl }} />
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
  scrollView: {
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 8,
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

export default SectionLocationImage;
