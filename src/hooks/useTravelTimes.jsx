import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetTravelComparisons } from '@/src/calls/api';


//should move the friend/user results data and/or the combined data into separate function
//or set/return a different way

const useTravelTimes = () => {
   const queryClient = useQueryClient(); // React Query's Query Client
    const [travelTimeResultsView, setTravelTimeResultsView] = useState(false);
    const [travelTimeResults, setTravelTimeResults] = useState(false);
    
    const [ userTravelTime, setUserTravelTime ] = useState(null);
    const [ friendTravelTime, setFriendTravelTime ] = useState(null);
    

    const travelTimesMutation = useMutation({
        mutationFn: async (locationData) => {
            const results = await GetTravelComparisons(locationData);
            return results.compare_directions;  
        },
        onSuccess: (data, variables) => { 
            const cacheKey = [
                'travelTimes', 
                variables.address_a_address, 
                variables.address_b_address,
                variables.destination_address
            ];
            queryClient.setQueryData(cacheKey, {
                travelTime: data,
                locationData: variables // Store the original location data as well
            }, {
                cacheTime: 3600000 // 1 hour (in milliseconds)
            });
            
            setTravelTimeResults(data);
            setTravelTimeResultsView(true);  
            setUserTravelTime({
              time: data.Me ? data.Me.duration : 'N/A',
              miles: data.Me ? data.Me.distance : 'N/A',
            });

            setFriendTravelTime({
              time: data.friend ? data.friend.duration : 'N/A',
              miles: data.friend ? data.friend.distance : 'N/A',
            });
 
        },
        onError: (error) => {
            console.error('Error getting travel comparisons:', error);
        },
    });

    const fetchTravelTimes = (userAddress, friendAddress, destinationLocation ) => {
        
        
        
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
 
        //const cachedData = queryClient.getQueryData(['travelTimes', locationData]);
        const cachedData = queryClient.getQueryData([
            'travelTimes', 
            userAddress.address, 
            friendAddress.address, 
            destinationLocation.address
        ]);
        //console.log(`cached data: `, cachedData);

        if (cachedData) {
            //console.log('Using cached travel times:', cachedData);
            setTravelTimeResults(cachedData);
            setTravelTimeResultsView(true);
            setUserTravelTime({
              time: cachedData.travelTime.Me ? cachedData.travelTime.Me.duration : 'N/A',
              miles: cachedData.travelTime.Me ? cachedData.travelTime.Me.distance : 'N/A',
            });

            setFriendTravelTime({
              time: cachedData.travelTime.friend ? cachedData.travelTime.friend.duration : 'N/A',
              miles: cachedData.travelTime.friend ? cachedData.travelTime.friend.distance : 'N/A',
            });

        } else { 
            travelTimesMutation.mutate(locationData);
        }
    };

    const checkCache = (userAddress, friendAddress, destinationLocation) => {

        const cachedData = queryClient.getQueryData([
            'travelTimes', 
            userAddress.address, 
            friendAddress.address, 
            destinationLocation.address
        ]);
        //console.log(`cached data in checkCache: `, cachedData);
       
        if (cachedData) {
            //console.log('Using cached travel times:', cachedData);
            //updateTravelTimeData(cachedData);
            return cachedData.travelTime; // Cache found
        }
        return null; // No cache found
    };

 

    return {
        checkCache,
        fetchTravelTimes,
        travelTimeResults, //: travelTimesMutation.data,
        travelTimeResultsView,
        travelTimesMutation,
        userTravelTime,
        friendTravelTime,
    };
};

export default useTravelTimes;