import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthUser } from './AuthUserContext';
import { fetchUpcomingHelloes } from '../api';

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
    return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
    const [upcomingHelloes, setUpcomingHelloes] = useState([]);
    const { authUserState } = useAuthUser();

    useEffect(() => {
        const loadUpcomingHelloes = async () => {
            console.log("loading upcoming helloes...");
            try {
                const helloes = await fetchUpcomingHelloes();
                console.log("loadUpcomingHelloes: ", helloes);
                setUpcomingHelloes(helloes);
            } catch (error) {
                console.error('Error loading upcoming helloes:', error);
            }
        };

        if (authUserState.authenticated) {
            loadUpcomingHelloes();
        }
    }, [authUserState.authenticated]);

    const value = {
        upcomingHelloes,
    };

    return (
        <UpcomingHelloesContext.Provider value={value}>
            {children}
        </UpcomingHelloesContext.Provider>
    );
};
