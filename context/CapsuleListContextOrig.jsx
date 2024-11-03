import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchThoughtCapsules, updateThoughtCapsule } from '../api';

 
const CapsuleListContext = createContext({ 
  capsuleList: [], 
  setCapsuleList: () => {}, 
  removeCapsules: () => {}, 
  updateCapsule: () => {},
  updatePreAddedTracker: () => {},
  categoryStartIndices: {}
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
  const [capsuleCount, setCapsuleCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [categoryNames, setCategoryNames] = useState([]);
  const [ preAddedTracker, setPreAddedTracker ] = useState([]);
  const [categoryStartIndices, setCategoryStartIndices] = useState({}); 

  useEffect(() => {
    console.log("fetching capsule data using api in context useEffect... ");
    const fetchData = async () => {
      try {
        if (selectedFriend) {
          const capsules = await fetchThoughtCapsules(selectedFriend.id);
          setCapsuleList(capsules || []); // Set capsules or empty array if none
          setCapsuleCount(capsules.length);
          console.log(capsules.length);
          console.log("capsule data using api in context useEffect returned: ", capsules);
          
        
        } else {
          
          setCapsuleList([]);
          setCapsuleCount(0);
        }
      } catch (error) {
        console.error('Error fetching capsule list:', error);
      }
    };

    fetchData();
  }, [selectedFriend]);

 
  useEffect(() => {
    console.log('Autosorting capsules in Capsule List Context using a useEffect');
    sortByCategory();
    sortNewestFirst();
    updateCount(); 
  }, [capsuleList]);


  const removeCapsules = (capsuleIdsToRemove) => {
    setCapsuleList(prevCapsules => {
      return prevCapsules.filter(capsule => !capsuleIdsToRemove.includes(capsule.id));
    }); 
    console.log(capsuleCount);
    }; 

  const updateCapsule = (updatedCapsule) => {
    setCapsuleList(prevCapsules => {
      return prevCapsules.map(capsule => 
        capsule.id === updatedCapsule.id ? updatedCapsule : capsule
      );
    });
    setCapsuleCount(prevCount => prevCount + 1);
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
  

const updateCapsules = (capsuleIdsToUpdate, updatedCapsules) => {
  setCapsuleList(prevCapsules => {
    return prevCapsules.map(capsule => { 
      if (capsuleIdsToUpdate.includes(capsule.id)) { 
        const updatedCapsule = updatedCapsules.find(updated => updated.id === capsule.id);
        return updatedCapsule ? updatedCapsule : capsule;
      }
      return capsule; 
    });
  });
  console.log(capsuleCount);
};


  

  const updateCount = () => {
    setCapsuleCount(capsuleList.length);
    console.log('updated Capsule list count');
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
    console.log('moments sorted by category: ', sorted);

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


 // useEffect(() => { 
   // const preAddedIds = capsuleList
     //   .filter(capsule => capsule.preAdded) // Select capsules with pre_added_to_hello true
       // .map(capsule => capsule.id); // Extract their IDs

    //setPreAddedTracker(preAddedIds);
    //console.log("Pre-added Capsule IDs: ", preAddedIds);
//}, [capsuleList]);

const updatePreAddedTracker = () => {
  const preAddedIds = capsuleList.reduce((ids, capsule) => {
    if (capsule.preAdded) {
      ids.push(capsule.id); // Add the ID if preAdded is true
    }
    return ids;
  }, []);

  setPreAddedTracker(preAddedIds);
  console.log("Pre-added Capsule IDs: ", preAddedIds);
};
 


  const sortNewestFirst = () => {
    const sorted = [...capsuleList].sort((a, b) => new Date(b.created) - new Date(a.created));
    setNewestFirst(sorted);
  };

  return (
    <CapsuleListContext.Provider value={{ 
      capsuleList, 
      capsuleCount,
      categoryCount,
      categoryNames,
      categoryStartIndices,
      sortedByCategory,
      newestFirst,
      preAddedTracker,
      updatePreAddedTracker,
      setCapsuleList, 
      removeCapsules, 
      updatePreAdded,
      updateCapsule, 
      updateCapsules,
      sortByCategory,
      sortNewestFirst,
      
      }}>
      {children}
    </CapsuleListContext.Provider>
  );
};
