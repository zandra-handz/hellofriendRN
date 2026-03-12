// import { useCallback } from "react";

// const useMomentContextFunctions = () => {
//   const getPreAdded = useCallback((sortedList) => {
//     return sortedList.reduce((ids, capsule) => {
//       if (capsule.preAdded) ids.push(capsule.id);
//       return ids;
//     }, []);
//   }, []);

//   return {
//     getPreAdded,
//   };
// };

// export default useMomentContextFunctions;



import { useCallback } from "react";

const useMomentContextFunctions = () => {
  const getPreAdded = useCallback((sortedList) => {
    return sortedList.reduce((ids, capsule) => {
      if (capsule.preAdded) ids.push(capsule.id);
      return ids;
    }, []);
  }, []);

  return {
    getPreAdded,
  };
};

export default useMomentContextFunctions;