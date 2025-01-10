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
 
    const [ latestHelloDate, setLatestHelloDate ] = useState(null);
    const [ earliestHelloDate, setEarliestHelloDate ] = useState(null);
    const [ helloesListMonthYear, setHelloesListMonthYear ] = useState(null);

    
    

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


 


      

      const groupByMonthYear = (helloesData) => {
        if (helloesData) {
          if (!Array.isArray(helloesData)) {
            console.error("Invalid data passed to groupByMonthAndYear:", helloesData);
            return [];
          }
      
          const groupedData = helloesData.reduce((acc, item) => {
            const createdDate = new Date(item.dateLong + "T00:00:00");
      
            if (isNaN(createdDate)) {
              console.error("Invalid date:", item.dateLong);
              return acc;
            }
      
            const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
      
            if (!acc[monthYear]) {
              acc[monthYear] = {
                data: [],
                days: [],
              };
            }
      
            acc[monthYear].data.push(item);
      
            const dayOfMonth = createdDate.getDate();
            if (!acc[monthYear].days.includes(dayOfMonth)) {
              acc[monthYear].days.push(dayOfMonth);
            }
      
            return acc;
          }, {});
      
          const allDates = helloesData.map((item) => new Date(item.dateLong + "T00:00:00"));
          const minDate = new Date(Math.min(...allDates));
          const maxDate = new Date(Math.max(...allDates));
      
          const monthsList = [];
          const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
          const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
      
          while (start <= end) {
            const monthYear = `${start.getMonth() + 1}/${start.getFullYear()}`;
            monthsList.push(monthYear);
            start.setMonth(start.getMonth() + 1);
          }
      
          const sortedMonths = monthsList.map((monthYear, index) => {
            return {
              monthYear,
              index,
              data: groupedData[monthYear]?.data || [],
              days: groupedData[monthYear]?.days || [],
            };
          });
       
      
          return sortedMonths;
        }
        return [];
      } 

 

    const lightFormatBackendDateToMonthYear = (backendDate) => {
      //console.log('LATEST DATE IN CALCULATOR:', backendDate);
      const date = new Date(backendDate);
      const month = date.getUTCMonth() + 1; // Get UTC month
      const year = date.getUTCFullYear(); // Get UTC year
      //console.log('LATEST DATE IN CALCULATOR:', year, month);
      return `${month}/${year}`;
    };


  

    useEffect(() => {
      if (helloesList?.length && selectedFriend) {
        const helloesMonthsYears = groupByMonthYear(helloesList);
        const latestHelloDate = lightFormatBackendDateToMonthYear(helloesList[0].dateLong);
        const earliestHelloDate = lightFormatBackendDateToMonthYear(
          helloesList[helloesList.length - 1].dateLong
        );
    
        setLatestHelloDate(latestHelloDate);
        setEarliestHelloDate(earliestHelloDate);
        setHelloesListMonthYear(helloesMonthsYears);
    
        console.log('HELLOES LIST CHANGED');
      }

    }, [helloesList, selectedFriend]);


    useEffect(() => {
      if (!selectedFriend) {
        setHelloesListMonthYear(null);
        setLatestHelloDate(null);
        setEarliestHelloDate(null);

      }

    }, [selectedFriend]);
    
    
      
 
 



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
            helloesListMonthYear,
            latestHelloDate,
            earliestHelloDate,
            
            
        }}>
            {children}
        </HelloesContext.Provider>
    );
};
