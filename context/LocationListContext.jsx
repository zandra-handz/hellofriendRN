import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
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
  const [loadingAdditionalDetails, setLoadingAdditionalDetails ] = useState(false);
  const [isTemp, setIsTemp] = useState(false);
  const [isFave, setIsFave] = useState(false);
  const { authUserState } = useAuthUser();

  const extractZipCode = (address) => {
    const zipCodePattern = /(?:\b\d{5}(?:-\d{4})?\b)/;
    const cleanedAddress = address.replace(/^\d+\s*/, '');
    const match = cleanedAddress.match(zipCodePattern);
    return match ? match[0] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
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

        setLocationList(updatedLocationData);
        setLoadingSelectedLocation(false); 

        // Automatically set selectedLocation to the first item if locationList is not empty
        if (updatedLocationData.length > 0) {
          setSelectedLocation(updatedLocationData[0]); 
        } else {
          setSelectedLocation(null);  
        }

      } catch (error) {
        console.error('Error fetching location list:', error);
        setLoadingSelectedLocation(true);
      }
    };

    if (authUserState.authenticated) {
      fetchData();
    } else {
      setLocationList([]);
      setSelectedLocation(null); // Clear selectedLocation if not authenticated
    }
  }, [authUserState.authenticated]);

  useEffect(() => {
    if (locationList.length > 0) {
      setSelectedLocation(locationList[0]);
    }
  }, [locationList]);

  useEffect(() => {
    setValidatedLocationList(locationList.filter(location => location.validatedAddress));
  }, [locationList]);

  useEffect(() => {
    if (selectedLocation && selectedLocation.id) {
      setIsTemp(String(selectedLocation.id).startsWith('temp'));
    } else {
      setIsTemp(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation && faveLocationList.length > 0) {
      setIsFave(faveLocationList.some(location => location.id === selectedLocation.id));
    } else {
      setIsFave(false);
    }
  }, [selectedLocation, faveLocationList]);

  useEffect(() => {
    setTempLocationList(locationList.filter(location => String(location.id).startsWith('temp')));
  }, [locationList]);

  useEffect(() => {
    setSavedLocationList(locationList.filter(location => !(String(location.id).startsWith('temp'))));
  }, [locationList]);

  useEffect(() => {
    const updateAdditionalDetails = async () => {
      setLoadingAdditionalDetails(true);
      try {
        if (selectedLocation && selectedLocation.id) {
          console.log('Fetching additional details for location:', selectedLocation);
          const details = await fetchLocationDetails({
            address: encodeURIComponent(`${selectedLocation.title} ${selectedLocation.address}`),
            lat: parseFloat(selectedLocation.latitude),
            lon: parseFloat(selectedLocation.longitude),
          });
          console.log('Fetched additional details:', details);
          setAdditionalDetails(details);
          setLoadingAdditionalDetails(false);
        } else {
          console.log('No selected location. Resetting additional details.');
          setAdditionalDetails(null);
          setLoadingAdditionalDetails(false);
        }
      } catch (err) {
        console.error('Error fetching location details:', err);
        setAdditionalDetails(null);
        setLoadingAdditionalDetails(false);
      }
    };

    updateAdditionalDetails();
  }, [selectedLocation]);

  const populateFaveLocationsList = (locationIds) => {
    const favoriteLocations = locationList.filter(location => locationIds.includes(location.id));
    setFaveLocationList(favoriteLocations);
  };

  const addLocationToFaves = (locationId) => {
    const location = locationList.find(loc => loc.id === locationId);
    if (location && !faveLocationList.some(loc => loc.id === locationId)) {
      setFaveLocationList([...faveLocationList, location]);
    }
  };

  const removeLocationFromFaves = (locationId) => {
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
