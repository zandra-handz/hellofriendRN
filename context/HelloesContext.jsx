import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchPastHelloes, saveHello } from '../api'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 

const HelloesContext = createContext({});

export const useHelloes = () => {
    return useContext(HelloesContext);
};

export const HelloesProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const { selectedFriend } = useSelectedFriend();
    const { authUserState } = useAuthUser();
    
    const timeoutRef = useRef(null);

    const [helloesListMonthYear, setHelloesListMonthYear ] = useState([]);

    
    

    const { data: helloesList, isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['pastHelloes', selectedFriend?.id],
        queryFn: () => {
  console.log('Fetching past helloes for:', selectedFriend?.id);
  return fetchPastHelloes(selectedFriend.id);
},
        enabled: !!selectedFriend,
        onSuccess: (data) => { 
          // groupByMonthAndYear(data);
          // const inPerson = data[0].filter(hello => hello.type === 'in person');
          // queryClient.setQueryData(['inPersonHelloes', selectedFriend?.id], inPerson);
          console.log('cached in person helloes: ', data);
        },
        onError: () => {
          console.log('error in RQ fetching helloes');
        }
    });


    const helloesIsFetching = isFetching; 
    //(Not sure which one to use)
    const helloesIsLoading = isLoading;
    const helloesIsError = isError;
    const helloesIsSuccess = isSuccess;

   
    const inPersonHelloes = useMemo(() => {
        if (helloesList) {
       

          const inPerson = helloesList.filter(hello => hello.type === 'in person');
          queryClient.setQueryData(['inPersonHelloes', selectedFriend?.id], inPerson);
          
        console.log('filtering helloes in useMemo function');
        return inPerson;
    }
    }, [helloesList]);

    const getCachedInPersonHelloes = () => {
      return queryClient.getQueryData(['inPersonHelloes', selectedFriend?.id]);
  };
  
//   useEffect(() => {
//     // Log the cached data for 'pastHelloes'
//     const cachedHelloes = queryClient.getQueryData(['pastHelloes', selectedFriend?.id]);
//     console.log('Cached pastHelloes:', cachedHelloes);

//     // Log the cached data for 'inPersonHelloes'
//     const cachedInPersonHelloes = queryClient.getQueryData(['inPersonHelloes', selectedFriend?.id]);
//     console.log('Cached inPersonHelloes:', cachedInPersonHelloes);
// }, [helloesList, selectedFriend, queryClient]);
 
 
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


 


      


  //     const groupByMonthAndYear = (data) => {
  //       console.log('running groupByMonthAndYear in helloes context');
  //       if (!Array.isArray(data)) {
  //         console.error("Invalid data passed to groupByMonthAndYear:", data);
  //         return [];
  //       }
  //       //console.log('group by', data);
    
  //       // Step 1: Group data by month and year
  //       const groupedData = data.reduce((acc, item) => {
  //         const createdDate = new Date(item.dateLong + "T00:00:00"); // Treat as local time
    
  //         //console.log(item.dateLong);
  //         //console.log("CREATED DATE", createdDate);
    
  //         // Ensure the date was parsed successfully
  //         if (isNaN(createdDate)) {
  //           console.error("Invalid date:", item.dateLong);
  //           return acc; // Skip invalid dates
  //         }
    
  //         // Format the month/year string as 'month/year'
  //         const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
    
  //         // If this monthYear doesn't exist, create an empty structure
  //         if (!acc[monthYear]) {
  //           acc[monthYear] = {
  //             data: [],
  //             days: [], // To store unique day numbers
  //           };
  //         }
    
  //         // Add item to the grouped data
  //         acc[monthYear].data.push(item);
    
  //         // Extract the day of the month using getDate() for local time (no UTC adjustments)
  //         const dayOfMonth = createdDate.getDate(); // Use getDate() for local day
  //         if (!acc[monthYear].days.includes(dayOfMonth)) {
  //           acc[monthYear].days.push(dayOfMonth);
  //         }
  //         //console.log(`Final days for ${monthYear}:`, acc[monthYear].days);
          
  //         return acc;
  //       }, {});
        
  //   const allDates = data.map((item) => new Date(item.dateLong + "T00:00:00"));
  //   const minDate = new Date(Math.min(...allDates));
  //   const maxDate = new Date(Math.max(...allDates));

  //   const monthsList = [];
  //   const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  //   const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  //   while (start <= end) {
  //     const monthYear = `${start.getMonth() + 1}/${start.getFullYear()}`;
  //     monthsList.push(monthYear);
  //     start.setMonth(start.getMonth() + 1);
  //   }

  //   const sortedMonths = monthsList.map((monthYear, index) => {
  //     return {
  //       monthYear,
  //       index,
  //       data: groupedData[monthYear]?.data || [],
  //       days: groupedData[monthYear]?.days || [],
  //     };
  //   });

  //   setHelloesListMonthYear(sortedMonths);

  //   return sortedMonths;
  // };
 
 



    return (
        <HelloesContext.Provider value={{
            helloesList,
            isFetching,
            flattenHelloes,
            //inPersonHelloes,
            helloesIsFetching,
            helloesIsLoading,
            helloesIsSuccess,
            helloesIsError,
            createHelloMutation,
            handleCreateHello,
            getCachedInPersonHelloes,
            // helloesListMonthYear,
            
        }}>
            {children}
        </HelloesContext.Provider>
    );
};
