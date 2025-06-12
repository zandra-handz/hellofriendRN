import { useSelectedFriend } from '../context/SelectedFriendContext';

const useLocationHelloFunctions = () => {
    const { friendDashboardData } = useSelectedFriend(); 
    const bermudaCoords = { latitude: 27.0000, longitude: -71.0000 };
  
    const groupHelloesByLocations = (helloesListToSort) => {
        const groupedHelloes = helloesListToSort.reduce((acc, item) => {
          const locationId = item.location; 

          if (!acc[locationId]) {
            acc[locationId] = [];
          }
      
          acc[locationId].push(item);
    
          return acc;
        }, {});
      
        return groupedHelloes;
      };
      
      const createLocationListWithHelloes = (helloesListToSort, faveLocations) => {
        if (faveLocations && helloesListToSort) {
          const groupedHelloes = groupHelloesByLocations(helloesListToSort);
      
  // i think this is because if you delete from a friend's faves it'll lose this connection
          const faves = faveLocations.map(location => {
              //console.log(location.latitude, location.longitude);
              // Validate latitude and longitude
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
      
              // If either is invalid, replace both with Bermuda Triangle coordinates
              const latitude = isLatitudeValid && isLongitudeValid
                ? location.latitude
                : bermudaCoords.latitude;
      
              const longitude = isLatitudeValid && isLongitudeValid
                ? location.longitude
                : bermudaCoords.longitude;
      
              const helloGroup = groupedHelloes[location.id] || [];
              const helloIds = helloGroup.map(hello => hello.id);
      
              return {
                ...location,
                latitude,
                longitude,
                helloIds,
                helloCount: helloIds.length,
              };
            });
      
          return faves;
        }
      
        return [];
      };
      
    

    return {
        groupHelloesByLocations,
        createLocationListWithHelloes,
        bermudaCoords,

    };

};

export default useLocationHelloFunctions;