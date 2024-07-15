import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchThoughtCapsules } from '../api';

const CapsuleListContext = createContext({ 
  capsuleList: [], 
  setCapsuleList: () => {}, 
  removeCapsules: () => {}, 
  updateCapsule: () => {} 
});

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
          
          setCapsuleList([]);
        }
      } catch (error) {
        console.error('Error fetching capsule list:', error);
      }
    };

    fetchData();
  }, [selectedFriend]);

  const removeCapsules = (capsuleIdsToRemove) => {
    setCapsuleList(prevCapsules => {
      return prevCapsules.filter(capsule => !capsuleIdsToRemove.includes(capsule.id));
    });
  };

  const updateCapsule = (updatedCapsule) => {
    setCapsuleList(prevCapsules => {
      return prevCapsules.map(capsule => 
        capsule.id === updatedCapsule.id ? updatedCapsule : capsule
      );
    });
  };

  return (
    <CapsuleListContext.Provider value={{ capsuleList, setCapsuleList, removeCapsules, updateCapsule }}>
      {children}
    </CapsuleListContext.Provider>
  );
};
