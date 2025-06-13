import { useSelectedFriend } from '../context/SelectedFriendContext';

const useLocationHelloFunctions = () => {
    const { friendDashboardData } = useSelectedFriend(); 
    const bermudaCoords = { latitude: 27.0000, longitude: -71.0000 };
  
 

      // old code that did not filter out helloCounts of 0
      
      // const createLocationListWithHelloes = (helloesListToSort, allLocations) => {
      //   if (allLocations && helloesListToSort) {
      //     const groupedHelloes = groupHelloesByLocations(helloesListToSort);
      
      //   const helloLocations = allLocations.map(location => {
 
      //         const isLatitudeValid =
      //           location.latitude !== undefined &&
      //           isFinite(location.latitude) &&
      //           location.latitude >= -90 &&
      //           location.latitude <= 90;
      
      //         const isLongitudeValid =
      //           location.longitude !== undefined &&
      //           isFinite(location.longitude) &&
      //           location.longitude >= -180 &&
      //           location.longitude <= 180;
      
      //         // If either is invalid, replace both with Bermuda Triangle coordinates
      //         const latitude = isLatitudeValid && isLongitudeValid
      //           ? location.latitude
      //           : bermudaCoords.latitude;
      
      //         const longitude = isLatitudeValid && isLongitudeValid
      //           ? location.longitude
      //           : bermudaCoords.longitude;
      
      //         const helloGroup = groupedHelloes[location.id] || [];
      //         const helloIds = helloGroup.map(hello => hello.id);
      
      //         return {
      //           ...location,
      //           latitude,
      //           longitude,
      //           helloIds,
      //           helloCount: helloIds.length,
      //         };
      //       });
      
      //     return helloLocations;
      //   }
      
      //   return [];
      // };
      
// filters out locations with helloCounts of 0. this is only used for the map display
    const createLocationListWithHelloes = (helloesListToSort, allLocations) => {
  if (allLocations && helloesListToSort) {
    const helloLocations = allLocations
      .filter((location) => location.isPastHello) // ✅ Only include locations with helloes
      .map((location) => {
        const isLatitudeValid =
          location.latitude !== undefined &&
          isFinite(location.latitude) &&
          location.latitude >= -90 &&
          location.latitude <= 90;

        const isLongitudeValid =
          location.longitude !== undefined &&
          isFinite(location.longitude) &&
          location.longitude >= -180 &&
          location.longitude <= 180;

        const latitude =
          isLatitudeValid && isLongitudeValid
            ? location.latitude
            : bermudaCoords.latitude;

        const longitude =
          isLatitudeValid && isLongitudeValid
            ? location.longitude
            : bermudaCoords.longitude;

        return {
          ...location,
          latitude,
          longitude,
          // Since you're not grouping anymore, these can be removed or populated differently
          helloIds: [],            // optional: fill this if needed
          helloCount: location.helloCount || 1, // fallback to 1 or known count
        };
      });

    return helloLocations;
  }

  return [];
};


    

    return { 
        createLocationListWithHelloes,
        bermudaCoords,

    };

};

export default useLocationHelloFunctions;