import { useSelectedFriend } from '../context/SelectedFriendContext';
 


const useLocationHelloFunctions = () => {
    const { friendDashboardData } = useSelectedFriend(); 

 

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
      
    const createLocationListWithHelloes = (allLocations, helloesListToSort) => {
        //console.log('Filtering favorite locations');
        //console.log(allLocations);
        //console.log(helloesListToSort);
      
        if (allLocations && helloesListToSort) { 
          const groupedHelloes = groupHelloesByLocations(helloesListToSort); // Example: { 1: [hello1, hello2], 3: [hello3] }
         
          const faves = allLocations
            .filter(location =>
              friendDashboardData[0].friend_faves.locations.includes(location.id)
            )
            .map(location => {
              
            const helloGroup = groupedHelloes[location.id] || [];
              const helloIds = helloGroup.map(hello => hello.id);
      
              return {
                ...location,
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

    };

};

export default useLocationHelloFunctions;