// THIS ONLY EXISTS BECAUSE IT WAS A LEFTOVER FROM WHEN I WAS GETTING LOCATION VIA HOOK
// can remove in all components and replace with just deviceLocation directly
// just haven't done yet 
import { useDeviceLocationContext } from '../context/DeviceLocationContext';
const useCurrentLocation = () => {
    const { deviceLocation, deviceRegion } = useDeviceLocationContext();
   
    console.warn('useCurrentLocation rerendered');
  

  // Retrieve the formatted location data from the cache
    // const currentLocationDetails = queryClient.getQueryData('currentLocation');

    const currentLocationDetails = deviceLocation;
    //  const currentLocationDetails = null;
     
    // const currentRegion = queryClient.getQueryData('currentRegion');
    const currentRegion = deviceRegion;
    

   
  return { 
    currentLocationDetails,
    currentRegion
  };
};

export default useCurrentLocation;
