import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchThoughtCapsules } from '../api';

const CapsuleListContext = createContext({ capsuleList: [], setCapsuleList: () => {} });

export const useCapsuleList = () => {
    const context = useContext(CapsuleListContext);

    if (!context) {
        throw new Error('useCapsuleList must be used within a CapsuleListProvider');
    }

    return context;
};

export const CapsuleListProvider = ({ children }) => {
    const { selectedFriend } = useSelectedFriend();
    const [capsuleList, setCapsuleList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedFriend) {
                    const capsules = await fetchThoughtCapsules(selectedFriend.id);
                    setCapsuleList(capsules || []); // Set capsules or empty array if none
                    console.log("fetchData Capsule List context: ", capsules);
                } else {
                    // Reset capsule list if no friend is selected
                    setCapsuleList([]);
                }
            } catch (error) {
                console.error('Error fetching capsule list:', error);
            }
        };

        fetchData();
    }, [selectedFriend]);

    return (
        <CapsuleListContext.Provider value={{ capsuleList, setCapsuleList }}>
            {children}
        </CapsuleListContext.Provider>
    );
};
