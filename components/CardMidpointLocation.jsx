import React, { useEffect, useState } from 'react';
import { fetchLocationDetails } from '../api'; // Adjust the import path as needed
import { useAuthUser } from '../context/AuthUserContext';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ButtonPhoneNumber from '../components/ButtonPhoneNumber';
import ButtonDirections from '../components/ButtonDirections';
import ButtonSaveLocation from '../components/ButtonSaveLocation';
import StylingRating from '../components/StylingRating';

const CardMidpointLocation = ({ id, unSaved=true, name, address, mydistance, frienddistance, mytraveltime, friendtraveltime }) => {
  const { authUserState } = useAuthUser(); // Access authentication context
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const showLeftPlaceholder = false;
  const showRightPlaceholder = false;

  useEffect(() => { 
    console.log(frienddistance);
  }, [frienddistance]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (name && address) {
          const locationData = {
            address: encodeURIComponent(`${name} ${address}`),
          };

          // Fetch location details using user ID and address or coordinates
          const fetchedDetails = await fetchLocationDetails(locationData);
          setDetails(fetchedDetails);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [name, address]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}> 
      {showLeftPlaceholder && (
      <View style={styles.iconPlaceholderContainer}>
        <View style={styles.iconPlaceholder} />
      </View>
      )} 
      <View style={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.name}>{details.name}</Text>
        <ButtonSaveLocation saveable={unSaved} />
      </View>
        <StylingRating rating={details.rating} starSize={10} /> 
        
        <ButtonDirections address={details.address} />
        <ButtonPhoneNumber phoneNumber={details.phone}/>
        <View style={styles.bottomBar}>
          <Text style={styles.iconButton}>me: {mytraveltime} | {mydistance.toFixed(2)} mi</Text>
          <Text style={styles.iconButton}>friend: {friendtraveltime} | {frienddistance.toFixed(2)} mi</Text>
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
        {!details && !error && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No details available</Text>
          </View>
        )}
      </View>
      {showRightPlaceholder && (
      <View style={styles.rightPlaceholderContainer}>
        <View style={styles.rightPlaceholder} />
      </View>
      )}
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
