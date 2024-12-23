import React, { useMemo, useRef } from 'react';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchPastHelloes, saveHello } from '../api'; 
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';  

 


const useHelloesData = () => {  
    const { selectedFriend } = useSelectedFriend();
    const { authUserState } = useAuthUser();
    
    const queryClient = useQueryClient();

      const timeoutRef = useRef(null);
    

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
          const pastCapsules = hello.pastCapsules || [];  
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


    const createHelloMutation = useMutation({
        mutationFn: (data) => saveHello(data),
        onError: (error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
    
          timeoutRef.current = setTimeout(() => {
            createHelloMutation.reset();
          }, 2000);
        },
        onSuccess: (data) => {
          queryClient.setQueryData(["pastHelloes"], (old) => {
            const updatedHelloes = old ? [data, ...old] : [data];
            return updatedHelloes;
          });
    
          const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
          console.log("Actual HelloesList after mutation:", actualHelloesList);
    
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
    
          timeoutRef.current = setTimeout(() => {
            createHelloMutation.reset();
          }, 2000);
        },
      });


      const handleCreateHello = async (helloData) => {
        const hello = {
          user: authUserState.user.id,
          friend: helloData.friend,
          type: helloData.type,
          typed_location: helloData.manualLocation,
          additional_notes: helloData.notes,
          location: helloData.locationId,
          date: helloData.date,
          thought_capsules_shared: helloData.momentsShared,
          delete_all_unshared_capsules: helloData.deleteMoments, // ? true : false,
        };
    
        console.log("Payload before sending:", hello);
    
        try {
          await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
        } catch (error) {
          console.error("Error saving hello:", error);
        }
      };
  

    return { 
        helloesList,
        isFetching,
        flattenHelloes,
        inPersonHelloes,
        helloesIsFetching,
        helloesIsLoading,
        helloesIsSuccess,
        helloesIsError,
        createHelloMutation,
        handleCreateHello,
};

}



export default useHelloesData;
