import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SearchForMidpointLocations } from '../api';
import CardMidpointLocation from '../components/CardMidpointLocation';

const ResultsMidpointFinds = ({ 
    userAddress, 
    friendAddress, 
    destinationLocation, 
    search='coffee',
    radius='5000',
    length='6',
    triggerFetch 
}) => {
    const [midpointLocationResults, setMidpointLocationResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [midpointLocationResultsView, setMidpointLocationResultsView] = useState(false);

    useEffect(() => {
        if (triggerFetch) {
            const fetchMidpointData = async () => {
                setIsLoading(true);
                try {
                    const locationData = {
                        address_a_address: userAddress.address,
                        address_a_lat: parseFloat(userAddress.lat),
                        address_a_long: parseFloat(userAddress.lng),
                        address_b_address: friendAddress.address,
                        address_b_lat: parseFloat(friendAddress.lat),
                        address_b_long: parseFloat(friendAddress.lng),
                        search: search,
                        radius: parseFloat(radius),
                        length: parseFloat(length),
                    };

                    console.log('Request data:', locationData);

                    const results = await SearchForMidpointLocations(locationData);
                    console.log('Search for Midpoint Response:', results);

                    // Use results directly
                    setMidpointLocationResults(results || []);
                    setMidpointLocationResultsView(true);
                } catch (error) {
                    console.error("Error getting midpoint locations:", error);
                }
                setIsLoading(false);
            };

            fetchMidpointData();
        }
    }, [triggerFetch, userAddress, friendAddress, destinationLocation]);

    const handleSaveLocation = (item) => {
        // Define what should happen when a location is saved
        console.log('Save location:', item);
    };

    const renderComparisonResults = () => {
        if (!midpointLocationResults || midpointLocationResults.length === 0) {
            return <Text style={styles.message}>No results found</Text>;
        }

        return (
            <View style={styles.resultsContainer}>
                <FlatList
                    data={midpointLocationResults}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSaveLocation(item)}>
                            <CardMidpointLocation
                                name={item.name}
                                address={item.address}
                                mydistance={item.distances[0]?.Me}
                                frienddistance={item.distances[1]?.friend}
                                mytraveltime={item.travel_times[0]?.Me}
                                friendtraveltime={item.travel_times[1]?.friend}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            {midpointLocationResultsView ? renderComparisonResults() : null}
            {!midpointLocationResultsView && !isLoading && (
                <Text style={styles.message}>Did not find any midpoints. Try adjusting the radius or the search term.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    resultsContainer: {
        flex: 1,
        width: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        backgroundColor: 'white',
    },
    message: {
        fontSize: 16,
    },
});

export default ResultsMidpointFinds;
