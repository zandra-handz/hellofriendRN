import React, { useState } from 'react';
import { fetchLocationDetails } from '../api'; // Adjust the import path as needed
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import ButtonPhoneNumber from '../components/ButtonPhoneNumber';
import ButtonDirections from '../components/ButtonDirections';
import ButtonMakeTempLocation from '../components/ButtonMakeTempLocation';
import StylingRating from '../components/StylingRating';

const CardMidpointLocation = ({ fullLocationData, id, unSaved=true, name, address, mydistance, frienddistance, mytraveltime, friendtraveltime, timeDifference, distanceDifference }) => {

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false since we are not loading by default
  const [error, setError] = useState(null); 

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      if (name && address) {
        const locationData = {
          address: encodeURIComponent(`${name} ${address}`),
        };
        const fetchedDetails = await fetchLocationDetails(locationData);
        setDetails(fetchedDetails);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}> 
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{name}</Text> 
          <ButtonMakeTempLocation location={fullLocationData} />
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : details ? (
          <>
            <StylingRating rating={details.rating} starSize={10} /> 
            <ButtonDirections address={details.address} />
            <ButtonPhoneNumber phoneNumber={details.phone} />
          </>
        ) : (
          <Button title="Load Details" onPress={fetchDetails} />
        )}

        <View style={styles.bottomBar}>
          <Text style={styles.iconButton}>me: {mytraveltime} | {mydistance.toFixed(2)} mi</Text>
          <Text style={styles.iconButton}>friend: {friendtraveltime} | {frienddistance.toFixed(2)} mi</Text>
        </View>
        <View style={styles.bottomBar}>
          <Text style={styles.iconButton}>time difference: {timeDifference.toFixed(2)}</Text>
          <Text style={styles.iconButton}>distance difference: {distanceDifference.toFixed(2)}</Text>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
        
        {!details && !error && !loading && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}></Text>
          </View>
        )}
      </View>
    </View>
  );
};
 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding:10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    borderTopWidth: 0.5, 
    borderTopColor: '#ccc',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 2,
  },
  secondHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  iconPlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'hotpink', // Adjusted color to match your style
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  address: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    marginVertical: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  rightPlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'hotpink', // Adjusted color to match your style
  },
  errorContainer: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
  noDataContainer: {
    marginTop: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
  },
});

export default CardMidpointLocation;
