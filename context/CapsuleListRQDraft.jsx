import React, { createContext, useContext, useState } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchThoughtCapsules, updateThoughtCapsule } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CapsuleListRQContext = createContext({ 
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
  const context = useContext(CapsuleListRQContext);

  if (!context) {
    throw new Error('useCapsuleList must be used within a CapsuleListProvider');
  }

  return context;
};

export const CapsuleListProvider = ({ children }) => {
  const { selectedFriend } = useSelectedFriend();
  const queryClient = useQueryClient(); // Initialize the query client

  // Use useQuery to fetch capsules based on the selectedFriend
  const { data: capsuleList = [], isLoading: isCapsuleContextLoading } = useQuery({
    queryKey: ['thoughtCapsules', selectedFriend?.id],
    queryFn: () => fetchThoughtCapsules(selectedFriend.id),
    enabled: !!selectedFriend, // Only run query if selectedFriend is available
  });

  const capsuleCount = capsuleList.length;

  // Mutation to update the capsule
  const updateCapsuleMutation = useMutation({
    mutationFn: (updatedCapsule) => updateThoughtCapsule(updatedCapsule.id, updatedCapsule), // Use the imported function
    onSuccess: () => {
      // Invalidate the query to refetch updated data
      queryClient.invalidateQueries(['thoughtCapsules', selectedFriend?.id]);
    },
    onError: (error) => {
      console.error('Error updating capsule:', error);
    },
  });

  const updateCapsule = (updatedCapsule) => {
    // Call the mutation with the updated capsule
    updateCapsuleMutation.mutate(updatedCapsule);
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
    // Sort and update logic here
  };

  const sortNewestFirst = () => {
    // Sort and update logic here
  };

  return (
    <CapsuleListRQContext.Provider value={{ 
      capsuleList, 
      capsuleCount,
      categoryCount: categoryStartIndices.length,
      categoryNames: Object.keys(categoryStartIndices),
      categoryStartIndices,
      sortedByCategory: [], // Set this to your sorted value
      newestFirst: [], // Set this to your sorted value
      preAddedTracker,
      updatePreAddedTracker,
      removeCapsules, 
      updatePreAdded, 
      updateCapsule, 
      sortByCategory,
      sortNewestFirst,
    }}>
      {children}
    </CapsuleListRQContext.Provider>
  );
};
