// ResultsTravelComparison.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GetTravelComparisons } from '../api'; // Ensure the path is correct
import { useLocationList } from '../context/LocationListContext';

const ResultsTravelComparison = ({ 
    userAddress, 
    friendAddress, 
    destinationLocation, 
    triggerFetch 
  }) => {
    const [travelTimeResults, setTravelTimeResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [travelTimeResultsView, setTravelTimeResultsView] = useState(false);
  
    useEffect(() => {
      if (triggerFetch) {
        const fetchTravelData = async () => {
          setIsLoading(true);
          try {
            const locationData = {
              address_a_address: userAddress.address,
              address_a_lat: parseFloat(userAddress.lat),
              address_a_long: parseFloat(userAddress.lng),
              address_b_address: friendAddress.address,
              address_b_lat: parseFloat(friendAddress.lat),
              address_b_long: parseFloat(friendAddress.lng),
              destination_address: destinationLocation.address,
              destination_lat: parseFloat(destinationLocation.latitude),
              destination_long: parseFloat(destinationLocation.longitude),
              perform_search: false, 
            };
  
            console.log(locationData);
  
            const results = await GetTravelComparisons(locationData);
            console.log(results.compare_directions);
            setTravelTimeResults(results.compare_directions);
            setTravelTimeResultsView(true);
            console.log("Travel comparisons requested successfully");
          } catch (error) {
            console.error("Error getting travel comparisons:", error);
          }
          setIsLoading(false);
        };
  
        fetchTravelData();
      }
    }, [triggerFetch, userAddress, friendAddress, destinationLocation]);
  
    const renderComparisonResults = () => {
      if (!travelTimeResults) return null;
  
      const myData = {
        time: travelTimeResults.Me ? travelTimeResults.Me.duration : 'N/A',
        miles: travelTimeResults.Me ? travelTimeResults.Me.distance : 'N/A',
      };
  
      const friendData = {
        time: travelTimeResults.friend ? travelTimeResults.friend.duration : 'N/A',
        miles: travelTimeResults.friend ? travelTimeResults.friend.distance : 'N/A',
      };
  
      return (
        <View style={{width: '100%'}}>
          <Text style={styles.header}>Travel Comparison Results</Text>
          <View style={styles.resultsContainer}>

          
          <View style={styles.card}>
            <Text style={styles.title}>Your Travel Time</Text>
            <Text style={styles.detail}>Duration: {myData.time}</Text>
            <Text style={styles.detail}>Distance: {myData.miles}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Friend's Travel Time</Text>
            <Text style={styles.detail}>Duration: {friendData.time}</Text>
            <Text style={styles.detail}>Distance: {friendData.miles}</Text>
          </View>
          </View>
        </View>
      );
    };
  
    return (
      <View style={styles.container}>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {travelTimeResultsView && !isLoading ? renderComparisonResults() : null}
        {!travelTimeResultsView && !isLoading && (
          <Text style={styles.message}>No travel time results available.</Text>
        )}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 14, 
  },
  message: {
    fontSize: 16, 
  },
});

export default ResultsTravelComparison;
