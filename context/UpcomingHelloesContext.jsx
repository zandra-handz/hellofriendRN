import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthUser } from './AuthUserContext';
import { fetchUpcomingHelloes } from '../api';

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
    return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
    const { authUserState } = useAuthUser();
    const [upcomingHelloes, setUpcomingHelloes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updateTrigger, setUpdateTrigger] = useState(false); // Introducing updateTrigger state
    

    useEffect(() => {
        const loadUpcomingHelloes = async () => {
            console.log("loading upcoming helloes...");
            setIsLoading(true);
            try {
                const helloes = await fetchUpcomingHelloes();
                console.log("loadUpcomingHelloes: ", helloes);
                setUpcomingHelloes(helloes);
            } catch (error) {
                console.error('Error loading upcoming helloes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (authUserState.authenticated) {
            loadUpcomingHelloes();
        } else {
            setUpcomingHelloes([]);
            setIsLoading(false);
        }
    }, [authUserState.authenticated, updateTrigger]); // Include updateTrigger in dependencies


    return (
        <UpcomingHelloesContext.Provider value={{
            upcomingHelloes,
            isLoading,
            updateTrigger, 
            setUpdateTrigger,  
            
        }}>
            {children}
        </UpcomingHelloesContext.Provider>
    );
};
