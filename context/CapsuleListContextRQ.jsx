import React, { useEffect, createContext, useContext, useState } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchThoughtCapsules, saveThoughtCapsule, updateThoughtCapsule } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CapsuleListContext = createContext({ 
  capsuleList: [], 
  capsuleCount: 0,
  categoryCount: 0,
  categoryNames: [],
  categoryStartIndices: {},
  sortedByCategory: [],
  newestFirst: [],
  preAddedTracker: [],
  updatePreAddedTracker: () => {},
  removeCapsules: () => {}, 
  updateCapsule: () => {}, 
  updatePreAdded: () => {}, 
  updateCapsules: () => {},
  sortByCategory: () => {},
  sortNewestFirst: () => {},
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
  const queryClient = useQueryClient(); // Initialize the query client

  const [sortedByCategory, setSortedByCategory] = useState([]);
  const [newestFirst, setNewestFirst] = useState([]); 
  const [categoryCount, setCategoryCount] = useState(0);
  const [categoryNames, setCategoryNames] = useState([]);
 


  // Use useQuery to fetch capsules based on the selectedFriend
  const { data: capsuleList = [], isLoading: isCapsuleContextLoading } = useQuery({
    queryKey: ['Moments', selectedFriend?.id],
    queryFn: () => fetchThoughtCapsules(selectedFriend.id),
    enabled: !!selectedFriend, // Only run query if selectedFriend is available
    onSuccess: (data) => {
        console.log('Raw data in RQ onSuccess:', data);
        sortByCategory();
        sortNewestFirst(); 
      if (!data) {
      console.log('No data received');
          return;
      }

    }
  });

  const capsuleCount = capsuleList.length;
  const updateCount = capsuleList.length;

  // Mutation to update the capsule
  const updateCapsuleMutation = useMutation({
    mutationFn: (updatedCapsule) => updateThoughtCapsule(updatedCapsule.id, updatedCapsule), // Use the imported function
    onSuccess: () => {
      // Invalidate the query to refetch updated data
      queryClient.invalidateQueries(['Moments', selectedFriend?.id]);
    },
    onError: (error) => {
      console.error('Error updating capsule:', error);
    },
  });

  const updateCapsule = (updatedCapsule) => {
    // Call the mutation with the updated capsule
    updateCapsuleMutation.mutate(updatedCapsule);
  };

  const createMomentMutation = useMutation({
    mutationFn: (data) => saveThoughtCapsule(data),
    onSuccess: (data) => {queryClient.setQueryData(['Moments'], (old) => {
            const updatedMoments = old ? [data, ...old] : [data];
            return updatedMoments; 
        });
 
        const actualMomentsList = queryClient.getQueryData(['Moments']);
        console.log('Actual HelloesList after mutation:', actualMomentsList);
    }, 
});

 
const handleCreateMoment = async (momentData) => {
  const moment = {
    user: authUserState.user.id,
    friend: momentData.friend, 
    typed_category: momentData.selectedCategory,
    capsule: momentData.textInput,
  };

  console.log('Payload before sending:', moment);

  try {
    
    await createMomentMutation.mutateAsync(moment); // Call the mutation with the location data
  } catch (error) {
      console.error('Error saving moment:', error);
  }
};


  const removeCapsules = (capsuleIdsToRemove) => {
    // Filter out the removed capsules from the capsuleList
    queryClient.setQueryData(['thoughtCapsules', selectedFriend?.id], (oldCapsules) => {
      return oldCapsules.filter(capsule => !capsuleIdsToRemove.includes(capsule.id));
    });
  };

  const [preAddedTracker, setPreAddedTracker] = useState([]);
  const [categoryStartIndices, setCategoryStartIndices] = useState({}); 

  const updatePreAddedTracker = () => {
    const preAddedIds = capsuleList.reduce((ids, capsule) => {
      if (capsule.preAdded) {
        ids.push(capsule.id); // Add the ID if preAdded is true
      }
      return ids;
    }, []);

    setPreAddedTracker(preAddedIds);
  };



  const sortByCategory = () => {
    const sorted = [...capsuleList].sort((a, b) => { 
      if (a.typedCategory < b.typedCategory) return -1;
      if (a.typedCategory > b.typedCategory) return 1;
      return new Date(b.created) - new Date(a.created); // Newest first if categories are the same
    });

    // Get unique categories
    const uniqueCategories = [...new Set(sorted.map(item => item.typedCategory))];
    setCategoryCount(uniqueCategories.length);
    setCategoryNames(uniqueCategories); // Assuming you have a state for category names
    setSortedByCategory(sorted);

    // Calculate category start indices
    const startIndices = {};
    let index = 0;
    for (const category of uniqueCategories) {
      startIndices[category] = index;
      index += sorted.filter(item => item.typedCategory === category).length; // Count items in category
    }
    setCategoryStartIndices(startIndices); // Set the calculated indices

    console.log("Sorted by Category: ", sorted);
    console.log('Category count: ', categoryCount);
    console.log("Unique Categories: ", uniqueCategories);
  };

  const updatePreAdded = (capsuleIdsToUpdateTrue = [], capsuleIdsToUpdateFalse = []) => {
    
    setCapsuleList(prevCapsules => {
      // Create a Set for quick lookup
      const trueIdsSet = new Set(capsuleIdsToUpdateTrue);
      const falseIdsSet = new Set(capsuleIdsToUpdateFalse); 
  
      return prevCapsules.map(capsule => {
        if (trueIdsSet.has(capsule.id)) {
          return {
            ...capsule,
            preAdded: true
          };
        }
        if (falseIdsSet.has(capsule.id)) {
          return {
            ...capsule,
            preAdded: false
          };
        }
        console.log('HIIIIIII', capsule);
        return capsule;
      });
    });
  };
  

  const sortNewestFirst = () => {
    const sorted = [...capsuleList].sort((a, b) => new Date(b.created) - new Date(a.created));
    setNewestFirst(sorted);
  };

  return (
    <CapsuleListContext.Provider value={{ 
      capsuleList, 
      capsuleCount,
      categoryCount: categoryStartIndices.length,
      categoryNames: Object.keys(categoryStartIndices),
      categoryStartIndices,
      sortedByCategory, // Set this to your sorted value
      newestFirst, // Set this to your sorted value
      preAddedTracker,
      updatePreAddedTracker,
      removeCapsules, 
      handleCreateMoment,
      createMomentMutation,
      updatePreAdded, 
      updateCount,
      updateCapsule, 
      sortByCategory,
      sortNewestFirst,
    }}>
      {children}
    </CapsuleListContext.Provider>
  );
};
