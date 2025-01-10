import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
} from "react";
import { useSelectedFriend } from "./SelectedFriendContext";
import {
  fetchMomentsAPI,
  saveMomentAPI,
  updateMomentAPI,
  updateMultMomentsAPI,
  deleteMomentAPI,
} from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CapsuleListContext = createContext({
  capsuleList: [],
  capsuleCount: 0,
  categoryCount: 0,
  categoryNames: [],
  categoryStartIndices: {},
  sortedByCategory: [],
  newestFirst: [],
  preAdded: [],
  removeCapsules: () => {},
  updateCapsule: () => {},
  updatePreAdded: () => {},
  updateCapsules: () => {},
  sortByCategory: () => {},
  sortNewestFirst: () => {},
});

export const useCapsuleList = () => {
  const context = useContext(CapsuleListContext);
  if (!context)
    throw new Error("useCapsuleList must be used within a CapsuleListProvider");
  return context;
};

export const CapsuleListProvider = ({ children }) => {
  const { selectedFriend } = useSelectedFriend();
  const queryClient = useQueryClient();

  const [sortedByCategory, setSortedByCategory] = useState([]);
  const [newestFirst, setNewestFirst] = useState([]);

  const [resultMessage, setResultMessage] = useState(null);
  const [closeResultMessage, setCloseResultMessage] = useState(true);
  const [momentIdToAnimate, setMomentIdToAnimate] = useState(null);
  const [momentSaveToAnimate, setMomentSaveToAnimate] = useState({});
  const [newMomentInput, setNewMomentInput] = useState("");

  const { data: sortedCapsuleList = [], isLoading: isCapsuleContextLoading } =
    useQuery({
      queryKey: ["Moments", selectedFriend?.id],
      queryFn: () => fetchMomentsAPI(selectedFriend.id),
      enabled: !!selectedFriend,
      staleTime: 0,
      onSuccess: (data) => {
        const initialCache = queryClient.getQueryData([
          "Moments",
          selectedFriend?.id,
        ]);
        //console.log("Initial moments cache after fetch:", initialCache);
      },
      select: (data) => {
        if (!data)
          return {
            capsules: [],
            categoryCount: 0,
            categoryNames: [],
            categoryStartIndices: {},
            preAdded: [],
            momentsSavedToHello: [],
          };

        const sorted = [...data].sort((a, b) => {
          if (a.typedCategory < b.typedCategory) return -1;
          if (a.typedCategory > b.typedCategory) return 1;
          return new Date(b.created) - new Date(a.created);
        });

        const preAdded = sorted.reduce((ids, capsule) => {
          if (capsule.preAdded) ids.push(capsule.id);
          return ids;
        }, []);

        const filterPreAdded = sorted.filter(
          (capsule) => !preAdded.includes(capsule.id)
        );

        const sortedWithIndices = filterPreAdded.map((capsule, index) => ({
          ...capsule,
          uniqueIndex: index,
        }));

        const uniqueCategories = [
          ...new Set(sortedWithIndices.map((item) => item.typedCategory)),
        ];
        const categoryCount = uniqueCategories.length;
        const categoryNames = uniqueCategories;

        const categoryStartIndices = {};

        let index = 0;
        for (const category of uniqueCategories) {
          categoryStartIndices[category] = index;
          index += sortedWithIndices.filter(
            (item) => item.typedCategory === category
          ).length;
        }

        const momentsSavedToHello = sortedWithIndices.filter((capsule) =>
          preAdded.includes(capsule.id)
        );

        return {
          capsules: sortedWithIndices,
          allCapsules: sorted,
          categoryCount,
          categoryNames,
          categoryStartIndices,
          preAdded,
          momentsSavedToHello,
        };
      },
    });

  const {
    capsules = [],
    allCapsules = [],
    categoryCount = 0,
    categoryNames = [],
    categoryStartIndices = {},
    preAdded = [],
    momentsSavedToHello = [],
  } = sortedCapsuleList;

  const capsuleCount = capsules.length;

  const [momentData, setMomentData] = useState(null);

  const updateCapsuleMutation = useMutation({
    mutationFn: (capsuleId) =>
      updateMomentAPI(selectedFriend?.id, capsuleId, {
        pre_added_to_hello: true,
      }),

    onSuccess: (data) => {
      //console.log("Updated capsule data:", data);
      setMomentData(data);

      setMomentIdToAnimate(data.id);

      // Log the cache before updating it
      const oldMoments = queryClient.getQueryData([
        "Moments",
        selectedFriend?.id,
      ]);
      //console.log("Cache before update:", oldMoments);

      //queryClient.setQueryData(['Moments', selectedFriend?.id], (oldMoments) => {
      //if (!oldMoments) return [data];
      //const momentIndex = oldMoments.findIndex((moment) => moment.id === data.id);
      //if (momentIndex === -1) {
      //  return [data, ...oldMoments];
      // }

      // const updatedMoments = [...oldMoments];
      // updatedMoments[momentIndex] = { ...updatedMoments[momentIndex], ...data, preAdded: true };

      // return updatedMoments;
      // });

      // const updatedCache = queryClient.getQueryData(['Moments', selectedFriend?.id]);
      // console.log('Updated cache:', updatedCache);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateCapsuleMutation.reset();
      }, 2000);

      //  console.error('Error updating capsule:', error);
    },
  });

  const updateCacheWithNewPreAdded = () => {
    if (momentData) {
      queryClient.setQueryData(
        ["Moments", selectedFriend?.id],
        (oldMoments) => {
          if (!oldMoments) return [momentData];

          const updatedMoments = [...oldMoments];
          const momentIndex = oldMoments.findIndex(
            (moment) => moment.id === momentData.id
          );
          if (momentIndex !== -1) {
            updatedMoments[momentIndex] = {
              ...updatedMoments[momentIndex],
              ...momentData,
              preAdded: true,
            };
          } else {
            updatedMoments.unshift(momentData); // Add new moment if it doesn't exist
          }

          setMomentData(null);

          updateCapsuleMutation.reset();

          return updatedMoments;
        }
      );
    }
  };

  const updateCapsule = (capsuleId) => updateCapsuleMutation.mutate(capsuleId);

  const updateCapsulesMutation = useMutation({
    mutationFn: (updatedCapsules) =>
      updateMultMomentsAPI(selectedFriend?.id, updatedCapsules),
    onSuccess: () =>
      queryClient.invalidateQueries(["Moments", selectedFriend?.id]),
    onError: (error) => console.error("Error updating capsule:", error),
  });

  const updateCapsules = (updatedCapsules) =>
    updateCapsulesMutation.mutate(updatedCapsules);

  const createMomentMutation = useMutation({
    mutationFn: (data) => saveMomentAPI(data),
    onError: (error) => {
      setResultMessage("Oh no! :( Please try again");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset the state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        createMomentMutation.reset();
        setCloseResultMessage(true);
        setResultMessage(null);
      }, 2000);
    },
    onSuccess: (data) => {
      const formattedMoment = {
        id: data.id,
        typedCategory: data.typed_category || "Uncategorized",
        capsule: data.capsule,
        created: data.created_on,
        preAdded: data.pre_added_to_hello,
      };

      setMomentSaveToAnimate(data);

      queryClient.setQueryData(["Moments", selectedFriend?.id], (old) =>
        old ? [formattedMoment, ...old] : [formattedMoment]
      );

      // Log the updated moments cache
      const updatedCache = queryClient.getQueryData([
        "Moments",
        selectedFriend?.id,
      ]);
      // console.log(
      //   "Updated moments cache after saving a new moment:",
      //   updatedCache
      // );

      setResultMessage("Moment saved!");

      // Clear previous timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset the state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        createMomentMutation.reset();
        setCloseResultMessage(true);
        setNewMomentInput("");
        setResultMessage(null);
      }, 2000);
    },
  });

  // Create a ref to hold the timeout ID
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (createMomentMutation.isPending) {
      setCloseResultMessage(false);
    }
  }),
    [createMomentMutation.isPending];

  const resetCreateMomentInputs = ({ setMomentText }) => {
    setMomentText("");
  };

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
      console.error("Error saving moment:", error);
    }
  };

  const deleteMomentRQuery = async (data) => {
    //console.log("handleDeleteMoment requires completion!", data);

    try {
      await deleteMomentMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMomentMutation = useMutation({
    mutationFn: (data) => deleteMomentAPI(data),
    onSuccess: (data) => {
      //console.log("data", data);

      queryClient.setQueryData(["Moments", selectedFriend?.id], (old) => {
        return old ? old.filter((moment) => moment.id !== data.id) : [];
      });
      setResultMessage("Moment deleted!");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
        setCloseResultMessage(true);
        setNewMomentInput("");
        setResultMessage(null);
      }, 2000);
    },
    onError: (error) => {
      setResultMessage("Oh no! :( Please try again");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset the state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
        setCloseResultMessage(true);
        setResultMessage(null);
      }, 2000);
    },
  });

  useEffect(() => {
    if (deleteMomentMutation.isPending) {
      setCloseResultMessage(false);
    }
  }),
    [deleteMomentMutation.isPending];

  const removeCapsules = (capsuleIdsToRemove) => {
    queryClient.setQueryData(["Moments", selectedFriend?.id], (oldCapsules) =>
      oldCapsules.filter((capsule) => !capsuleIdsToRemove.includes(capsule.id))
    );
  };

  const sortByCategory = () => {
    const sorted = [...capsules].sort((a, b) => {
      if (a.typedCategory < b.typedCategory) return -1;
      if (a.typedCategory > b.typedCategory) return 1;
      return new Date(b.created) - new Date(a.created);
    });

    setSortedByCategory(sorted);
  };

  const sortNewestFirst = () =>
    setNewestFirst(
      [...capsules].sort((a, b) => new Date(b.created) - new Date(a.created))
    );

  return (
    <CapsuleListContext.Provider
      value={{
        updateCacheWithNewPreAdded,
        momentData,
        capsuleList: capsules,
        allCapsulesList: allCapsules,
        capsuleCount,
        categoryCount,
        categoryNames,
        categoryStartIndices,
        sortedByCategory,
        newestFirst,
        preAdded,
        momentsSavedToHello,
        updateCapsules,
        deleteMomentRQuery,
        deleteMomentMutation,
        removeCapsules,
        handleCreateMoment,
        createMomentMutation,
        resetCreateMomentInputs,
        resultMessage,
        closeResultMessage,
        updateCapsule,
        updateCapsuleMutation,
        sortByCategory,
        sortNewestFirst,
        momentIdToAnimate,
        setMomentIdToAnimate,
      }}
    >
      {children}
    </CapsuleListContext.Provider>
  );
};
