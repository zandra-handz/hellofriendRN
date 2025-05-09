import React, { useState } from 'react'; 
import FormLocationQuickCreate from '@/src/forms/FormLocationQuickCreate'; // Import the location creation form component

const InputAddLocationQuickSave = ({ friends, title, address }) => {
  const [locationList, setLocationList] = useState([]); // State to store location list

  const handleLocationCreate = (newLocation) => {
    // This function will be triggered when the child calls `onLocationCreate`
    console.log('Location created in parent:', newLocation);

    // Update the location list with the new location
    setLocationList(prevList => [newLocation, ...prevList]);

    // Optionally, you can close the form or do any other action here
    // For example: close modal, show success message, etc.
  };

  return (
    <FormLocationQuickCreate 
      onLocationCreate={handleLocationCreate} // Pass the handler to child component
      friends={friends}
      title={title}
      address={address}
    />
  );
};

export default InputAddLocationQuickSave;
