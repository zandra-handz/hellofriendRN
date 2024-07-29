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
  const [sortedByCategory, setSortedByCategory] = useState([]);
  const [newestFirst, setNewestFirst] = useState([]);

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

  useEffect(() => {
    sortByCategory();
    sortNewestFirst();
  }, [capsuleList]);


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

  const sortByCategory = () => {
    const sorted = [...capsuleList].sort((a, b) => {
      // First, compare by category
      if (a.typedCategory < b.typedCategory) return -1;
      if (a.typedCategory > b.typedCategory) return 1;
  
      // If categories are the same, compare by date (newest first)
      return new Date(b.created) - new Date(a.created);
    });
    setSortedByCategory(sorted);
    console.log("Sorted by Category: ", sorted);
  };

  const sortNewestFirst = () => {
    const sorted = [...capsuleList].sort((a, b) => new Date(b.created) - new Date(a.created));
    setNewestFirst(sorted);
  };

  return (
    <CapsuleListContext.Provider value={{ 
      capsuleList, 
      sortedByCategory,
      newestFirst,
      setCapsuleList, 
      removeCapsules, 
      updateCapsule, 
      sortByCategory,
      sortNewestFirst
      }}>
      {children}
    </CapsuleListContext.Provider>
  );
};
