import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useUser } from './UserContext';
import { fetchUpcomingHelloes } from '../calls/api';
import { useQuery,   useQueryClient } from '@tanstack/react-query';
 

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
    return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
    const queryClient = useQueryClient();
 

    const {  isAuthenticated } = useUser(); 
    const [updateTrigger, setUpdateTrigger] = useState(false); // Introducing updateTrigger state
    const timeoutRef = useRef(null);
    const [newSuccess, setNewSuccess ] = useState(false);


    const { data: upcomingHelloes, isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['upcomingHelloes'],
        queryFn: () => fetchUpcomingHelloes(),
        enabled: !!(isAuthenticated),
        onSuccess: (data) => { 
          setNewSuccess(true); 
          if (!data) { 
              return;
          }

         
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => { 
            setNewSuccess(true);

          }, 2000);
      
        },
        onError: (error) => {
            console.log('Error occurred:', error);
            // Optionally handle or log the error
            setNewSuccess(false);
          },
          // Return an empty list in case of error
          select: (data) => {
            if (isError) {
              return []; // Return an empty list if there's an error
            }
            return data || []; // Return data or an empty list if no data
          },
      });

      const upcomingHelloesIsFetching = isFetching;
      const upcomingHelloesIsSuccess = isSuccess; 




      useEffect(() => {
        if (updateTrigger) {
            queryClient.invalidateQueries(['upcomingHelloes']);
            setUpdateTrigger(false);  
        }
    }, [updateTrigger, queryClient]);

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('upcoming helloes detecting when user is no longer authenticated!');
            setUpdateTrigger(false); 
            queryClient.removeQueries(['upcomingHelloes']); 
            queryClient.clear();
        }
    }, [isAuthenticated, queryClient]);



    return (
        <UpcomingHelloesContext.Provider value={{
            upcomingHelloes,
            upcomingHelloesIsFetching,
            upcomingHelloesIsSuccess,
            newSuccess,
            
            isLoading,
            updateTrigger, 
            setUpdateTrigger,  
            
        }}>
            {children}
        </UpcomingHelloesContext.Provider>
    );
};
