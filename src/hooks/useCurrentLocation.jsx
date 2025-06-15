// THIS ONLY EXISTS BECAUSE IT WAS A LEFTOVER FROM WHEN I WAS GETTING LOCATION VIA HOOK
// can remove in all components and replace with just deviceLocation directly
// just haven't done yet
import { useQueryClient } from '@tanstack/react-query'; 
import { useDeviceLocationContext } from '../context/DeviceLocationContext';
const useCurrentLocation = () => {
    const { deviceLocation, deviceRegion } = useDeviceLocationContext();
    const queryClient = useQueryClient();
  

  // Retrieve the formatted location data from the cache
    // const currentLocationDetails = queryClient.getQueryData('currentLocation');

     const currentLocationDetails = deviceLocation;
     
    // const currentRegion = queryClient.getQueryData('currentRegion');
    const currentRegion = deviceRegion;
    

   
  return { 
    currentLocationDetails,
    currentRegion
  };
};

export default useCurrentLocation;
