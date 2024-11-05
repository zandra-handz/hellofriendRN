import React, { useEffect, createContext, useContext, useState } from 'react';
import { useSelectedFriend } from './SelectedFriendContext';
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
  if (!context) throw new Error('useCapsuleList must be used within a CapsuleListProvider');
  return context;
};

export const CapsuleListProvider = ({ children }) => {
  const { selectedFriend } = useSelectedFriend();
  const queryClient = useQueryClient();

  const [sortedByCategory, setSortedByCategory] = useState([]);
  const [newestFirst, setNewestFirst] = useState([]);
  const [preAddedTracker, setPreAddedTracker] = useState([]);

  // Use useQuery to fetch capsules based on the selectedFriend
  const { data: sortedCapsuleList = [], isLoading: isCapsuleContextLoading } = useQuery({
    queryKey: ['Moments', selectedFriend?.id],
    queryFn: () => fetchThoughtCapsules(selectedFriend.id),
    enabled: !!selectedFriend,
    staleTime: 0,
    onSuccess: (data) => {
      // Log the moments cache right after the data is initially fetched
      const initialCache = queryClient.getQueryData(['Moments', selectedFriend?.id]);
      console.log('Initial moments cache after fetch:', initialCache);
    },
    select: (data) => {
      if (!data) return { capsules: [], categoryCount: 0, categoryNames: [], categoryStartIndices: {} };

      const sorted = [...data].sort((a, b) => {
        if (a.typedCategory < b.typedCategory) return -1;
        if (a.typedCategory > b.typedCategory) return 1;
        return new Date(b.created) - new Date(a.created);
      });

      const uniqueCategories = [...new Set(sorted.map((item) => item.typedCategory))];
      const categoryCount = uniqueCategories.length;
      const categoryNames = uniqueCategories;

      const categoryStartIndices = {};
      let index = 0;
      for (const category of uniqueCategories) {
        categoryStartIndices[category] = index;
        index += sorted.filter((item) => item.typedCategory === category).length;
      }

      return { capsules: sorted, categoryCount, categoryNames, categoryStartIndices };
    },
  });

  const {
    capsules = [],
    categoryCount = 0,
    categoryNames = [],
    categoryStartIndices = {},
  } = sortedCapsuleList;

  const capsuleCount = capsules.length;

  const updateCapsuleMutation = useMutation({
    mutationFn: (updatedCapsule) => updateThoughtCapsule(updatedCapsule.id, updatedCapsule),
    onSuccess: () => queryClient.invalidateQueries(['Moments', selectedFriend?.id]),
    onError: (error) => console.error('Error updating capsule:', error),
  });

  const updateCapsule = (updatedCapsule) => updateCapsuleMutation.mutate(updatedCapsule);

  const createMomentMutation = useMutation({
    mutationFn: (data) => saveThoughtCapsule(data),
    onSuccess: (data) => {

      const formattedMoment = {
        id: data.id,
        typedCategory: data.typed_category || 'Uncategorized',
        capsule: data.capsule,
        created: data.created_on,
        preAdded: data.pre_added_to_hello,
      }
      queryClient.setQueryData(['Moments', selectedFriend?.id], (old) => (old ? [formattedMoment, ...old] : [formattedMoment]));
      //queryClient.invalidateQueries({ queryKey: ['Moments', selectedFriend?.id] });
      
      // Log the updated moments cache
      const updatedCache = queryClient.getQueryData(['Moments', selectedFriend?.id]);
      console.log('Updated moments cache after saving a new moment:', updatedCache);
    },
  });

  const handleCreateMoment = async (momentData) => {
    const moment = {
      user: momentData.user,
      friend: momentData.friend,

      typed_category: momentData.selectedCategory,
      capsule: momentData.moment,
    };

    try {
      await createMomentMutation.mutateAsync(moment);
    } catch (error) {
      console.error('Error saving moment:', error);
    }
  };

  const removeCapsules = (capsuleIdsToRemove) => {
    queryClient.setQueryData(['thoughtCapsules', selectedFriend?.id], (oldCapsules) =>
      oldCapsules.filter((capsule) => !capsuleIdsToRemove.includes(capsule.id))
    );
  };

  const updatePreAddedTracker = () => {
    const preAddedIds = capsules.reduce((ids, capsule) => {
      if (capsule.preAdded) ids.push(capsule.id);
      return ids;
    }, []);
    setPreAddedTracker(preAddedIds);
  };

  const sortByCategory = () => {
    const sorted = [...capsules].sort((a, b) => {
      if (a.typedCategory < b.typedCategory) return -1;
      if (a.typedCategory > b.typedCategory) return 1;
      return new Date(b.created) - new Date(a.created);
    });

    setSortedByCategory(sorted);
  };

  const updatePreAdded = (capsuleIdsToUpdateTrue = [], capsuleIdsToUpdateFalse = []) => {
    queryClient.setQueryData(['Moments', selectedFriend?.id], (prevCapsules) => {
      const trueIdsSet = new Set(capsuleIdsToUpdateTrue);
      const falseIdsSet = new Set(capsuleIdsToUpdateFalse);

      return prevCapsules.map((capsule) => {
        if (trueIdsSet.has(capsule.id)) return { ...capsule, preAdded: true };
        if (falseIdsSet.has(capsule.id)) return { ...capsule, preAdded: false };
        return capsule;
      });
    });
  };

  const sortNewestFirst = () => setNewestFirst([...capsules].sort((a, b) => new Date(b.created) - new Date(a.created)));

  return (
    <CapsuleListContext.Provider
      value={{
        capsuleList: capsules,
        capsuleCount,
        categoryCount,
        categoryNames,
        categoryStartIndices,
        sortedByCategory,
        newestFirst,
        preAddedTracker,
        updatePreAddedTracker,
        removeCapsules,
        handleCreateMoment,
        createMomentMutation,
        updatePreAdded,
        updateCapsule,
        sortByCategory,
        sortNewestFirst,
      }}
    >
      {children}
    </CapsuleListContext.Provider>
  );
};
