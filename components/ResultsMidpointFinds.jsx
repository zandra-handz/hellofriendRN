import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { SearchForMidpointLocations } from '../api';
import CardMidpointLocation from '../components/CardMidpointLocation';
import ItemViewLocation from '../components/ItemViewLocation'; 


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
    const [sortOrder, setSortOrder] = useState(null); // No initial sorting

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

                    // Set results without sorting initially
                    setMidpointLocationResults(results || []);
                } catch (error) {
                    console.error("Error getting midpoint locations:", error);
                }
                setIsLoading(false);
            };

            fetchMidpointData();
        }
    }, [triggerFetch, userAddress, friendAddress, destinationLocation]);

    const sortData = (data, order) => {
        return data.slice().sort((a, b) => {
            switch (order) {
                case 'timeDifference':
                    return a.time_difference - b.time_difference;
                case 'minTravelTime':
                    const minTimeA = Math.min(a.travel_times[0]?.Me || Infinity, a.travel_times[1]?.friend || Infinity);
                    const minTimeB = Math.min(b.travel_times[0]?.Me || Infinity, b.travel_times[1]?.friend || Infinity);
                    return minTimeA - minTimeB;
                case 'maxTravelTime':
                    const maxTimeA = Math.max(a.travel_times[0]?.Me || -Infinity, a.travel_times[1]?.friend || -Infinity);
                    const maxTimeB = Math.max(b.travel_times[0]?.Me || -Infinity, b.travel_times[1]?.friend || -Infinity);
                    return maxTimeA - maxTimeB;
                default:
                    return 0;
            }
        });
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
        // Sort data and update state when sort order changes
        setMidpointLocationResults(prevResults => sortData(prevResults, order));
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
                                fullLocationData={item}
                                name={item.name}
                                address={item.address}
                                mydistance={item.distances[0]?.Me}
                                frienddistance={item.distances[1]?.friend}
                                mytraveltime={item.travel_times[0]?.Me}
                                friendtraveltime={item.travel_times[1]?.friend}
                                timeDifference={item.time_difference}
                                distanceDifference={item.distance_difference}
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
            <View style={styles.buttonContainer}>
                <Button title="by time" onPress={() => handleSortChange('timeDifference')} />
                <Button title="by max time" onPress={() => handleSortChange('maxTravelTime')} />
            </View>
            {renderComparisonResults()}
            {!isLoading && midpointLocationResults.length === 0 && (
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
});

export default ResultsMidpointFinds;
