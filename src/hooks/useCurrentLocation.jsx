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
