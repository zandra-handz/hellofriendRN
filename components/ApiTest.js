import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import api from '../api';

const ApiTest = () => {
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.get('friends/'); // Replace '/test-endpoint' with your actual endpoint
            setResponseData(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {error ? (
                <Text>Error: {error}</Text>
            ) : responseData ? (
                <View>
                    <Text>Response Data:</Text>
                    <Text>{JSON.stringify(responseData)}</Text>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
            <Button title="Refresh Data" onPress={fetchData} />
        </View>
    );
};

export default ApiTest;
