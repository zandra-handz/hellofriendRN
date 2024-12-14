import { useQueryClient } from '@tanstack/react-query'; 

const useCurrentLocation = () => {
    
    const queryClient = useQueryClient();
  

  // Retrieve the formatted location data from the cache
    const currentLocationDetails = queryClient.getQueryData('currentLocation');

    const currentRegion = queryClient.getQueryData('currentRegion');
    

   
  return { 
    currentLocationDetails,
    currentRegion
  };
};

export default useCurrentLocation;
