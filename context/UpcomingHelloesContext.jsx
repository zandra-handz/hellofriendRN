import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuthUser } from './AuthUserContext';
import { fetchUpcomingHelloes } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
    return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
    const queryClient = useQueryClient();
 

    const { authUserState } = useAuthUser(); 
    const [updateTrigger, setUpdateTrigger] = useState(false); // Introducing updateTrigger state
    const timeoutRef = useRef(null);
    const [newSuccess, setNewSuccess ] = useState(false);


    const { data: upcomingHelloes, isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['upcomingHelloes'],
        queryFn: () => fetchUpcomingHelloes(),
        enabled: !!authUserState.authenticated,
        onSuccess: (data) => {
          console.log('Raw data in RQ onSuccess:', data);
          setNewSuccess(true); 
          if (!data) {
              console.log('No data received');
              return;
          }

         
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => { 
            setNewSuccess(true);

          }, 2000);
      
        }
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
        if (!authUserState.authenticated) {
            console.log('upcoming helloes detecting when user is no longer authenticated!');
            setUpdateTrigger(false); 
            queryClient.removeQueries(['upcomingHelloes']); 
            queryClient.clear();
        }
    }, [authUserState.authenticated, queryClient]);



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
