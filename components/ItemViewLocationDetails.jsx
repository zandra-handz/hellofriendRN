import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { fetchLocationDetails } from '../api'; // Adjust the import path as needed

const ItemViewLocationDetails = ({ location }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location && location.coordinates) {
      const { lat, lng } = location.coordinates;
      
      const fetchDetails = async () => {
        try {
          const data = await fetchLocationDetails(lat, lng);
          setDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [location]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      {details ? (
        <>
          <Text style={styles.title}>{details.name || 'Unknown Location'}</Text>
          <Text>Address: {details.vicinity || 'N/A'}</Text>
          <Text>Rating: {details.rating || 'N/A'}</Text>
          <Text>Types: {details.types.join(', ') || 'N/A'}</Text>
          {details.photos && details.photos.length > 0 && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}` }}
                style={styles.image}
              />
            </View>
          )}
        </>
      ) : (
        <Text>No details available for this location.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  error: {
    color: 'red',
  },
});

export default ItemViewLocationDetails;
