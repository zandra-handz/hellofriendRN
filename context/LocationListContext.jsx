import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { useUpcomingHelloes } from './UpcomingHelloesContext';
import { fetchAllLocations, fetchLocationDetails } from '../api'; // Import the API methods

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);
  const [faveLocationList, setFaveLocationList] = useState([]);
  const [tempLocationList, setTempLocationList] = useState([]);
  const [savedLocationList, setSavedLocationList] = useState([]);
  const [validatedLocationList, setValidatedLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingSelectedLocation, setLoadingSelectedLocation] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState(null);
  const [loadingAdditionalDetails, setLoadingAdditionalDetails] = useState(false);
  const [isTemp, setIsTemp] = useState(false);
  const [isFave, setIsFave] = useState(false);
  const { authUserState } = useAuthUser(); 
  const { upcomingHelloes, isLoading } = useUpcomingHelloes(); // Access isLoading from UpcomingHelloesContext

  const extractZipCode = (address) => { 
    const zipCodePattern = /(?:\b\d{5}(?:-\d{4})?\b)/;
    const cleanedAddress = address.replace(/^\d+\s*/, '');
    const match = cleanedAddress.match(zipCodePattern);
    const zipCode = match ? match[0] : null; 
    return zipCode;
  };

  useEffect(() => {
    const fetchData = async () => {
      // Check if upcomingHelloes is available and not loading
      if (upcomingHelloes) {
        console.log('Fetching location list from API');
        setLoadingSelectedLocation(true);
        try {
          const locationData = await fetchAllLocations();
          const updatedLocationData = locationData.map(location => {
            const zipCode = extractZipCode(location.address);
            return {
              ...location,
              zipCode,
            };
          });
  
          console.log('Setting location list state');
          setLocationList(updatedLocationData);
          setLoadingSelectedLocation(true);
  
          if (updatedLocationData.length > 0) {
            console.log('Setting selected location');
            setSelectedLocation(updatedLocationData[0]);
          } else {
            setSelectedLocation(null);
          }
  
        } catch (error) {
          console.error('Error fetching location list:', error);
          setLoadingSelectedLocation(false); // Ensure loading state is reset on error
        }
      }
    };
  
    // Run fetchData only if authenticated, upcomingHelloes is loaded, and not loading
    if (upcomingHelloes) {
      fetchData();
    } else {
      console.log('Clearing location list and selected location due to authentication or loading state');
      setLocationList([]);
      setSelectedLocation(null); // Clear selectedLocation if not authenticated or if data is still loading
    }
  }, [upcomingHelloes]); // Dependencies
  
  useEffect(() => {
    console.log('useEffect: Updating selected location');
    if (locationList.length > 0 && !selectedLocation) {
      setSelectedLocation(locationList[0]);
    }
  }, [locationList]);

  useEffect(() => {
    console.log('useEffect: Updating validated location list');
    setValidatedLocationList(locationList.filter(location => location.validatedAddress));
  }, [locationList]);

  useEffect(() => {
    console.log('useEffect: Updating isTemp state');
    if (selectedLocation && selectedLocation.id) {
      const tempStatus = String(selectedLocation.id).startsWith('temp');
      setIsTemp(tempStatus);
      console.log(`isTemp set to: ${tempStatus}`);
    } else {
      setIsTemp(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    console.log('useEffect: Updating isFave state');
    if (selectedLocation && faveLocationList.length > 0) {
      const faveStatus = faveLocationList.some(location => location.id === selectedLocation.id);
      setIsFave(faveStatus);
      console.log(`isFave set to: ${faveStatus}`);
    } else {
      setIsFave(false);
    }
  }, [selectedLocation, faveLocationList]);

  useEffect(() => {
    console.log('useEffect: Setting temp location list');
    setTempLocationList(locationList.filter(location => String(location.id).startsWith('temp')));
  }, [locationList]);

  useEffect(() => {
    console.log('useEffect: Setting saved location list');
    setSavedLocationList(locationList.filter(location => !(String(location.id).startsWith('temp'))));
  }, [locationList]);

  useEffect(() => {
    if (!selectedLocation) return; // Early exit if no selected location
  
    console.log('Fetching additional location details');
    const updateAdditionalDetails = async () => {
      setLoadingAdditionalDetails(true);
      try {
        const details = await fetchLocationDetails({
          address: encodeURIComponent(`${selectedLocation.title} ${selectedLocation.address}`),
          lat: parseFloat(selectedLocation.latitude),
          lon: parseFloat(selectedLocation.longitude),
        });
        console.log('Additional location details fetched');
        setAdditionalDetails(details);
      } catch (err) {
        console.error('Error fetching location details:', err);
        setAdditionalDetails(null);
      } finally {
        setLoadingAdditionalDetails(false);
      }
    };
  
    updateAdditionalDetails();
  }, [selectedLocation]);
  

  const populateFaveLocationsList = (locationIds) => {
    console.log('populateFaveLocationsList called with IDs:', locationIds);
    const favoriteLocations = locationList.filter(location => locationIds.includes(location.id));
    setFaveLocationList(favoriteLocations);
  };

  const addLocationToFaves = (locationId) => {
    console.log('addLocationToFaves called with ID:', locationId);
    const location = locationList.find(loc => loc.id === locationId);
    if (location && !faveLocationList.some(loc => loc.id === locationId)) {
      setFaveLocationList([...faveLocationList, location]);
    }
  };

  const removeLocationFromFaves = (locationId) => {
    console.log('removeLocationFromFaves called with ID:', locationId);
    const updatedFaves = faveLocationList.filter(loc => loc.id !== locationId);
    setFaveLocationList(updatedFaves);
  };

  return (
    <LocationListContext.Provider value={{ 
      locationList, 
      validatedLocationList, 
      faveLocationList, 
      tempLocationList,
      savedLocationList,
      selectedLocation, 
      additionalDetails, 
      setSelectedLocation, 
      populateFaveLocationsList, 
      addLocationToFaves, 
      removeLocationFromFaves, 
      setLocationList, 
      loadingSelectedLocation,
      loadingAdditionalDetails,
      isTemp, 
      isFave 
    }}>
      {children}
    </LocationListContext.Provider>
  );
};

export const useLocationList = () => {
  const context = useContext(LocationListContext);
  if (context === undefined) {
    throw new Error('useLocationList must be used within a LocationListProvider');
  }
  return context;
};

export default LocationListContext;
