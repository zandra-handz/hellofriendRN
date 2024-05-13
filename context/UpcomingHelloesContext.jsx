import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchUpcomingHelloes } from '../api'; // Import API methods from api.js

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
    return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
    const [upcomingHelloes, setUpcomingHelloes] = useState([]);

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

        loadUpcomingHelloes();
    }, []);

    const value = {
        upcomingHelloes,
    };

    return <UpcomingHelloesContext.Provider value={value}>{children}</UpcomingHelloesContext.Provider>;
};
