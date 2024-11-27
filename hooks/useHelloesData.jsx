import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import { fetchPastHelloes } from '../api'; 
import { useQuery } from '@tanstack/react-query'; 
import SearchBarForFormattedData from '../components/SearchBarForFormattedData';
import HelloView from '../components/HelloView';
import { Ionicons } from '@expo/vector-icons'; 
  
import HelloesList from '../components/HelloesList';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useMessage } from '../context/MessageContext';

import CustomTabBar from '../components/CustomTabBar';

 


const useHelloesData = () => {  
    const { selectedFriend } = useSelectedFriend();

    const { data: helloesList, isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['pastHelloes', selectedFriend?.id],
        queryFn: () => fetchPastHelloes(selectedFriend.id),
        enabled: !!selectedFriend,
        onSuccess: (data) => { 
            
        }
    });


    const helloesIsFetching = isFetching; 
    //(Not sure which one to use)
    const helloesIsLoading = isLoading;
    const helloesIsError = isError;
    const helloesIsSuccess = isSuccess;

 


    const inPersonHelloes = useMemo(() => {
        if (helloesList) {
       
        console.log('filtering helloes in useMemo function');
        return helloesList.filter(hello => hello.type === 'in person');
    }
    }, [helloesList]);
    
 
 
    const flattenHelloes = useMemo(() => {
        if (helloesList) {
        
        return helloesList.flatMap((hello) => {
          const pastCapsules = hello.pastCapsules || []; // Ensure it's an array or an empty one if undefined
    
             return pastCapsules.length > 0 ? 
                pastCapsules.map(capsule => ({
                    id: hello.id,
                    date: hello.date,
                    type: hello.type,
                    typedLocation: hello.typedLocation,
                    locationName: hello.locationName,
                    location: hello.location,
                    additionalNotes: hello.additionalNotes || '', // Keep existing additional notes
                    capsuleId: capsule.id,     
                    capsule: capsule.capsule,   
                    typedCategory: capsule.typed_category  
                })) :
                [{
                    id: hello.id,
                    date: hello.date,
                    type: hello.type,
                    typedLocation: hello.typedLocation,
                    locationName: hello.locationName,
                    location: hello.location,
                    additionalNotes: hello.additionalNotes || '', // Keep existing additional notes
                    capsuleId: null,             
                    capsule: null,
                    typedCategory: null
                }];
        });
    }
    }, [helloesList]);
 
    


 

    return { 
        helloesList,
        isFetching,
        flattenHelloes,
        inPersonHelloes,
        helloesIsFetching,
        helloesIsLoading,
        helloesIsSuccess,
        helloesIsError,
};

}



export default useHelloesData;
