import React from 'react';
import FormLocationUpdate from '../forms/FormLocationUpdate'; // Import the location update form component

const InputUpdateLocation = ({ onClose, id, friends, title, address, notes, latitude, longitude }) => {
  // Create a location object containing all necessary fields
  const location = {
    id,
    friends,
    title,
    address,
    notes,
    latitude,
    longitude,
    // Add more fields as needed
  };

  return (
    <FormLocationUpdate 
      onLocationUpdate={onClose} 
      location={location} // Pass the location object instead of individual props
    />
  );
};

export default InputUpdateLocation;
