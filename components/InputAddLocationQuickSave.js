import React from 'react'; 
import FormLocationQuickCreate from '../forms/FormLocationQuickCreate'; // Import the location creation form component

const InputAddLocationQuickSave = ({ onClose, friends, title, address }) => {
  return (
    <FormLocationQuickCreate onLocationCreate={onClose} friends={friends} title={title} address={address} />
  );
};

export default InputAddLocationQuickSave;